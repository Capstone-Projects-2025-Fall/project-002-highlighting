const fs = require('fs');
const path = require('path');

function extractTilesFromFile(fileContent) {
    // Extract color constant
    const colorMatch = fileContent.match(/export const \w+_TILES_COLOR = ["']([^"']+)["']/);
    const color = colorMatch ? colorMatch[1] : null;

    // Extract the main tiles object - match any assignment pattern
    const mainObjectMatch = fileContent.match(/(?:const|let|var)\s+(\w+)\s*=\s*({[\s\S]*?^});/m);
    if (!mainObjectMatch) return { color, tiles: {} };

    let objectStr = mainObjectMatch[2];
    const varName = mainObjectMatch[1];
    
    // Replace color constant with actual color value
    if (color) {
        objectStr = objectStr.replace(new RegExp(`\\b\\w+_TILES_COLOR\\b`, 'g'), `"${color}"`);
    }

    // Clean up the object string to make it valid JSON
    objectStr = objectStr
        // Remove all whitespace between consecutive line ends to handle empty lines
        .replace(/\n\s*\n/g, '\n')
        // Normalize remaining whitespace
        .replace(/\s+/g, ' ')
        // Handle path strings specifically to avoid double-quoting
        .replace(/: *"(\/[^"]+)"/g, ': "$1"')
        // Add quotes around unquoted object keys
        .replace(/([a-zA-Z0-9_]+):/g, '"$1":')
        // Replace remaining single quotes with double quotes
        .replace(/'/g, '"')
        // Remove trailing commas
        .replace(/,(\s*[}\]])/g, '$1')
        // Final whitespace cleanup
        .replace(/\s+/g, ' ');

    try {
        console.log('Variable name:', varName);
        console.log('Cleaned object string:', objectStr);
        
        // Parse the cleaned object string
        const parsedObj = JSON.parse(objectStr);
        console.log('Parsed object:', JSON.stringify(parsedObj, null, 2));
        
        // For objects named after their category, use the whole object as tiles
        if (varName.endsWith('s') && ['animals', 'colors', 'body', 'tools'].includes(varName)) {
            console.log('Using whole object for plural category:', varName);
            return { color, tiles: parsedObj };
        }
        
        // If we have a nested property matching the category name, use that
        if (parsedObj[varName]) {
            console.log('Found nested category object:', varName);
            return { color, tiles: parsedObj[varName] };
        }
        
        // If there's only one top-level object that's not a tile property, use it
        const keys = Object.keys(parsedObj);
        console.log('Object keys:', keys);
        if (keys.length === 1 && !['text', 'image', 'sound', 'tileColor'].includes(keys[0])) {
            console.log('Using single top-level object:', keys[0]);
            return { color, tiles: parsedObj[keys[0]] };
        }
        
        // Otherwise, assume the whole object is tiles
        console.log('Using whole object as tiles');
        return { color, tiles: parsedObj };
    } catch (e) {
        console.error('Failed to parse tiles object:', e);
        console.error('Error details:', e.message);
        console.error('Failed object string:', objectStr);
        return { color, tiles: {} };
    }
}

function processAAC() {
    const aacDir = path.join(__dirname, '../data/AAC');
    const categories = {};

    // Read all directories (categories)
    const entries = fs.readdirSync(aacDir, { withFileTypes: true });
    
    for (const entry of entries) {
        if (!entry.isDirectory() || entry.name === 'manualTiles') continue;

        const categoryFile = path.join(aacDir, entry.name, `${entry.name}.ts`);
        if (!fs.existsSync(categoryFile)) {
            console.log(`Skipping ${entry.name}: No category file found`);
            continue;
        }

        try {
            const fileContent = fs.readFileSync(categoryFile, 'utf8');
            const { color, tiles } = extractTilesFromFile(fileContent);
            
            // Create category entry
            categories[entry.name] = {
                name: entry.name.charAt(0).toUpperCase() + entry.name.slice(1),
                color: color,
                tiles: Object.entries(tiles || {}).map(([key, value]) => ({
                    key,
                    text: value.text || key,
                    image: value.image || "",
                    sound: value.sound || key,
                    tileColor: value.tileColor || color
                }))
            };

            console.log(`Processed category: ${entry.name}`);
        } catch (error) {
            console.error(`Error processing ${entry.name}:`, error);
        }
    }

    // Write the combined data to tiles.json
    fs.writeFileSync(
        path.join(aacDir, 'tiles.json'),
        JSON.stringify(categories, null, 2)
    );
    console.log('Generated tiles.json');
}

processAAC();