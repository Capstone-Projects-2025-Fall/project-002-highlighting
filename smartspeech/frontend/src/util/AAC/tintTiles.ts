import { TileAssets, TileData } from "@/components/AAC/TileTypes";
import { TileColor } from "@/components/AAC/Tile";

/**
 * Deep clones a TileAssets tree and forces every tile to use the supplied color.
 * This prevents us from mutating shared tile datasets when we need a tinted view.
 */
export function tintTileAssets(tiles: TileAssets, color: TileColor): TileAssets {
    const tinted: TileAssets = {};

    Object.entries(tiles).forEach(([key, tile]) => {
        const clonedTile: TileData = {
            ...tile,
            tileColor: color,
        };

        if (tile.subTiles) {
            clonedTile.subTiles = tintTileAssets(tile.subTiles, color);
        }

        tinted[key] = clonedTile;
    });

    return tinted;
}

/**
 * Clones the provided tiles and ensures that every folder (tile with subTiles)
 * has its entire subtree tinted to the folder's tileColor.
 */
export function applyParentColorToTiles(tiles: TileAssets): TileAssets {
    const normalized: TileAssets = {};

    Object.entries(tiles).forEach(([key, tile]) => {
        const clone: TileData = { ...tile };

        if (tile.subTiles) {
            const parentColor = tile.tileColor as TileColor;
            const tintedChildren = tintTileAssets(tile.subTiles, parentColor);

            Object.entries(tile.subTiles).forEach(([childKey, childTile]) => {
                if (childTile.tileColor === "gray") {
                    const normalizedChild = applyParentColorToTiles({ [childKey]: childTile })[childKey];
                    tintedChildren[childKey] = {
                        ...normalizedChild,
                        tileColor: "gray",
                    };
                }
            });

            clone.subTiles = tintedChildren;
        }

        normalized[key] = clone;
    });

    return normalized;
}
