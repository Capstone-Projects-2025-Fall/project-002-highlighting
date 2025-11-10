import React, { useEffect, useReducer, useState, useMemo } from "react";
import Tile from "./Tile";
import { stackReducer } from "@/react-state-management/reducers/stackReducer";
import { TileAssets, TileData } from "./TileTypes";
import { useTilesProvider } from "@/react-state-management/providers/tileProvider";
import { usePredictedTiles } from "@/react-state-management/providers/PredictedTilesProvider";
import { FaCog } from 'react-icons/fa';
import type { MouseEvent } from "react";

export const BACK_BTN_TEXT = "Back";

export const TilesTestIds = {
    mainContainer: "tiles-container",
};

const PRONOUN_PRIORITY = [
    "i",
    "me",
    "my",
    "mine",
    "myself",
    "you",
    "your",
    "yours",
    "yourself",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
    "we",
    "us",
    "our",
    "ours",
    "ourselves",
];
const pronounPriorityMap = new Map(PRONOUN_PRIORITY.map((word, index) => [word, index]));
const SPECIAL_FOLDER_KEYS = new Set(["shapes"]);
const BOARD_COLUMN_COUNT = 8;
const NON_FOLDER_PRIORITY = ["good", "bad", "stop"];
const nonFolderPriorityMap = new Map(NON_FOLDER_PRIORITY.map((word, index) => [word, index]));
const ROOT_MAX_ROWS = 3;
const ROOT_LAYOUT_COLUMN_KEYS: readonly (readonly string[])[] = [
    ["self", "you", "they"],
    ["good", "bad", "stop"],
    ["tell", "these", "touch"],
    ["go", "eat", "is"],
    ["body", "clothing", "colors"],
    ["feelings", "things", "technology"],
    ["shapes", "animals"],
];


/**
 * @returns Component which will fetch tiles and display them
 */
export default function Tiles() {
    const { tiles } = useTilesProvider();
    const { predictedTiles } = usePredictedTiles();
    const [dataLocation, dispatch] = useReducer(stackReducer<string>, []);
    const isRootView = dataLocation.length === 0;
    const [currentFrame, setCurrentFrame] = useState<TileAssets>({});
    const [opacity, setOpacity] = useState<number>(40); // Start with lower opacity as default
    const [tacoModeActive, setTacoModeActive] = useState<boolean>(false);
    // highlightMode controls how tiles are visually highlighted. Possible values:
    // 'opacity' (default), 'border', 'pulse', 'darken'
    const [highlightMode, setHighlightMode] = useState<string>('opacity');
    const [opacityControlsVisible, setOpacityControlsVisible] = useState<boolean>(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

    useEffect(() => {
        if (Object.keys(tiles).length === 0) return;
        if (isRootView) return setCurrentFrame(tiles);

        let newFrame = tiles;

        dataLocation.forEach((loc) => {
            if (loc in newFrame && newFrame[loc].subTiles) {
                newFrame = newFrame[loc].subTiles as TileAssets;
            }
        });

        setCurrentFrame(newFrame);
    }, [tiles, dataLocation, isRootView]);

    /**
     * Recursively check if a tile or any of its subtiles are predicted
     * 
     * @param tileData - The tile data to check
     * @param predictedTiles - Array of predicted tile texts
     * @returns true if the tile or any subtile is predicted
     */
    const isTileOrSubtilePredicted = (tileData: TileData, predictedTiles: string[]): boolean => {
        // Check if the tile itself is predicted
        const isPredicted = predictedTiles.some(predicted => 
            predicted.toLowerCase() === tileData.text.toLowerCase()
        );
        
        if (isPredicted) return true;
        
        // Recursively check subtiles
        if (tileData.subTiles) {
            for (const subtileKey in tileData.subTiles) {
                const subtile = tileData.subTiles[subtileKey];
                if (isTileOrSubtilePredicted(subtile, predictedTiles)) {
                    return true;
                }
            }
        }
        
        return false;
    };

    const orderedTiles: [string, TileData][] = useMemo(() => {
        const entries = Object.entries(currentFrame);

        if (isRootView) {
            const remainingEntries = new Map(entries);

            const columns: [string, TileData][][] = ROOT_LAYOUT_COLUMN_KEYS.map((columnKeys) => {
                const columnEntries: [string, TileData][] = [];

                columnKeys.forEach((tileKey) => {
                    const tileData = remainingEntries.get(tileKey);
                    if (!tileData) return;
                    columnEntries.push([tileKey, tileData]);
                    remainingEntries.delete(tileKey);
                });

                return columnEntries;
            });

            if (remainingEntries.size > 0) {
                const leftovers = Array.from(remainingEntries.entries());
                for (let i = 0; i < leftovers.length; i += ROOT_MAX_ROWS) {
                    columns.push(leftovers.slice(i, i + ROOT_MAX_ROWS));
                }
            }

            const maxRows = columns.reduce((acc, column) => Math.max(acc, column.length), 0);
            const arranged: [string, TileData][] = [];

            for (let row = 0; row < maxRows; row++) {
                columns.forEach((column) => {
                    const entry = column[row];
                    if (entry) arranged.push(entry);
                });
            }

            return arranged;
        }

        const pronounEntries: [string, TileData][] = [];
        const nonFolderEntries: [string, TileData][] = [];
        const entryIndexMap = new Map<string, number>();
        const folderEntries: [string, TileData][] = [];

        entries.forEach(([key, tileData], index) => {
            entryIndexMap.set(key, index);
            const normalizedText = tileData.text.trim().toLowerCase();
            if (pronounPriorityMap.has(normalizedText)) {
                pronounEntries.push([key, tileData]);
                return;
            }

            if (tileData.subTiles) {
                folderEntries.push([key, tileData]);
                return;
            }

            nonFolderEntries.push([key, tileData]);
        });

        pronounEntries.sort(([keyA, tileA], [keyB, tileB]) => {
            const priorityA = pronounPriorityMap.get(tileA.text.trim().toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
            const priorityB = pronounPriorityMap.get(tileB.text.trim().toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
            if (priorityA !== priorityB) return priorityA - priorityB;
            const indexA = entryIndexMap.get(keyA) ?? Number.MAX_SAFE_INTEGER;
            const indexB = entryIndexMap.get(keyB) ?? Number.MAX_SAFE_INTEGER;
            return indexA - indexB;
        });
        nonFolderEntries.sort(([keyA, tileA], [keyB, tileB]) => {
            const textA = tileA.text.trim().toLowerCase();
            const textB = tileB.text.trim().toLowerCase();
            const priorityA = nonFolderPriorityMap.get(textA);
            const priorityB = nonFolderPriorityMap.get(textB);
            if (priorityA !== undefined && priorityB !== undefined) {
                if (priorityA !== priorityB) return priorityA - priorityB;
                const indexA = entryIndexMap.get(keyA) ?? Number.MAX_SAFE_INTEGER;
                const indexB = entryIndexMap.get(keyB) ?? Number.MAX_SAFE_INTEGER;
                return indexA - indexB;
            }
            if (priorityA !== undefined) return -1;
            if (priorityB !== undefined) return 1;
            const indexA = entryIndexMap.get(keyA) ?? Number.MAX_SAFE_INTEGER;
            const indexB = entryIndexMap.get(keyB) ?? Number.MAX_SAFE_INTEGER;
            return indexA - indexB;
        });

        const specialFolderEntries: [string, TileData][] = [];
        const remainingFolderEntries: [string, TileData][] = [];

        folderEntries.forEach(([key, data]) => {
            if (SPECIAL_FOLDER_KEYS.has(key.toLowerCase())) {
                specialFolderEntries.push([key, data]);
            } else {
                remainingFolderEntries.push([key, data]);
            }
        });

        const [firstNonFolder, ...restNonFolder] = nonFolderEntries;

        return [
            ...pronounEntries,
            ...(firstNonFolder ? [firstNonFolder] : []),
            ...specialFolderEntries,
            ...restNonFolder,
            ...remainingFolderEntries,
        ];
    }, [currentFrame, isRootView]);

    const columnMajorTiles: [string, TileData][] = useMemo(() => {
        const totalTiles = orderedTiles.length;
        if (totalTiles === 0) return orderedTiles;
        if (isRootView) return orderedTiles;

        const columnCount = Math.min(BOARD_COLUMN_COUNT, totalTiles);
        const rows = Math.ceil(totalTiles / columnCount);
        const arranged: [string, TileData][] = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columnCount; col++) {
                const index = col * rows + row;
                if (index < totalTiles) arranged.push(orderedTiles[index]);
            }
        }

        return arranged;
    }, [orderedTiles, isRootView]);

    // Note: live showcase toggle currently does not perform any automatic highlighting.
    // The toggle exists as a no-op state for now and will be wired to transcription-based
    // suggested tiles in a future change.

    const renderTile = (key: string, tileData: TileData): JSX.Element => {
        const { image, text, sound, tileColor, subTiles } = tileData;
        
        // Check if tile matches any predicted tiles
        const isPredicted = isTileOrSubtilePredicted(tileData, predictedTiles);
        
        // Determine whether this tile should be considered "highlighted"
        const tacoRelevant = ['Eat', 'Taste', 'Taco'].includes(text);

        // Calculate tile opacity
        // Default to fully visible. Only dim non-suggested tiles when we're in
        // 'opacity' highlight mode AND there are predicted/suggested tiles available.
        let tileOpacity = 100;
        if (highlightMode === 'opacity' && Array.isArray(predictedTiles) && predictedTiles.length > 0) {
            const shouldBeHighlighted = tacoModeActive ? tacoRelevant : isPredicted;
            tileOpacity = shouldBeHighlighted ? 100 : 40;
        }

        // For darken highlight mode, compute an inline background color override for highlighted tiles
        let overrideBgColor: string | undefined = undefined;
        if (highlightMode === 'darken') {
            // base color map matches the CSS variables in globals.css
            const baseColors: Record<string, string> = {
                yellow: '#f7e886',
                green: '#b9fbc0',
                blue: '#c7d9ff',
                orange: '#ffd7a3',
                red: '#f7b0c0',
                purple: '#e0c3fc',
                gray: '#e2e2e2',
            };

            const darkenHex = (hex: string, amount = 0.25) => {
                // amount is fraction to darken (0.25 => 25% darker)
                const parsed = hex.replace('#', '');
                const r = parseInt(parsed.substring(0, 2), 16);
                const g = parseInt(parsed.substring(2, 4), 16);
                const b = parseInt(parsed.substring(4, 6), 16);
                const dr = Math.max(0, Math.floor(r * (1 - amount)));
                const dg = Math.max(0, Math.floor(g * (1 - amount)));
                const db = Math.max(0, Math.floor(b * (1 - amount)));
                const toHex = (v: number) => v.toString(16).padStart(2, '0');
                return `#${toHex(dr)}${toHex(dg)}${toHex(db)}`;
            };

            const base = baseColors[tileColor as string];
            if (base) {
                // Apply darkening only to predicted tiles (or taco-relevant tiles in taco mode)
                if (tacoModeActive ? tacoRelevant : isPredicted) {
                    overrideBgColor = darkenHex(base, 0.25);
                }
            }
        }

    // For border highlighting, determine if this tile should get a border.
    // Apply border highlighting to predicted tiles (or taco-relevant tiles in taco mode)
    const tileHasBorder = highlightMode === 'border' && (tacoModeActive ? tacoRelevant : isPredicted);

        // Determine whether this tile should pulse when 'pulse' highlight mode is active.
        // When tacoModeActive is true, only tacoRelevant tiles should pulse; otherwise all pulse.
    // Apply special highlighting only to predicted tiles (or taco-relevant tiles in taco mode)
    const tileIsPulsing = highlightMode === 'pulse' && (tacoModeActive ? tacoRelevant : isPredicted);
    const tileIs3D = highlightMode === 'threeD' && (tacoModeActive ? tacoRelevant : isPredicted);

        const tile = (
            <Tile 
                image={image} 
                text={text} 
                sound={subTiles ? "" : sound} 
                tileColor={tileColor} 
                hasSubTiles={!!subTiles} 
                opacity={tileOpacity}
                hasBorder={tileHasBorder}
                overrideBgColor={overrideBgColor}
                isPulsing={tileIsPulsing}
                is3D={tileIs3D}
            />
        );

        const handleClick = () => {
            if (subTiles) {
                dispatch({ type: "add", payload: key });
            }
            // Removed the else clause so clicking a tile without subtiles doesn't clear navigation
        };

        // Return tile

        return (
            <div key={key} onClick={handleClick}>
                {tile}
            </div>
        );
    };

    const rootColumnCount = isRootView
        ? Math.max(ROOT_LAYOUT_COLUMN_KEYS.length, Math.ceil(orderedTiles.length / ROOT_MAX_ROWS))
        : null;

    const gridClassName = isRootView
        ? rootColumnCount && rootColumnCount >= 8
            ? "grid grid-cols-8 gap-4 2xl-max:grid-cols-7 md-max:gap-2"
            : rootColumnCount && rootColumnCount >= 7
                ? "grid grid-cols-7 gap-4 2xl-max:grid-cols-6 xl-max:grid-cols-5 lg-max:grid-cols-4 md-max:grid-cols-3 xs-max:grid-cols-2 md-max:gap-2"
                : "grid grid-cols-6 gap-4 2xl-max:grid-cols-6 xl-max:grid-cols-5 lg-max:grid-cols-4 md-max:grid-cols-3 xs-max:grid-cols-2 md-max:gap-2"
        : "grid grid-cols-8 gap-4 2xl-max:grid-cols-7 md-max:gap-2";

    return (
        <>
            {/* Settings button and dropdown */}
            <div className="fixed top-18 left-3.5 z-50">
                <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="w-10 h-10 bg-emerald-400 hover:bg-emerald-500 flex items-center justify-center transition-colors duration-200"
                    title="Settings"
                >
                    <FaCog className="w-5 h-5 text-white" />
                </button>
                
                {/* Settings dropdown menu */}
                {isSettingsOpen && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border-b">
                            Highlighting Method
                        </div>
                        <div className="py-1">
                            {[
                                { key: 'opacity', label: 'Opacity' },
                                { key: 'border', label: 'Border' },
                                { key: 'pulse', label: 'Pulse' },
                                { key: 'darken', label: 'Darken' },
                            ].map((opt) => (
                                <button
                                    key={opt.key}
                                    onClick={() => {
                                        // Set the highlight mode but do NOT close the settings dropdown.
                                        // The dropdown should only close when the user clicks the settings button again.
                                        setHighlightMode(opt.key);
                                    }}
                                    className={`w-full px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 text-left ${highlightMode === opt.key ? 'font-bold text-black' : 'text-gray-700'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Small grey plus button that expands to show controls (taco toggle) */}
            {!opacityControlsVisible && (
                <div className="fixed top-31 left-0 right-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 py-2">
                        <div className="flex items-center justify-start">
                            <button
                                onClick={() => setOpacityControlsVisible(true)}
                                className="w-8 h-8 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200"
                                title="Show controls"
                            >
                                <span className="text-xs font-bold text-gray-700">+</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {opacityControlsVisible && (
                <div className="fixed top-31 left-0 right-0 z-40 bg-white shadow-md">
                    <div className="max-w-7xl mx-auto px-4 py-2">
                        <div className="flex items-center space-x-4">
                            {/* Toggle Circle Button (collapse) */}
                            <button
                                onClick={() => setOpacityControlsVisible(false)}
                                className="w-8 h-8 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200"
                                title="Hide controls"
                            >
                                <span className="text-xs font-bold text-gray-700">−</span>
                            </button>

                            {/* Square-style Taco Mode Toggle Button inside expanded controls */}
                            <button
                                onClick={() => setTacoModeActive(!tacoModeActive)}
                                className={`h-10 px-3 ${
                                    tacoModeActive
                                        ? 'bg-yellow-500 text-black'
                                        : 'bg-yellow-400 text-black'
                                } rounded-md flex items-center justify-center transition-colors duration-200`}
                                title="Toggle Taco example"
                            >
                                <span className="text-sm font-medium">Taco example: {tacoModeActive ? 'On' : 'Off'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <section className="w-full flex flex-col items-center gap-4 pt-28">
                <div className="grid grid-cols-8 gap-4 2xl-max:grid-cols-7 md-max:gap-2" data-testid={TilesTestIds.mainContainer}>
                    {dataLocation.length > 0 && (
                        <div onClick={() => dispatch({ type: "remove" })}>
                            {/* Back button should always be fully visible */}
                            <Tile 
                                image="/AAC_assets/img/standard/back_arrow.png" 
                                text={BACK_BTN_TEXT} 
                                tileColor="blue" 
                                opacity={100}
                            />
                        </div>
                    )}
                    {columnMajorTiles.map(([key, tile]) => renderTile(key, tile))}
                </div>
            </section>
        </>
    );
}
