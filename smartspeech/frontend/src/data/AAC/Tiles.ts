import { TileAssets, TileData } from "@/components/AAC/TileTypes";
import body from "@/data/AAC/body/body";
import colors, { COLOR_TILES_COLOR } from "./colors/colors";
import shapes from "./shapes/shapes";
import foods from "./foods/foods";
import locations, { LOCATION_TILES_COLOR } from "./locations/locations";
import clothes from "./clothes/clothes";
import feelings from "./feelings/feelings";
import things from "./things/things";
import tell from "./tell/tell";
import these from "./these/these";
import they from "./they/they";
import touch from "./touch/touch";
import { TileProps } from "@/components/AAC/Tile";
import is from "./is/is";
import animals from "./animals/animals";
import electronics from "./electronics/electronics";
import { fetchCategories, fetchWords } from "@/lib/api";

/**
 * Maps words to tile data for each tile in our AAC board
 */
const data: TileAssets = {
  colors: {
    image: "/AAC_assets/img/colors/colorwheel.png",
    text: "Colors",
    sound: "Colors",
    tileColor: COLOR_TILES_COLOR,
    subTiles: colors,
  },
  good: {
    image: "/AAC_assets/img/standard/good.png",
    text: "Good",
    sound: "good",
    tileColor: "green",
  },
  bad: {
    image: "/AAC_assets/img/standard/bad.png",
    text: "Bad",
    sound: "Bad",
    tileColor: "red",
  },
  stop: {
    image: "/AAC_assets/img/standard/stop.png",
    text: "Stop",
    sound: "Stop",
    tileColor: "red",
  },
  shapes: {
    image: "/AAC_assets/img/shapes/shapes.png",
    text: "Shape",
    sound: "Shape",
    tileColor: "yellow",
    subTiles: shapes,
  },
  self: {
    image: "/AAC_assets/img/standard/self.png",
    text: "I",
    sound: "Eye",
    tileColor: "blue",
  },
  you: {
    image: "/AAC_assets/img/standard/you.png",
    text: "You",
    sound: "You",
    tileColor: "green",
  },
  eat: {
    image: "/AAC_assets/img/food/eat.png",
    text: "Eat",
    sound: "Eat",
    tileColor: "green",
    subTiles: foods,
  },
  go: {
    image: "/AAC_assets/img/locations/go.png",
    text: "Go",
    sound: "Go",
    tileColor: "yellow",
    subTiles: locations,
  },
  clothing: {
    image: "/AAC_assets/img/clothes/clothes.png",
    text: "Clothes",
    sound: "Clothes",
    tileColor: "purple",
    subTiles: clothes,
  },
  feelings: {
    image: "/AAC_assets/img/feelings/feelings.png",
    text: "Feelings",
    sound: "Feelings",
    tileColor: "blue",
    subTiles: feelings,
  },
  things: {
    image: "/AAC_assets/img/things/things.png",
    text: "Things",
    sound: "Things",
    tileColor: "red",
    subTiles: things,
  },
  animals: {
    image: "/AAC_assets/img/animals/animal.png",
    text: "Animals",
    sound: "Animals",
    tileColor: "green",
    subTiles: animals,
  },
  tell: {
    image: "/AAC_assets/img/tell/tell.png",
    text: "Tell",
    sound: "Tell",
    tileColor: "yellow",
    subTiles: tell,
  },
  these: {
    image: "/AAC_assets/img/this/this.png",
    text: "This",
    sound: "This",
    tileColor: "green",
    subTiles: these,
  },
  they: {
    image: "/AAC_assets/img/they/they.png",
    text: "They",
    sound: "They",
    tileColor: "yellow",
    subTiles: they,
  },
  body: {
    image: "/AAC_assets/img/body/body.png",
    text: "Body",
    sound: "Body",
    tileColor: "orange",
    subTiles: body,
  },
  touch: {
    image: "/AAC_assets/img/touch/touch.png",
    text: "Touch",
    sound: "Touch",
    tileColor: "blue",
    subTiles: touch,
  },
  is: {
    image: "/AAC_assets/img/is/is.png",
    text: "Is",
    sound: "is",
    tileColor: "blue",
    subTiles: is,
  },
  technology: {
    image: "/AAC_assets/img/electronics/technology.png",
    text: "Technology",
    sound: "Technology",
    tileColor: "blue",
    subTiles: electronics,
  },
};

export const mockSuggestedTileData: TileAssets = {
  bathroom: {
    image: "/AAC_assets/img/locations/bathroom.png",
    text: "Bathroom",
    sound: "Bathroom",
    tileColor: LOCATION_TILES_COLOR,
  },
  hospital: {
    image: "/AAC_assets/img/locations/hospital.png",
    text: "Hospital",
    sound: "Hospital",
    tileColor: LOCATION_TILES_COLOR,
  },
  stop: {
    image: "/AAC_assets/img/standard/stop.png",
    text: "Stop",
    sound: "Stop",
    tileColor: "red",
  },
};

export const blacklist: TileProps[] = [data.good, data.bad];

export default data;

/**
 * Lower-level helper to normalize arbitrary names into canonical keys used by the board.
 * Matches the keying used in the original static `data` (lowercase, no spaces/punctuation).
 */
function toKey(name: string) {
  return String(name).replace(/\s+/g, "").replace(/[^\w]/g, "").toLowerCase();
}

function toTileColor(color?: string | null) {
  const allowed = ["yellow", "green", "blue", "orange", "red", "purple", "gray"];
  if (!color) return "blue";
  const c = String(color).toLowerCase();
  return (allowed.includes(c) ? c : "blue") as TileData["tileColor"];
}

/**
 * Build a TileAssets map from backend categories and words.
 * Returns a shape identical to the static `data` so the UI can consume it directly.
 */
export async function buildTilesFromBackend(): Promise<TileAssets> {
  const tiles: TileAssets = {};

  // fetch backend entities
  const categories = await fetchCategories().catch(() => []);
  const words = await fetchWords().catch(() => []);

  // Build helper maps from the static `data` so we can resolve mismatched
  // backend category names to the canonical top-level keys used by the app.
  const staticNameToKey = new Map<string, string>();
  const staticImageToKey = new Map<string, string>();
  for (const [k, v] of Object.entries(data)) {
    const txt = String(v.text ?? "").trim().toLowerCase();
    if (txt) staticNameToKey.set(txt, k);
    if (v.image) staticImageToKey.set(String(v.image), k);
  }

  // create category placeholders
  const catMap = new Map<string, string>(); // normalized name -> key
  const mappingRecords: Array<{ incoming: string; canonical: string; usedStatic: boolean; layout?: number | undefined }> = [];
  for (const c of categories || []) {
    const name = String(c.name ?? c.text ?? c.title ?? "").trim();
    const key = c.slug ?? toKey(name) ?? name;
    // Only include categories at the top-level if the static `data` defines them
    // (preserve original board structure), or if the backend explicitly provides a layout index.
    const layout = (typeof c.home_layout === 'number') ? c.home_layout : (typeof c.layout === 'number' ? c.layout : undefined);
    // determine if this category corresponds to an existing static top-level key
    const nameLower = String(name).trim().toLowerCase();
    const staticKeyByName = staticNameToKey.get(nameLower);
    const staticKeyByImage = c.symbol ? staticImageToKey.get(String(c.symbol)) : undefined;

    // prefer direct static matches first
    let staticKey = staticKeyByName ?? staticKeyByImage ?? (data[toKey(name)] ? toKey(name) : undefined);

    // quick synonyms map for known mismatches (fallback if heuristics don't find a static key)
    const SYNONYMS: Record<string, string> = {
      locations: "go",
      location: "go",
      places: "go",
    };
    if (!staticKey) {
      const syn = SYNONYMS[nameLower] ?? SYNONYMS[toKey(name)];
      if (syn && data[syn]) staticKey = syn;
    }

    // If no static mapping and the backend provided a layout, try an overlap heuristic
    // to find the static top-level whose subTiles overlap the most with this category's words.
    if (!staticKey && typeof layout === 'number') {
      const backendWordNames = (words || [])
        .filter((w: any) => {
          const cats: string[] = Array.isArray(w.categories) ? w.categories : (w.category ? [w.category] : []);
          return cats.map((cc) => String(cc || "").trim().toLowerCase()).includes(nameLower);
        })
        .map((w: any) => String(w.name ?? w.text ?? w.title ?? "").trim().toLowerCase());

      if (backendWordNames.length > 0) {
        let bestKey: string | undefined;
        let bestCount = 0;
        for (const [k, v] of Object.entries(data)) {
          if (!v.subTiles) continue;
          const subNames = Object.values(v.subTiles).map((st) => String(st.text ?? "").trim().toLowerCase());
          const count = backendWordNames.filter((bn: string) => subNames.includes(bn)).length;
          if (count > bestCount) {
            bestCount = count;
            bestKey = k;
          }
        }
        if (bestCount > 0 && bestKey) staticKey = bestKey;
      }
    }

    const canonicalKey = staticKey ?? key;
    const staticExists = Boolean(data[canonicalKey]);
    // record mapping for debugging
    mappingRecords.push({ incoming: name, canonical: canonicalKey, usedStatic: staticExists, layout });

    if (!staticExists && typeof layout !== 'number') {
      // do not add this category to the top-level tiles (it wasn't in the original board and has no layout)
      // still record it in the name->key map so words referencing it can be attached if needed
      catMap.set(nameLower, key);
      continue;
    }

    // start with the static tile if present so we preserve subTiles and canonical keys
    let tile: TileData;
    if (staticExists) {
      tile = { ...(data[canonicalKey] as TileData) };
      // override image/text/color if backend provides them
      if (c.symbol || c.image_url || c.image) tile.image = c.symbol ?? c.image_url ?? c.image;
      if (c.name) tile.text = name;
      if (c.color) tile.tileColor = toTileColor(c.color);
    } else {
      tile = {
        image: c.symbol ?? c.image_url ?? c.image ?? "/AAC_assets/img/standard/custom.png",
        text: name,
        tileColor: (c.color ? toTileColor(c.color) : toTileColor(undefined)),
      } as TileData;
    }

    if (typeof layout === 'number') (tile as any).home_layout = layout;

    tiles[canonicalKey] = tile;
    catMap.set(nameLower, canonicalKey);
    // If the static data has a subTiles map for this key, clone it so we preserve
    // the original subTiles structure (keys, ordering, images, colors) and merge backend words into it.
    if (staticExists && data[canonicalKey] && data[canonicalKey].subTiles) {
      tiles[canonicalKey].subTiles = { ...(data[canonicalKey].subTiles as TileAssets) };
    }
  }

  // attach words to categories (subTiles) and add to flat map
  for (const w of words || []) {
    const name = String(w.name ?? w.text ?? w.title ?? "").trim();
    const key = w.slug ?? toKey(name) ?? name;
    const child: TileData = {
      image: w.symbol ?? w.image_url ?? w.image ?? "/AAC_assets/img/standard/custom.png",
      text: name,
      sound: name,
      // prefer backend color, fall back to an inferred color from static data or parent later
      tileColor: (w.color ? toTileColor(w.color) : undefined as any),
    };
    const wLayout = (typeof w.home_layout === 'number') ? w.home_layout : (typeof w.layout === 'number' ? w.layout : undefined);
    if (typeof wLayout === 'number') (child as any).home_layout = wLayout;

      // If a word has a home_layout/layout value, it should also appear at the top-level
      // tiles map so the homepage placement logic can include it.
      if (typeof wLayout === 'number') {
      // Avoid overwriting an existing category with the same key
      if (!tiles[key]) {
        tiles[key] = child;
      }
    }

    const cats: string[] = Array.isArray(w.categories) ? w.categories : (w.category ? [w.category] : []);
    if (cats.length > 0) {
      for (const cname of cats) {
        const lookup = String(cname || '').trim().toLowerCase();
        // try the normalized category map first
        let parentKey = catMap.get(lookup);
        // if not found, try the canonical key form (toKey) and see if static data has it
        if (!parentKey) {
          const candidate = toKey(String(cname || ""));
          if (tiles[candidate]) parentKey = candidate;
          else if (data[candidate]) parentKey = candidate;
        }
        if (!parentKey) continue;
        if (!tiles[parentKey].subTiles) tiles[parentKey].subTiles = {};
        // Prefer to reuse an existing subTile key from static data when the text matches.
        const existingSub = data[parentKey] && data[parentKey].subTiles ? data[parentKey].subTiles as TileAssets : undefined;
        let childKey = key;
        if (existingSub) {
          const match = Object.entries(existingSub).find(([, v]) => String(v.text ?? "").trim().toLowerCase() === name.toLowerCase());
          if (match) childKey = match[0];
        }
        // if child has no color, inherit parent's color
        if (!child.tileColor) child.tileColor = tiles[parentKey].tileColor ?? toTileColor(undefined);
        tiles[parentKey].subTiles![childKey] = child;
      }
    }
  }

  // Dev-only debug output to help diagnose mapping issues (e.g., Locations)
  if (typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production") {
    try {
      // eslint-disable-next-line no-console
      console.debug("buildTilesFromBackend: category->canonical mappings", mappingRecords.slice(0, 200));
      const stats = Object.entries(tiles).map(([k, v]) => ({ key: k, subTileCount: v.subTiles ? Object.keys(v.subTiles).length : 0 }));
      // eslint-disable-next-line no-console
      console.debug("buildTilesFromBackend: top-level tile subTile counts (non-zero)", stats.filter(s => s.subTileCount > 0));
      // specific checks for 'locations' and 'go'
      // eslint-disable-next-line no-console
      console.debug("buildTilesFromBackend: tiles['go'] present", Boolean(tiles['go']), "subTiles:", tiles['go'] ? Object.keys(tiles['go'].subTiles ?? {}) : undefined);
      // eslint-disable-next-line no-console
      console.debug("buildTilesFromBackend: tiles['locations'] present", Boolean(tiles['locations']), "subTiles:", tiles['locations'] ? Object.keys(tiles['locations'].subTiles ?? {}) : undefined);
    } catch (e) {
      // ignore debug errors
    }
  }

  return tiles;
}
