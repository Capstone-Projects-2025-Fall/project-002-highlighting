import { useUtteredTiles } from "@/react-state-management/providers/useUtteredTiles";
import { speak } from "@/util/AAC/Speech";
import Image from "next/image";
import React from "react";

export const tileColors = ["red", "purple", "orange", "yellow", "green", "blue"];
export type TileColor = "red" | "purple" | "orange" | "yellow" | "green" | "blue";

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
 * @returns A React component that renders a clickable tile with image and text
 */
export default function Tile({ image, sound, text, tileColor }: TileProps) {
    const { addTile } = useUtteredTiles();

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

    return (
        <div
            className={`bg-${tileColor}-300 w-44 h-44 flex flex-col justify-center items-center rounded-lg shadow-lg hover:shadow-xl hover:cursor-pointer p-4 2xl-max:w-36 2xl-max:h-36 xl-max:w-32 xl-max:h-32 lg-max:w-28 lg-max:h-28 mid-max:w-24 mid-max:h-24 md-max:w-20 md-max:h-20 xs-max:w-16 xs-max:h-16`}
            onClick={handleTileClick}
            id="tileResize"
            data-testid={computeTileContainerName(text)}
        >
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
