import React from "react";
import { io, Socket } from "socket.io-client";
import styles from "./AudioTranscription.module.css";
import { usePredictedTiles } from "@/react-state-management/providers/PredictedTilesProvider";
import { getBackendUrl } from "@/util/backend-url";
import { useUtteredTiles } from "@/react-state-management/providers/useUtteredTiles";

/**
 * AudioTranscription component for recording audio and displaying real-time transcriptions.
 * 
 * @class AudioTranscription
 * @description A React component that handles audio recording via the browser's MediaRecorder API
 * and receives transcriptions through Socket.io.
 * 
 * @returns {JSX.Element} A React component with recording controls and transcript display
 */
const AudioTranscription = () => {

    /**
     * WebSocket connection to the transcription server
     * 
     * @type {Socket}
     * @description Establishes a connection to the local transcription server
     */
    const socketRef = React.useRef<Socket | null>(null);

    /**
     * State to track whether recording is active
     * 
     * @type {boolean}
     * @description Controls the recording state of the component
     */
    const [record, setRecording] = React.useState(false);
    const isRecordingRef = React.useRef<boolean>(false);

    /**
     * State to store the transcribed text from the server
     * 
     * @type {string}
     * @description Accumulates transcribed text received from the server
     */
    const [transcript, setTranscript] = React.useState("");

    /**
     * State to store the URL for the recorded audio
     * 
     * @type {string | null}
     * @description Holds the object URL for the recorded audio blob
     */
    const [audioURL, setaudioURL] = React.useState<string | null>(null);

    /**
     * State to track audio playback progress
     * 
     * @type {number}
     * @description Current playback position as a percentage (0-100)
     */
    const [audioProgress, setAudioProgress] = React.useState(0);
    const [currentTimeSec, setCurrentTimeSec] = React.useState(0);
    const [durationSec, setDurationSec] = React.useState(0);

    /**
     * State to track if audio is currently playing
     * 
     * @type {boolean}
     * @description Indicates whether the audio is currently playing
     */
    const [isPlaying, setIsPlaying] = React.useState(false);

    /**
     * Predicted tiles from context
     */
    const { predictedTiles, setPredictedTiles } = usePredictedTiles();
    const { tileHistory } = useUtteredTiles();
    const sessionStartTimestampRef = React.useRef<number>(0);
    
    /**
     * State to track if prediction is loading
     * 
     * @type {boolean}
     * @description Indicates whether a prediction request is in progress
     */
    const [isPredicting, setIsPredicting] = React.useState(false);

    /**
     * Reference to store the last prediction timestamp
     * 
     * @type {React.MutableRefObject<number>}
     * @description Tracks when the last prediction was made to avoid too frequent calls
     */
    const lastPredictionRef = React.useRef<number>(0);

    /**
     * Reference to store the auto-prediction timeout
     * 
     * @type {React.MutableRefObject<NodeJS.Timeout | null>}
     * @description Stores the timeout ID for auto-prediction to allow cancellation
     */
    const autoPredictionTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    /**
     * State to track when predictions were last updated
     * 
     * @type {number}
     * @description Timestamp of when predictions were last updated
     */
    const [predictionTimestamp, setPredictionTimestamp] = React.useState<number>(0);

    /**
     * Reference to the audio element
     * 
     * @type {React.MutableRefObject<HTMLAudioElement | null>}
     * @description Reference to the audio element for controlling playback
     */
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    // Controls whether the bar is expanded or collapsed
    const [expanded, setExpanded] = React.useState(false);

    // Base URL for transcription/socket server (prefers env, falls back to localhost)
    const transcribeBaseUrl = React.useMemo(() => {
        const configured = process.env.NEXT_PUBLIC_TRANSCRIBE_URL || getBackendUrl();
        if (typeof configured === "string" && configured.length > 0) {
            return configured.replace(/\/$/, "");
        }
        return "http://localhost:5000";
    }, []);

    // Connection status for quick UI visibility
    const [connectionStatus, setConnectionStatus] = React.useState<"connecting" | "connected" | "error" | "disconnected">("connecting");

    const formatTime = (seconds: number) => {
        if (!isFinite(seconds) || seconds < 0) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        const sPadded = s < 10 ? `0${s}` : `${s}`;
        return `${m}:${sPadded}`;
    };

    /**
     * Reference to store audio chunks during recording
     * 
     * @type {React.MutableRefObject<Blob[]>}
     * @description Stores audio chunks as they become available from the MediaRecorder
     * @remarks Uses useRef to prevent re-renders when chunks are added
     */
    const chunksRef = React.useRef<Blob[]>([]);

    /**
     * Reference to store the MediaRecorder instance
     * 
     * @type {React.MutableRefObject<MediaRecorder | null>}
     * @description Holds the MediaRecorder instance for controlling audio recording
     */
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);

    /**
     * Effect to initialize the MediaRecorder and request microphone permissions
     * 
     * @method useEffect
     * @description Requests microphone access and sets up the MediaRecorder with event handlers
     * 
     * @precondition Browser must support MediaDevices API
     * @postcondition MediaRecorder is initialized and ready to use if permissions are granted
     * 
     * @throws {Error} If microphone permissions are denied or MediaDevices API is not supported
     */
    React.useEffect(() => {
        if (navigator.mediaDevices) {
            // creates stream. You should get a pop up on your browser on whether or not to allow streaming
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                // Resume here after user clicks allow 
                // create recorder
                mediaRecorderRef.current = new MediaRecorder(stream);

                let chunks = [];

                /**
                 * Event handler for when audio data becomes available
                 * 
                 * @event ondataavailable
                 * @description Processes audio chunks and sends them to the server via Socket.io
                 * 
                 * @param {BlobEvent} e - Event containing the audio data
                 */
                mediaRecorderRef.current.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        e.data.arrayBuffer().then((buffer) => {
                            socketRef.current?.emit("audio-chunk", buffer);
                        });
                    }
                    chunksRef.current.push(e.data);
                };

                /**
                 * Event handler for when recording stops
                 * 
                 * @event onstop
                 * @description Creates a Blob from the collected audio chunks and generates a URL for playback
                 * 
                 * @param {Event} e - Stop event
                 * @postcondition Audio URL is set and chunks are cleared
                 */
                mediaRecorderRef.current.onstop = (e: Event) => {
                    const blob = new Blob(chunksRef.current, { type: "audio/ogg; codecs=opus" });
                    chunksRef.current = [];
                    setaudioURL(URL.createObjectURL(blob));
                };

            }).catch(() => {});
        }
    }, []);

    /**
     * Starts the audio recording process
     * 
     * @method startRecording
     * @description Activates the MediaRecorder to begin capturing audio and sending chunks to the server
     * 
     * @precondition MediaRecorder must be initialized and microphone permissions granted
     * @postcondition Recording state is set to true and MediaRecorder begins capturing audio
     * 
     * @throws {Error} If MediaRecorder is not initialized or microphone permissions are denied
     */
    const startRecording = () => {
        setRecording(true);
        isRecordingRef.current = true;
        sessionStartTimestampRef.current = Date.now();
        if (socketRef.current) {
            socketRef.current.on("transcript", transcriptHandler);
        } else {
            // Socket not available; no-op
        }
        //Check if browser sees any audio-in devices(if you have no mic, no stream object will be created)
        navigator.mediaDevices.enumerateDevices().then(() => {});

        // start recorder
        mediaRecorderRef.current!.start(3000);
        // reset transcript and session pressed tiles for a new capture session
        setTranscript("");
        setPredictedTiles([]);
    };

    /**
     * Stops the audio recording process
     * 
     * @method stopRecording
     * @description Deactivates the MediaRecorder to stop capturing audio
     * 
     * @precondition Recording must be active (MediaRecorder in 'recording' state)
     * @postcondition Recording state is set to false and MediaRecorder stops capturing audio
     * 
     * @throws {Error} If MediaRecorder is not in recording state
     */
    const stopRecording = () => {
        setRecording(false);
        isRecordingRef.current = false;
        mediaRecorderRef.current!.stop();
        if (socketRef.current) {
            socketRef.current.off("transcript", transcriptHandler);
        }
    };

    /**
     * Test
     * Gets the current transcript text
     * 
     * @method getTranscript
     * @description Returns the current transcribed text from the audio recording
     * 
     * @returns {string} The current transcript text
     */
    const getTranscript = (): string => {
        return transcript;
    };

    /**
     * Handles audio time update events
     * 
     * @method handleTimeUpdate
     * @description Updates the progress bar based on current playback position
     */
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const duration = audioRef.current.duration || 0;
            setCurrentTimeSec(current);
            setDurationSec(duration);
            const progress = duration > 0 ? (current / duration) * 100 : 0;
            setAudioProgress(progress);
        }
    };

    /**
     * Handles audio play events
     * 
     * @method handlePlay
     * @description Sets playing state to true when audio starts playing
     */
    const handlePlay = () => {
        setIsPlaying(true);
    };

    /**
     * Handles audio pause events
     * 
     * @method handlePause
     * @description Sets playing state to false when audio is paused
     */
    const handlePause = () => {
        setIsPlaying(false);
    };

    /**
     * Handles audio ended events
     * 
     * @method handleEnded
     * @description Resets playing state and progress when audio ends
     */
    const handleEnded = () => {
        setIsPlaying(false);
        setAudioProgress(0);
        setCurrentTimeSec(0);
    };

    /**
     * Toggles audio playback
     * 
     * @method togglePlayback
     * @description Plays or pauses the audio based on current state
     */
    const togglePlayback = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
    };

    /**
     * Predicts next tiles based on current transcript
     * 
     * @method predictNextTiles
     * @description Calls the backend API to get suggested next tiles with throttling
     * 
     * @async
     * @throws {Error} If the API request fails
     */
    const predictNextTiles = React.useCallback(async () => {
        if (!transcript.trim()) {
            setPredictedTiles([]);
            return;
        }
        const sessionStart = sessionStartTimestampRef.current || 0;
        const pressedTilesForRequest = tileHistory
            .filter(t => t.rank >= sessionStart)
            .map(t => t.text);

        // Always allow manual prediction (no throttling for manual requests)
        const now = Date.now();
        lastPredictionRef.current = now;
        setIsPredicting(true);

        try {
            const response = await fetch(`${transcribeBaseUrl}/api/nextTilePred`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transcript, pressedTiles: pressedTilesForRequest }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 'success') {
                setPredictedTiles(data.predictedTiles || []);
                setPredictionTimestamp(Date.now());
            } else {
                setPredictedTiles([]);
            }
        } catch (error) {
            setPredictedTiles([]);
        } finally {
            setIsPredicting(false);
        }
    }, [transcript]);



    /**
     * Effect to set up Socket.io event listener for transcription results
     * 
     * @method useEffect
     * @description Listens for 'transcript' events from the server and updates the transcript state
     * 
     * @precondition Socket connection must be established
     * @postcondition Component will receive and display transcription updates
     */
    const transcriptHandler = React.useCallback((text: string) => {
        setTranscript((prev) => {
            const newTranscript = prev + " " + text;
            
            // No automatic prediction - only manual via search button
            // Cancel any existing auto-prediction timeout if it exists
            if (autoPredictionTimeoutRef.current) {
                clearTimeout(autoPredictionTimeoutRef.current);
                autoPredictionTimeoutRef.current = null;
            }

            return newTranscript;
        });
    }, []);

    React.useEffect(() => {
        // establish socket once
        socketRef.current = io(transcribeBaseUrl, {
            transports: ["websocket"],
            withCredentials: false,
        });
        
        // Add connection logging
        socketRef.current.on("connect", () => {
            setConnectionStatus("connected");
        });
        
        socketRef.current.on("disconnect", (reason) => {
            setConnectionStatus("disconnected");
        });
        
        socketRef.current.on("connect_error", (error) => {
            setConnectionStatus("error");
        });
        
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            // Clean up auto-prediction timeout
            if (autoPredictionTimeoutRef.current) {
                clearTimeout(autoPredictionTimeoutRef.current);
            }
        };
    }, []);

    /**
     * Renders the AudioTranscription component
     * 
     * @method render
     * @description Creates the DOM structure for the component
     * 
     * @returns {JSX.Element} The rendered component with recording controls and transcript display
     */
    return (
        <div
            className={`${styles.audioTranscriptionContainer} ${expanded ? styles.expanded : styles.collapsed
                }`}
        >
            <div
                className={styles.pullHandle}
                onClick={() => setExpanded(!expanded)}
                title={expanded ? "Collapse" : "Expand"}
            />

            <div className={styles.controlsContainer}>
                <button
                    className={record ? styles.stopButton : styles.recordButton}
                    onClick={record ? stopRecording : startRecording}
                >
                    {record ? "Stop Recording" : "Start Recording"}
                </button>
                <div className={styles.connectionStatus} title={`Socket status: ${connectionStatus}`}>
                    {connectionStatus === "connected" && "🟢 Connected"}
                    {connectionStatus === "connecting" && "🟡 Connecting"}
                    {connectionStatus === "error" && "🔴 Error"}
                    {connectionStatus === "disconnected" && "⚪ Disconnected"}
                </div>
            </div>

            <div className={styles.transcriptContainer}>
                <div className={styles.transcriptText}>
                    {transcript || "Transcript will appear here..."}
                </div>
            </div>

            <div className={styles.predictionContainer}>
                <button
                    className={styles.searchButton}
                    onClick={predictNextTiles}
                    disabled={isPredicting || !transcript.trim()}
                    title="Get next tile suggestions"
                >
                    {isPredicting ? "🔍..." : "🔍"}
                </button>

                <div className={styles.predictionResults}>
                    <div className={styles.predictionLabel}>
                        Suggested next tiles
                    </div>
                    <div className={styles.predictionTiles}>
                        {predictedTiles.length > 0 ? (
                            predictedTiles.map((tile, index) => (
                                <span key={index} className={styles.predictionTile}>
                                    {tile}
                                </span>
                            ))
                        ) : (
                            <span className={styles.predictionTile}>
                                No suggestions yet
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {audioURL && (
                <div className={styles.audioContainer}>
                    <button
                        className={styles.playButton}
                        onClick={togglePlayback}
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? "⏸️" : "▶️"}
                    </button>
                    <div className={styles.progressContainer}>
                        <div className={styles.timeText}>{formatTime(currentTimeSec)}</div>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${audioProgress}%` }}
                            ></div>
                        </div>
                        <div className={styles.timeText}>{formatTime(durationSec)}</div>
                    </div>
                    <audio
                        ref={audioRef}
                        src={audioURL}
                        onTimeUpdate={handleTimeUpdate}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onEnded={handleEnded}
                        className={styles.audioPlayer}
                    />
                </div>
            )}
        </div>
    );
};

export default AudioTranscription;
