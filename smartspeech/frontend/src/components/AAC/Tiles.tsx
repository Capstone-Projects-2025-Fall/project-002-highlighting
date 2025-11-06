import React, { useEffect, useReducer, useState, useMemo } from "react";
import Tile from "./Tile";
import { stackReducer } from "@/react-state-management/reducers/stackReducer";
import { TileAssets, TileData } from "./TileTypes";
import { useTilesProvider } from "@/react-state-management/providers/tileProvider";

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

/**
 * @returns Component which will fetch tiles and display them
 */
export default function Tiles() {
    const { tiles } = useTilesProvider();
    const [dataLocation, dispatch] = useReducer(stackReducer<string>, []);
    const [currentFrame, setCurrentFrame] = useState<TileAssets>({});
    const [opacity, setOpacity] = useState<number>(100);
    const [tacoModeActive, setTacoModeActive] = useState<boolean>(false);
    const [opacityControlsVisible, setOpacityControlsVisible] = useState<boolean>(false);

    useEffect(() => {
        if (Object.keys(tiles).length === 0) return;
        if (dataLocation.length === 0) return setCurrentFrame(tiles);

        let newFrame = tiles;

        dataLocation.forEach((loc) => {
            if (loc in newFrame && newFrame[loc].subTiles) {
                newFrame = newFrame[loc].subTiles as TileAssets;
            }
        });

        setCurrentFrame(newFrame);
    }, [tiles, dataLocation]);

    const orderedTiles = useMemo(() => {
        const entries = Object.entries(currentFrame);

        const pronounEntries: [string, TileData][] = [];
        const nonFolderEntries: [string, TileData][] = [];
        const folderEntries: [string, TileData][] = [];

        entries.forEach(([key, tileData]) => {
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

        pronounEntries.sort(([, tileA], [, tileB]) => {
            const priorityA = pronounPriorityMap.get(tileA.text.trim().toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
            const priorityB = pronounPriorityMap.get(tileB.text.trim().toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
            if (priorityA === priorityB) return 0;
            return priorityA < priorityB ? -1 : 1;
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
    }, [currentFrame]);

    const columnMajorTiles = useMemo(() => {
        const totalTiles = orderedTiles.length;
        if (totalTiles === 0) return orderedTiles;

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
    }, [orderedTiles]);

    const renderTile = (key: string, tileData: TileData): JSX.Element => {
        const { image, text, sound, tileColor, subTiles } = tileData;
        
        // Calculate tile opacity based on tacoMode and tile text
        let tileOpacity = opacity;
        if (tacoModeActive) {
            tileOpacity = ['Eat', 'Taste', 'Taco'].includes(text) ? 100 : 40;
        }

        const tile = (
            <Tile 
                image={image} 
                text={text} 
                sound={subTiles ? "" : sound} 
                tileColor={tileColor} 
                hasSubTiles={!!subTiles} 
                opacity={tileOpacity} 
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

    return (
        <>
            {/* Only show the toggle button when controls are hidden */}
            {!opacityControlsVisible && (
                <div className="fixed top-31 left-0 right-0 z-40 ">
                    <div className="max-w-7xl mx-auto px-4 py-2">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setOpacityControlsVisible(!opacityControlsVisible)}
                                className="w-8 h-8 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200"
                                title="Show opacity controls"
                            >
                                <span className="text-xs font-bold text-gray-700">+</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Show full controls when expanded */}
            {opacityControlsVisible && (
                <div className="fixed top-31 left-0 right-0 z-40 bg-white shadow-md">
                    <div className="max-w-7xl mx-auto px-4 py-2">
                        <div className="flex items-center space-x-4">
                            {/* Toggle Circle Button */}
                            <button
                                onClick={() => setOpacityControlsVisible(!opacityControlsVisible)}
                                className="w-8 h-8 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200"
                                title="Hide opacity controls"
                            >
                                <span className="text-xs font-bold text-gray-700">−</span>
                            </button>
                            
                            {/* Opacity Controls */}
                            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border">
                                <label className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">Opacity:</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={opacity}
                                        onChange={(e) => setOpacity(Number(e.target.value))}
                                        className="w-24"
                                    />
                                    <span className="text-sm font-medium w-8">{opacity}%</span>
                                </label>
                                <button
                                    onClick={() => setOpacity(100)}
                                    className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors duration-200"
                                >
                                    Reset
                                </button>
                            </div>
                            
                            {/* Taco Mode Button */}
                            <button
                                onClick={() => setTacoModeActive(!tacoModeActive)}
                                className={`px-4 py-2 ${
                                    tacoModeActive
                                        ? 'bg-yellow-500 text-black'
                                        : 'bg-yellow-400 text-black'
                                } rounded-md hover:bg-yellow-500 transition-colors duration-200`}
                            >
                                {tacoModeActive ? 'Taco example: On' : 'Taco example: Off'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <section className="w-full flex flex-col items-center gap-4 pt-28">
                <div className="grid grid-cols-8 gap-4 2xl-max:grid-cols-7 md-max:gap-2" data-testid={TilesTestIds.mainContainer}>
                    {dataLocation.length > 0 && (
                        <div onClick={() => dispatch({ type: "remove" })}>
                            <Tile 
                                image="/AAC_assets/img/standard/back_arrow.png" 
                                text={BACK_BTN_TEXT} 
                                tileColor="blue" 
                                opacity={opacity} 
                            />
                        </div>
                    )}
                    {columnMajorTiles.map(([key, tile]) => renderTile(key, tile))}
                </div>
            </section>
        </>
    );
}
