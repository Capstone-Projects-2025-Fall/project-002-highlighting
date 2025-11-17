const fs = require('fs');
const path = require('path');

// Reads data/AAC/tiles.json and creates a simple SQL file to import categories and words.
// The generated SQL uses the current TypeORM entities' table names: category, word, and the join table
// naming convention (word_categories_category). The script writes `scripts/tiles_import.sql`.

function escapeSql(s) {
  if (s === null || s === undefined) return 'NULL';
  return "'" + String(s).replace(/'/g, "''") + "'";
}

function generateSql() {
  const tilesPath = path.join(__dirname, '../data/AAC/tiles.json');
  if (!fs.existsSync(tilesPath)) {
    console.error('tiles.json not found; run generate-tiles-json-raw.js first');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(tilesPath, 'utf8'));
  const stmts = [];

  // Insert categories
  for (const [catKey, cat] of Object.entries(data)) {
    const name = cat.name || catKey;
    const tileColor = cat.color || null;
    stmts.push(`-- Category ${name}`);
    stmts.push(
      `INSERT INTO category (name, description, "tileColor") VALUES (${escapeSql(name)}, ${escapeSql(null)}, ${escapeSql(tileColor)}) ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";`
    );
  }

  // Insert words and join rows
  for (const [catKey, cat] of Object.entries(data)) {
    const categoryName = cat.name || catKey;
    for (const tile of (cat.tiles || [])) {
      // skip the category tile itself if you don't want to import it as a word; keep for completeness
      const text = tile.text || tile.key;
      const symbol = tile.image || null;
      const tileColor = tile.tileColor || null;

      stmts.push(`-- Word ${text} (category: ${categoryName})`);
      stmts.push(
        `INSERT INTO word (text, symbol, "tileColor") VALUES (${escapeSql(text)}, ${escapeSql(symbol)}, ${escapeSql(tileColor)}) ON CONFLICT DO NOTHING;`
      );

      // join: assume join table name 'word_categories_category' with columns "wordId","categoryId"
      stmts.push(
        `INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text=${escapeSql(text)} LIMIT 1),(SELECT id FROM category WHERE name=${escapeSql(categoryName)} LIMIT 1)) ON CONFLICT DO NOTHING;`
      );
    }
  }

  const out = path.join(__dirname, 'tiles_import.sql');
  fs.writeFileSync(out, stmts.join('\n') + '\n', 'utf8');
  console.log('Wrote', out);
}

if (require.main === module) generateSql();

module.exports = { generateSql };
