import { useUtteredTiles } from "@/react-state-management/providers/useUtteredTiles";
import { speak } from "@/util/AAC/Speech";
import Image from "next/image";
import React from "react";

export const tileColors = ["yellow", "green", "blue", "orange", "red", "purple", "gray"] as const;
export type TileColor = (typeof tileColors)[number];

const tileColorClassMap: Record<TileColor, string> = {
    yellow: "tile-color-yellow",
    green: "tile-color-green",
    blue: "tile-color-blue",
    orange: "tile-color-orange",
    red: "tile-color-red",
    purple: "tile-color-purple",
    gray: "tile-color-gray",
};

/**
 * Properties for the Tile component.
 * Defines the appearance and behavior of a tile in the AAC interface.
 */
export interface TileProps {
    /**
     * Path to the image displayed in the center of the tile.
     * This image visually represents the concept or word.
     */
    image: string;
    
    /**
     * Text to be spoken when the tile is clicked.
     * If not provided, the tile will be silent when clicked.
     */
    sound?: string;
    
    /**
     * Text displayed as a caption under the image.
     * This text identifies the concept or word represented by the tile.
     */
    text: string;
    
    /**
     * Color of the tile background.
     * Used for visual categorization and distinction between different types of tiles.
     */
    tileColor: TileColor;
    
    /**
     * Whether this tile has sub-tiles (folder icon will be shown if true).
     * Used to indicate that the tile leads to a sub-menu.
     */
    hasSubTiles?: boolean;

    /**
     * Opacity of the tile (0-100).
     * Controls the transparency of the entire tile.
     * Default is 100 (fully opaque).
     */
    opacity?: number;
}

/**
 * Computes a consistent test ID for a tile based on its text.
 * Used for targeting tiles in automated tests.
 * 
 * @param text - The text displayed on the tile
 * @returns A formatted string to be used as a data-testid attribute
 */
export function computeTileContainerName(text: string) {
    return `tile-container-${text.replace(" ", "_")}`;
}

/**
 * A clickable tile component that displays an image with text and plays a sound when clicked.
 * Used as the primary interactive element in the AAC interface.
 * 
 * @param props - The properties for the Tile component
 * @param props.image - Path to the image displayed in the center of the tile
 * @param props.sound - Text to be spoken when the tile is clicked
 * @param props.text - Text displayed as a caption under the image
 * @param props.tileColor - Color of the tile background
 * @param props.opacity - Opacity of the tile (0-100), default is 100
 * @returns A React component that renders a clickable tile with image and text
 */
export default function Tile({ image, sound, text, tileColor, hasSubTiles = false, opacity = 100 }: TileProps) {
    const { addTile } = useUtteredTiles();
    const colorClass = tileColorClassMap[tileColor] ?? tileColorClassMap.yellow;

    const handleTileClick = () => {
        // tiles that are just covers are soundless since they are
        if (!sound) return;

        speak(sound);

        addTile({
            image,
            sound,
            text,
            tileColor,
        });
    };

    // Get style object for opacity
    const style = {
        opacity: opacity / 100
    };

    return (
        <div
            className={`${colorClass} w-44 h-44 flex flex-col justify-center items-center rounded-lg shadow-lg hover:shadow-xl hover:cursor-pointer p-4 2xl-max:w-36 2xl-max:h-36 xl-max:w-32 xl-max:h-32 lg-max:w-28 lg-max:h-28 mid-max:w-24 mid-max:h-24 md-max:w-20 md-max:h-20 xs-max:w-16 xs-max:h-16 relative`}
            style={style}
            onClick={handleTileClick}
            id="tileResize"
            data-testid={computeTileContainerName(text)}
        >
            {hasSubTiles && (
                <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow-md">
                    <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-700"
                    >
                        <path 
                            d="M10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z" 
                            fill="currentColor"
                        />
                    </svg>
                </div>
            )}
            <h2 className="font-bold text-2xl lg-max:text-xl md-max:text-sm break-words" data-testid="tile-text">
                {text}
            </h2>
            <Image
                src={image}
                alt={text}
                width={176}
                height={176}
                className="w-auto h-32 object-cover 2xl-max:h-24 xl-max:h-20 lg-max:h-16 xs-max:h-12"
                draggable="false"
                data-testid="tile-image"
            />
        </div>
    );
}
