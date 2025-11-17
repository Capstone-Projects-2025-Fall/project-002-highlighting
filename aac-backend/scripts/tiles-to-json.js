/*
  tiles-to-json.js
  - Parses aac-backend/data/AAC/Tiles.ts and resolves imported object literals
  - Writes aac-backend/data/AAC/tiles.json

  This uses the TypeScript compiler API (typescript package is in devDependencies).
*/
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const projectRoot = path.resolve(__dirname, '..');
const entryFile = path.join(projectRoot, 'data', 'AAC', 'Tiles.ts');
const outFile = path.join(projectRoot, 'data', 'AAC', 'tiles.json');

const visited = new Set();

function readSource(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

function resolveModuleSpecifier(spec, containingFile) {
  // handle alias @/ => projectRoot/
  if (spec.startsWith('@/')) {
    const p = path.join(projectRoot, spec.slice(2));
    return tryExtensions(p);
  }
  if (spec.startsWith('./') || spec.startsWith('../')) {
    const p = path.join(path.dirname(containingFile), spec);
    return tryExtensions(p);
  }
  // absolute or other - try relative to projectRoot
  if (spec.startsWith('/')) {
    return tryExtensions(path.join(projectRoot, spec));
  }
  // fallback: treat as relative to project root
  return tryExtensions(path.join(projectRoot, spec));
}

function tryExtensions(base) {
  const exts = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.js'];
  if (fs.existsSync(base)) {
    const stats = fs.statSync(base);
    if (stats.isFile()) return base;
    if (stats.isDirectory()) {
      for (const e of exts) {
        const p = base + e;
        if (fs.existsSync(p)) return p;
      }
    }
  }
  for (const e of exts) {
    if (fs.existsSync(base + e)) return base + e;
  }
  return null;
}

function parseFileToAST(filePath) {
  const src = readSource(filePath);
  if (src === null) return null;
  return ts.createSourceFile(filePath, src, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
}

function buildImportMap(sourceFile) {
  const map = new Map();
  sourceFile.forEachChild((node) => {
    if (ts.isImportDeclaration(node)) {
      const mod = node.moduleSpecifier && node.moduleSpecifier.text;
      if (!mod) return;
      const importClause = node.importClause;
      if (!importClause) return;
      // default import: import foo from '...'
      if (importClause.name) {
        map.set(importClause.name.text, mod);
      }
      // named bindings: import { a as b } from '...'
      if (importClause.namedBindings && ts.isNamedImports(importClause.namedBindings)) {
        importClause.namedBindings.elements.forEach((el) => {
          const name = el.name.text;
          const orig = el.propertyName ? el.propertyName.text : name;
          map.set(name, mod + '::' + orig);
        });
      }
    }
  });
  return map;
}

function findVariableInitializerByName(sourceFile, name) {
  let found = null;
  sourceFile.forEachChild((node) => {
    if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach((decl) => {
        if (ts.isIdentifier(decl.name) && decl.name.text === name) {
          found = decl.initializer;
        }
      });
    }
    // also check export const X = ...
    if (ts.isExportAssignment(node)) {
      // export default X
      if (node.isExportEquals === false && node.expression && ts.isIdentifier(node.expression) && node.expression.text === name) {
        // later resolution
        found = { __identifier: name };
      }
    }
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      // skip
    }
  });
  return found;
}

function findDefaultExport(sourceFile) {
  let result = null;
  sourceFile.forEachChild((node) => {
    if (ts.isExportAssignment(node)) {
      // export default <expr>
      result = node.expression;
    }
    // also: export default identifier; handled above
  });
  // also check for 'export default <identifier>;' handled
  if (result) return result;
  // fallback: find 'export default <identifier>' pattern in statements
  let ident = null;
  sourceFile.forEachChild((node) => {
    if (ts.isExportDeclaration(node) && node.isTypeOnly === false) {
      // not helpful
    }
  });
  return result;
}

function evaluate(node, containingFile, importMap) {
  if (!node) return null;
  if (ts.isObjectLiteralExpression(node)) {
    const obj = {};
    node.properties.forEach((prop) => {
      if (ts.isPropertyAssignment(prop)) {
        const key = getNameFromPropertyName(prop.name);
        const value = evaluate(prop.initializer, containingFile, importMap);
        obj[key] = value;
      } else if (ts.isShorthandPropertyAssignment(prop)) {
        const key = prop.name.text;
        obj[key] = null; // placeholder
      }
    });
    return obj;
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map((e) => evaluate(e, containingFile, importMap));
  }
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isIdentifier(node)) {
    const name = node.text;
    // if identifier maps to an import, resolve that module
    if (importMap && importMap.has(name)) {
      const mod = importMap.get(name);
      // mod may contain ::originalName for named imports
      const parts = mod.split('::');
      const spec = parts[0];
      const origName = parts[1];
      const resolved = resolveModuleSpecifier(spec, containingFile);
      if (!resolved) return null;
      return resolveExportedValue(resolved, origName);
    }
    // Otherwise, attempt to find variable in same file
    const sf = parseFileToAST(containingFile);
    let found = null;
    sf.forEachChild((n) => {
      if (ts.isVariableStatement(n)) {
        n.declarationList.declarations.forEach((d) => {
          if (ts.isIdentifier(d.name) && d.name.text === name) {
            found = d.initializer;
          }
        });
      }
    });
    if (found) return evaluate(found, containingFile, importMap);
    return null;
  }
  // fallback: try to get text
  try { return node.getText(); } catch (e) { return null; }
}

function getNameFromPropertyName(nameNode) {
  if (ts.isIdentifier(nameNode)) return nameNode.text;
  if (ts.isStringLiteral(nameNode) || ts.isNumericLiteral(nameNode)) return nameNode.text;
  return nameNode.getText();
}

function resolveExportedValue(filePath, origName) {
  const abs = filePath;
  if (visited.has(abs)) return null; // prevent cycles
  visited.add(abs);
  const sf = parseFileToAST(abs);
  if (!sf) return null;
  const importMap = buildImportMap(sf);

  // if origName provided, find that export
  if (origName) {
    // find exported variable with that name
    let found = null;
    sf.forEachChild((n) => {
      if (ts.isVariableStatement(n)) {
        n.declarationList.declarations.forEach((d) => {
          if (ts.isIdentifier(d.name) && d.name.text === origName) {
            found = d.initializer;
          }
        });
      }
      // also support 'export const X = ...'
      if (ts.isExportAssignment(n)) {
        // skip
      }
    });
    if (found) return evaluate(found, abs, importMap);
  }

  // try default export
  const defaultExp = findDefaultExport(sf);
  if (defaultExp) {
    if (ts.isIdentifier(defaultExp)) {
      // find variable by that identifier
      const id = defaultExp.text;
      let found = null;
      sf.forEachChild((n) => {
        if (ts.isVariableStatement(n)) {
          n.declarationList.declarations.forEach((d) => {
            if (ts.isIdentifier(d.name) && d.name.text === id) {
              found = d.initializer;
            }
          });
        }
      });
      if (found) return evaluate(found, abs, importMap);
    }
    // if defaultExp is object literal
    if (ts.isObjectLiteralExpression(defaultExp)) return evaluate(defaultExp, abs, importMap);
  }

  // fallback: find first exported variable (export const X)
  let firstExport = null;
  sf.forEachChild((n) => {
    if (ts.isVariableStatement(n) && n.modifiers && n.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      n.declarationList.declarations.forEach((d) => {
        if (d.initializer) firstExport = d.initializer;
      });
    }
  });
  if (firstExport) return evaluate(firstExport, abs, importMap);
  return null;
}

function extractDataFromEntry(entryPath) {
  const sf = parseFileToAST(entryPath);
  if (!sf) throw new Error('Cannot read entry file: ' + entryPath);
  const importMap = buildImportMap(sf);

  // find const data = { ... } or export default data
  let dataNode = null;
  sf.forEachChild((node) => {
    if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach((decl) => {
        if (ts.isIdentifier(decl.name) && decl.name.text === 'data') {
          dataNode = decl.initializer;
        }
      });
    }
    if (ts.isExportAssignment(node)) {
      // export default data
      if (ts.isIdentifier(node.expression) && node.expression.text === 'data') {
        // find the variable declaration above; handled earlier
      }
    }
  });

  if (!dataNode) {
    // maybe default export directly
    const def = findDefaultExport(sf);
    if (def && ts.isObjectLiteralExpression(def)) dataNode = def;
  }
  if (!dataNode) throw new Error('Could not find data object in ' + entryPath);
  return evaluate(dataNode, entryPath, importMap);
}

// Run
try {
  console.log('Parsing', entryFile);
  const obj = extractDataFromEntry(entryFile);
  if (!obj) throw new Error('Extraction returned null');
  const json = JSON.stringify(obj, null, 2);
  fs.writeFileSync(outFile, json, 'utf8');
  console.log('Wrote', outFile);
} catch (e) {
  console.error('Failed to convert tiles to JSON:', e && e.stack ? e.stack : e);
  process.exit(1);
}

