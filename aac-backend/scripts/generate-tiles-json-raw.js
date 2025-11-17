const fs = require('fs');
const path = require('path');

// Reads AAC TypeScript files as plain text and extracts tiles to a JSON file.
// It does not execute JS/TS; it uses regex heuristics suitable for the project's files.

function extractTilesFromContent(content) {
  // Find color constant, e.g. export const THINGS_TILES_COLOR = "green";
  const colorMatch = content.match(/export\s+const\s+(\w+_TILES_COLOR)\s*=\s*["']([^"']+)["']/);
  const colorName = colorMatch ? colorMatch[1] : null;
  const colorValue = colorMatch ? colorMatch[2] : null;

  // Match tile entries like: key: { image: "/path", text: "Text", sound: "...", tileColor: ... },
  const tileRegex = /([a-zA-Z0-9_]+)\s*:\s*{([\s\S]*?)\}\s*,?/g;
  const tiles = {};
  let m;
  while ((m = tileRegex.exec(content))) {
    const key = m[1];
    const inner = m[2];

    const imageMatch = inner.match(/image\s*:\s*["']([^"']+)["']/);
    const textMatch = inner.match(/text\s*:\s*["']([^"']+)["']/);
    const soundMatch = inner.match(/sound\s*:\s*["']([^"']+)["']/);
    const tileColorMatch = inner.match(/tileColor\s*:\s*([^,\n]+)/);

    let tileColor = null;
    if (tileColorMatch) {
      const raw = tileColorMatch[1].trim();
      // raw might be a constant like THINGS_TILES_COLOR or a string
      const constMatch = raw.match(/^[A-Z0-9_]+$/);
      const stringMatch = raw.match(/^["']([^"']+)["']$/);
      if (stringMatch) tileColor = stringMatch[1];
      else if (constMatch && colorName && raw === colorName) tileColor = colorValue;
      else tileColor = raw.replace(/['"]/g, '');
    }

    tiles[key] = {
      image: imageMatch ? imageMatch[1] : null,
      text: textMatch ? textMatch[1] : null,
      sound: soundMatch ? soundMatch[1] : null,
      tileColor: tileColor,
    };
  }

  return { colorName, colorValue, tiles };
}

function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generate() {
  const aacDir = path.join(__dirname, '../data/AAC');
  const entries = fs.readdirSync(aacDir, { withFileTypes: true });

  const categories = {};

  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (e.name === 'manualTiles') continue;

    const catDir = path.join(aacDir, e.name);
    const files = fs.readdirSync(catDir).filter((f) => f.endsWith('.ts'));

    const combined = files
      .map((f) => fs.readFileSync(path.join(catDir, f), 'utf8'))
      .join('\n');

    const { colorValue, tiles } = extractTilesFromContent(combined);

    // Convert extracted tiles object to array
    const tileArray = Object.entries(tiles).map(([key, v]) => ({
      key,
      text: v.text || capitalize(key),
      image: v.image || '',
      sound: v.sound || (v.text || key),
      tileColor: v.tileColor || colorValue || null,
    }));

    // Add a category tile at the front
    const categoryTile = {
      key: e.name,
      text: capitalize(e.name),
      image: tileArray.length ? tileArray[0].image : '',
      sound: capitalize(e.name),
      tileColor: colorValue || null,
    };

    categories[e.name] = {
      name: capitalize(e.name),
      color: colorValue || null,
      tiles: [categoryTile, ...tileArray],
    };
  }

  // write JSON
  const outPath = path.join(aacDir, 'tiles.json');
  fs.writeFileSync(outPath, JSON.stringify(categories, null, 2), 'utf8');
  console.log('Wrote', outPath);
}

if (require.main === module) generate();

module.exports = { extractTilesFromContent, generate };
