import { useUtteredTiles } from "@/react-state-management/providers/useUtteredTiles";
import React, { useState } from "react";
import MiniTile from "./MiniTile";
import { RiSpeakLine, RiCameraOffFill, RiCameraFill, RiDeleteBack2Fill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { FaCog, FaStop, FaPlay } from 'react-icons/fa';
import { speak } from "@/util/AAC/Speech";
import { useRekognition } from "@/react-state-management/providers/useRekognition";
import { useHealthCheckContext } from "@/react-state-management/providers/HealthCheckProvider";
import { usePredictedTiles } from "@/react-state-management/providers/PredictedTilesProvider";
import { useTranscript } from "@/react-state-management/providers/TranscriptProvider";
import { useRecordingControl } from "@/react-state-management/providers/RecordingControlProvider";
import { useHighlightMethods } from "@/react-state-management/providers/HighlightMethodsProvider";

export const actionBarDataTestIds = {
    container: "actionbar-container",
    wordBox: "actionbar-words-box",
    speakBtn: "actionbar-speak-btn",
    clearBtn: "actionbar-clear-btn",
    backspaceBtn: "actionbar-backspace-btn",
    toggleCamBtn: "actionbar-toggle-camera",
    cameraIconOn: "actionbar-camera-on-icon",
    cameraIconOff: "actionbar-camera-off-icon",
};

/**
 * Displays a list of tiles currently selected, a button to speak the tiles,
 * and a button the clear the list of tiles.
 */
export default function SelectedTilesActionBar() {
    const { tiles, clear, removeLastTile } = useUtteredTiles();
    const { backendActive } = useHealthCheckContext();
    const { setPredictedTiles } = usePredictedTiles();
    const { setTranscript } = useTranscript();
    const { isActive, setIsActive } = useRecordingControl();
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const { activeHighlights, toggleHighlightMethod } = useHighlightMethods();

    const handleSpeak = () => {
        const validTilesSounds = tiles.filter((tile) => Boolean(tile.sound)).map((tile) => tile.sound);
        const sentence = validTilesSounds.join(" ");

        speak(sentence, backendActive);
    };

    const { toggle, toggleCamera } = useRekognition();

    return (
        <div className="z-50 w-full flex gap-2 p-3 items-center" data-testid={actionBarDataTestIds.container}>
            {/* Start/Stop and Settings buttons on the left */}
            <div className="flex gap-2 relative">
                {/* Start/Stop Recording button - first */}
                <button
                    onClick={() => {
                        const newActiveState = !isActive;
                        setIsActive(newActiveState);
                        // Clear predicted tiles immediately when stopping
                        if (!newActiveState) {
                            setPredictedTiles([]);
                        }
                    }}
                    className={`p-2 rounded hover:shadow-xl flex items-center justify-center transition-colors duration-200 ${
                        isActive 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-green-500 hover:bg-green-600'
                    }`}
                    title={isActive ? "Stop Recording" : "Start Recording"}
                >
                    {isActive ? (
                        <FaStop className="w-11 h-11 text-white" />
                    ) : (
                        <FaPlay className="w-11 h-11 text-white" />
                    )}
                </button>
                
                {/* Settings button */}
                <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="p-2 rounded bg-emerald-400 hover:bg-emerald-500 hover:shadow-xl flex items-center justify-center transition-colors duration-200"
                    title="Settings"
                >
                    <FaCog className="w-11 h-11 text-black" />
                </button>
                
                {/* Settings dropdown menu */}
                {isSettingsOpen && (
                    <div className="absolute left-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                        <div className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 border-b">
                            Highlighting Methods
                        </div>
                        <div className="py-1">
                            {[
                                { key: 'opacity', label: 'Opacity' },
                                { key: 'border', label: 'Border' },
                                { key: 'pulse', label: 'Pulse' },
                            ].map((opt) => (
                                <button
                                    key={opt.key}
                                    onClick={() => {
                                        toggleHighlightMethod(opt.key);
                                    }}
                                    className={`w-full px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 text-left flex items-center gap-2 ${activeHighlights.has(opt.key) ? 'font-bold text-black' : 'text-gray-700'}`}
                                >
                                    {/* Checkbox indicator */}
                                    <input
                                        type="checkbox"
                                        checked={activeHighlights.has(opt.key)}
                                        onChange={() => {}}
                                        className="cursor-pointer"
                                    />
                                    <span>{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Word box - now takes remaining space instead of full width */}
            <div
                className="flex-1 border-black border-2 rounded-md shadow-lg p-1 min-h-[64px] flex gap-2 flex-wrap"
                data-testid={actionBarDataTestIds.wordBox}
            >
                {tiles &&
                    tiles.map((miniTileInfo, idx) => (
                        <MiniTile image={miniTileInfo.image} text={miniTileInfo.text} key={`${miniTileInfo.text}-${idx}`} />
                    ))}
            </div>
            <button className="bg-green-400 p-2 rounded hover:shadow-xl" data-testid={actionBarDataTestIds.speakBtn} onClick={handleSpeak}>
                <RiSpeakLine className="w-12 h-12" />
            </button>
            <button className="bg-yellow-300 p-2 rounded hover:shadow-xl" data-testid={actionBarDataTestIds.backspaceBtn} onClick={removeLastTile}>
                <RiDeleteBack2Fill className="w-12 h-12" />
            </button>
            <button 
                className="bg-red-400 p-2 rounded hover:shadow-xl" 
                data-testid={actionBarDataTestIds.clearBtn} 
                onClick={() => {
                    clear();
                    setPredictedTiles([]);
                    setTranscript("");
                }}
            >
                <RxCross2 className="w-12 h-12" />
            </button>
            {
                // show toggle button IF backend is even working at the moment
                backendActive && (
                    <button
                        className={`${toggle ? "bg-gray-400" : "bg-gray-600"} p-2 rounded hover:shadow-xl`}
                        onClick={toggleCamera}
                        data-testid={actionBarDataTestIds.toggleCamBtn}
                    >
                        {toggle ? (
                            <RiCameraFill data-testid={actionBarDataTestIds.cameraIconOn} className="w-12 h-12" />
                        ) : (
                            <RiCameraOffFill data-testid={actionBarDataTestIds.cameraIconOff} className="w-12 h-12" />
                        )}
                    </button>
                )
            }
        </div>
    );
}
