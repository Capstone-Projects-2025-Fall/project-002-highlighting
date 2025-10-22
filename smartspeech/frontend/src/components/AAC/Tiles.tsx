import React, { useEffect, useReducer, useState } from "react";
import Tile from "./Tile";
import { stackReducer } from "@/react-state-management/reducers/stackReducer";
import { TileAssets, TileData } from "./TileTypes";
import { useTilesProvider } from "@/react-state-management/providers/tileProvider";
import type { MouseEvent } from "react";

export const BACK_BTN_TEXT = "Back";

export const TilesTestIds = {
    mainContainer: "tiles-container",
};

/**
 * @returns Component which will fetch tiles and display them
 */
export default function Tiles() {
    const { tiles } = useTilesProvider();
    const [dataLocation, dispatch] = useReducer(stackReducer<string>, []);
    const [currentFrame, setCurrentFrame] = useState<TileAssets>({});
    const [opacity, setOpacity] = useState<number>(100);
    const [tacoModeActive, setTacoModeActive] = useState<boolean>(false);

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
            <div className="fixed top-31 left-0 right-0 z-40 bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <span>Opacity:</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={opacity}
                                onChange={(e) => setOpacity(Number(e.target.value))}
                                className="w-32"
                            />
                            <span>{opacity}%</span>
                        </label>
                        <button
                            onClick={() => setOpacity(100)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Reset
                        </button>
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
                    {Object.keys(currentFrame).map((key) => renderTile(key, currentFrame[key]))}
                </div>
            </section>
        </>
    );
}
