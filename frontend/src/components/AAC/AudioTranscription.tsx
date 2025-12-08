import React from "react";
import { io, Socket } from "socket.io-client";
import styles from "./AudioTranscription.module.css";
import { usePredictedTiles } from "@/react-state-management/providers/PredictedTilesProvider";
import { useUtteredTiles } from "@/react-state-management/providers/useUtteredTiles";
import { useRecordingControl } from "@/react-state-management/providers/RecordingControlProvider";
import { useTranscript } from "@/react-state-management/providers/TranscriptProvider";

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
     * Transcript from context provider
     * 
     * @type {string}
     * @description Accumulates transcribed text received from the server
     */
    const { transcript, setTranscript } = useTranscript();

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
    
    /**
     * Uttered tiles (pressed tiles) from context
     */
    const { tiles: utteredTiles } = useUtteredTiles();
    
    /**
     * Recording control from context
     */
    const { isActive, setIsActive } = useRecordingControl();
    
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
     * Reference to store the 15-second interval for automatic predictions
     * 
     * @type {React.MutableRefObject<NodeJS.Timeout | null>}
     * @description Stores the interval ID for periodic predictions
     */
    const periodicPredictionIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

    /**
     * Reference to store the latest transcript value for use in intervals
     * This prevents the interval from being recreated when transcript changes
     */
    const transcriptRef = React.useRef<string>("");
    
    /**
     * Reference to store the latest uttered tiles for use in intervals
     */
    const utteredTilesRef = React.useRef(utteredTiles);

    /**
     * Reference to track previous uttered tiles length to detect actual tile clicks
     */
    const previousUtteredTilesLengthRef = React.useRef(0);

    /**
     * Reference to store the debounce timeout for tile click predictions
     * 
     * @type {React.MutableRefObject<NodeJS.Timeout | null>}
     * @description Stores the timeout ID for debouncing tile click predictions
     */
    const tileClickDebounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    /**
     * Reference to store the latest isActive state for use in intervals
     */
    const isActiveRef = React.useRef(isActive);

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
            console.log("Asking for mic permission...");
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                // Resume here after user clicks allow 
                console.log("Got mic stream!", stream);
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
                    console.log("Data available after MediaRecorder.stop() called");
                    const blob = new Blob(chunksRef.current, { type: "audio/ogg; codecs=opus" });
                    chunksRef.current = [];
                    setaudioURL(URL.createObjectURL(blob));
                };

                // Auto-start will be handled by a separate effect after startRecording is defined
                console.log("MediaRecorder initialized and ready");

            }).catch((err) => {
                console.error("The following error occured: ", err);
            }
            );
        }
    }, []);

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
        console.log("Received transcript from server:", text);
        setTranscript((prev) => {
            const newTranscript = prev + " " + text;

            console.log("Updated transcript:", newTranscript);
            
            // Automatic prediction is handled by:
            // 1. Periodic 10-second interval
            // 2. Tile click events
            // No need to trigger on every transcript update to avoid too many requests

            return newTranscript;
        });
    }, [setTranscript]);

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
    const startRecording = React.useCallback(() => {
        if (!mediaRecorderRef.current || isRecordingRef.current || !isActive) {
            return; // Already recording, not ready, or not active
        }
        setRecording(true);
        isRecordingRef.current = true;
        setupPeriodicPredictionInterval(); // kick off periodic timer once recording starts
        if (socketRef.current) {
            console.log("Setting up transcript listener, socket connected:", socketRef.current.connected);
            socketRef.current.on("transcript", transcriptHandler);
        } else {
            console.error("Socket not initialized!");
        }
        //Check if browser sees any audio-in devices(if you have no mic, no stream object will be created)
        navigator.mediaDevices.enumerateDevices().then(devices => {
            // Print whether your device has a mic or not(f12)
            console.log(devices);
        });

        // start recorder
        mediaRecorderRef.current.start(3000);
        // print mediaRecorder state
        console.log("recorder state", mediaRecorderRef.current.state);
        console.log("recorder started");
    }, [transcriptHandler, isActive]);

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
        // Clear transcript and predicted tiles when stopping recording
        setTranscript("");
        setPredictedTiles([]);
        console.log(mediaRecorderRef.current!.state);
        console.log("recorder stopped");
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
     * Predicts next tiles based on current transcript and/or pressed tiles
     * 
     * @method predictNextTiles
     * @description Calls the backend API to get suggested next tiles
     * Can work with transcript only, pressed tiles only, or both
     * 
     * @async
     * @throws {Error} If the API request fails
     * 
     * @note Uses refs for transcript to prevent function recreation on transcript updates
     * This ensures predictions are only triggered explicitly (tile clicks or button press),
     * not automatically when transcript changes
     */
    const predictNextTiles = React.useCallback(async () => {
        // Don't predict if recording control is inactive
        if (!isActive) {
            return;
        }
        
        // Get recent pressed tiles (last 5 tiles for context)
        const recentPressedTiles = utteredTiles
            .slice(-5)
            .map(tile => tile.text)
            .filter(text => text && text.trim());

        // Use ref to get current transcript value (prevents function recreation on transcript changes)
        const currentTranscript = transcriptRef.current;

        // At least one of transcript or pressed tiles must be available
        if (!currentTranscript.trim() && recentPressedTiles.length === 0) {
            // Don't clear tiles if we have no context - just skip prediction
            return;
        }

        // Throttle predictions to avoid too many rapid requests
        // This prevents duplicate requests if user clicks multiple tiles quickly
        const now = Date.now();
        const timeSinceLastPrediction = now - lastPredictionRef.current;
        const minTimeBetweenPredictions = 500; // 500ms minimum between predictions (prevents rapid duplicate requests)

        if (timeSinceLastPrediction < minTimeBetweenPredictions) {
            // Skip this prediction if too soon after last one (prevents rapid duplicate requests)
            console.log(`[Prediction] Skipped - only ${Math.round(timeSinceLastPrediction)}ms since last prediction`);
            return;
        }

        lastPredictionRef.current = now;
        setIsPredicting(true);
        console.log(`[Prediction] Starting prediction at ${new Date().toLocaleTimeString()}`);

        // Keep existing predicted tiles visible while loading new ones
        // Don't clear them here - only update when new data arrives

        try {
            const response = await fetch('http://localhost:5000/api/nextTilePred', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    transcript: currentTranscript.trim() || undefined,
                    pressedTiles: recentPressedTiles.length > 0 ? recentPressedTiles : undefined
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 'success') {
                // Only update if we got valid predictions
                setPredictedTiles(data.predictedTiles || []);
                setPredictionTimestamp(Date.now());
            } else {
                console.error('Prediction error:', data.error);
                // Only clear on actual error, not on loading
                // Keep existing tiles if there's an error
            }
        } catch (error) {
            console.error('Error predicting next tiles:', error);
            // Don't clear tiles on error - keep the previous predictions visible
            // This prevents the flash/clear effect
        } finally {
            setIsPredicting(false);
        }
    }, [utteredTiles, isActive]); // Removed transcript from dependencies - using ref instead

    /**
     * Sets up or resets the periodic prediction interval
     * This function can be called to reset the 15-second timer
     * 
     * @method setupPeriodicPredictionInterval
     * @description Creates a new 15-second interval for automatic predictions, clearing any existing one
     */
    const setupPeriodicPredictionInterval = React.useCallback(() => {
        // Clear existing interval if it exists
        if (periodicPredictionIntervalRef.current) {
            clearInterval(periodicPredictionIntervalRef.current);
            periodicPredictionIntervalRef.current = null;
        }

        // Don't set up interval if not active or not recording
        if (!isActiveRef.current || !isRecordingRef.current) {
            return;
        }

        // Set up interval for automatic predictions every 15 seconds
        periodicPredictionIntervalRef.current = setInterval(() => {
            // Check if still active using ref to get current value
            if (!isActiveRef.current || !isRecordingRef.current) {
                return;
            }
            
            // Use refs to get latest values without causing effect to re-run
            const currentTranscript = transcriptRef.current;
            const currentUtteredTiles = utteredTilesRef.current;
            
            // Only predict if we have transcript or pressed tiles
            if (currentTranscript.trim() || currentUtteredTiles.length > 0) {
                // Get recent pressed tiles (last 5 tiles for context)
                const recentPressedTiles = currentUtteredTiles
                    .slice(-5)
                    .map(tile => tile.text)
                    .filter(text => text && text.trim());

                // Throttle predictions to avoid too many requests
                const now = Date.now();
                const timeSinceLastPrediction = now - lastPredictionRef.current;
                const minTimeBetweenPredictions = 13000; // 13 seconds minimum between predictions (to prevent overlap with 15-second interval)

                if (timeSinceLastPrediction < minTimeBetweenPredictions) {
                    console.log(`[Periodic Prediction] Skipped - only ${Math.round(timeSinceLastPrediction / 1000)}s since last prediction`);
                    return; // Skip if too soon after last one
                }

                lastPredictionRef.current = now;
                setIsPredicting(true);
                console.log(`[Periodic Prediction] Starting prediction at ${new Date().toLocaleTimeString()}`);

                // Call the prediction API
                fetch('http://localhost:5000/api/nextTilePred', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        transcript: currentTranscript.trim() || undefined,
                        pressedTiles: recentPressedTiles.length > 0 ? recentPressedTiles : undefined
                    }),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.status === 'success') {
                        setPredictedTiles(data.predictedTiles || []);
                        setPredictionTimestamp(Date.now());
                    }
                })
                .catch(error => {
                    console.error('Error predicting next tiles:', error);
                })
                .finally(() => {
                    setIsPredicting(false);
                });
            }
        }, 15000); // 15 seconds
    }, []);

    // Store startRecording in a ref to avoid recreating socket when it changes
    const startRecordingRef = React.useRef(startRecording);
    React.useEffect(() => {
        startRecordingRef.current = startRecording;
    }, [startRecording]);

    React.useEffect(() => {
        // establish socket once - only on mount/unmount, not when startRecording changes
        console.log(`[Frontend] Initializing socket connection`);
        socketRef.current = io("http://localhost:5000");
        
        // Add connection logging
        socketRef.current.on("connect", () => {
            console.log("Socket connected:", socketRef.current?.id);
            // Auto-start recording if MediaRecorder is ready and isActive is true
            // Use a small delay to ensure everything is initialized
            setTimeout(() => {
                if (mediaRecorderRef.current && socketRef.current?.connected && !isRecordingRef.current && isActive) {
                    console.log("Auto-starting recording after socket connection...");
                    startRecordingRef.current(); // Use ref to get latest version
                }
            }, 500);
        });
        
        socketRef.current.on("disconnect", (reason) => {
            console.log(`[Frontend] Socket disconnected, reason: ${reason}`);
            console.log(`[Frontend] Disconnect stack trace:`, new Error().stack);
        });
        
        socketRef.current.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });
        
        return () => {
            if (socketRef.current) {
                console.log(`[Frontend] Cleaning up socket connection (component unmounting)`);
                console.log(`[Frontend] Cleanup stack trace:`, new Error().stack);
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            // Clean up auto-prediction timeout
            if (autoPredictionTimeoutRef.current) {
                clearTimeout(autoPredictionTimeoutRef.current);
            }
            // Clean up periodic prediction interval
            if (periodicPredictionIntervalRef.current) {
                clearInterval(periodicPredictionIntervalRef.current);
            }
            // Clean up tile click debounce timeout
            if (tileClickDebounceTimeoutRef.current) {
                clearTimeout(tileClickDebounceTimeoutRef.current);
            }
        };
    }, []); // Empty dependency array - only run on mount/unmount

    /**
     * Effect to auto-start recording when both MediaRecorder and Socket are ready
     * This ensures recording starts regardless of which initializes first
     */
    React.useEffect(() => {
        const tryAutoStart = () => {
            if (
                mediaRecorderRef.current && 
                socketRef.current?.connected && 
                !isRecordingRef.current &&
                isActive
            ) {
                console.log("Both MediaRecorder and Socket ready - auto-starting recording...");
                startRecording();
                return true; // Successfully started
            }
            return false; // Not ready yet
        };

        // Try to start immediately if both are already ready
        if (tryAutoStart()) {
            return; // Already started, no need for interval
        }

        // Also set up a periodic check in case initialization is delayed
        const checkInterval = setInterval(() => {
            if (tryAutoStart()) {
                clearInterval(checkInterval);
            }
        }, 1000); // Check every second

        // Stop checking after 10 seconds to avoid infinite checking
        const timeout = setTimeout(() => {
            clearInterval(checkInterval);
        }, 10000);

        return () => {
            clearInterval(checkInterval);
            clearTimeout(timeout);
        };
    }, [startRecording]);

    /**
     * Effect to set up automatic prediction on tile clicks
     * Triggers prediction whenever user clicks a tile
     * Uses debouncing to prevent rapid duplicate requests when multiple tiles are clicked quickly
     */
    React.useEffect(() => {
        // Don't predict if not active
        if (!isActive) {
            // Clear any pending debounce timeout
            if (tileClickDebounceTimeoutRef.current) {
                clearTimeout(tileClickDebounceTimeoutRef.current);
                tileClickDebounceTimeoutRef.current = null;
            }
            return;
        }
        
        // Only trigger if tiles actually changed (length increased, meaning a new tile was clicked)
        if (utteredTiles.length > previousUtteredTilesLengthRef.current && utteredTiles.length > 0) {
            previousUtteredTilesLengthRef.current = utteredTiles.length;
            
            console.log(`[Prediction] Tile clicked (${utteredTiles.length} tiles) - debouncing prediction`);
            
            // Clear any existing debounce timeout
            if (tileClickDebounceTimeoutRef.current) {
                clearTimeout(tileClickDebounceTimeoutRef.current);
            }
            
            // Debounce: wait for a pause in tile clicks before making prediction
            // If multiple tiles are clicked within 1.5 seconds, only one prediction will be made
            tileClickDebounceTimeoutRef.current = setTimeout(async () => {
                console.log(`[Prediction] Triggered by tile click after debounce (${utteredTiles.length} tiles)`);
                await predictNextTiles();
                // Reset the 15-second periodic prediction timer after tile click prediction completes
                console.log(`[Periodic Prediction] Resetting 15-second timer after tile click prediction`);
                setupPeriodicPredictionInterval();
                tileClickDebounceTimeoutRef.current = null;
            }, 1500); // 1.5 second debounce - wait for pause in clicks
            
        } else if (utteredTiles.length !== previousUtteredTilesLengthRef.current) {
            // Update ref even if length decreased (tiles cleared)
            previousUtteredTilesLengthRef.current = utteredTiles.length;
            // Clear debounce timeout if tiles were cleared
            if (tileClickDebounceTimeoutRef.current) {
                clearTimeout(tileClickDebounceTimeoutRef.current);
                tileClickDebounceTimeoutRef.current = null;
            }
        }
        
        return () => {
            // Clean up debounce timeout on unmount or when dependencies change
            if (tileClickDebounceTimeoutRef.current) {
                clearTimeout(tileClickDebounceTimeoutRef.current);
                tileClickDebounceTimeoutRef.current = null;
            }
        };
    }, [utteredTiles.length, isActive, predictNextTiles, setupPeriodicPredictionInterval]);

    /**
     * Update refs when transcript or utteredTiles change
     */
    React.useEffect(() => {
        transcriptRef.current = transcript;
    }, [transcript]);

    React.useEffect(() => {
        utteredTilesRef.current = utteredTiles;
    }, [utteredTiles]);

    React.useEffect(() => {
        isActiveRef.current = isActive;
    }, [isActive]);

    /**
     * Effect to handle recording control state changes
     * Stops recording and clears data when isActive becomes false
     */
    React.useEffect(() => {
        if (!isActive) {
            // Stop recording if it's currently active
            if (isRecordingRef.current && mediaRecorderRef.current) {
                console.log("Stopping recording due to inactive state");
                setRecording(false);
                isRecordingRef.current = false;
                mediaRecorderRef.current.stop();
                if (socketRef.current) {
                    socketRef.current.off("transcript", transcriptHandler);
                }
            }
            // Clear transcript and predicted tiles
            setTranscript("");
            setPredictedTiles([]);
        } else {
            // If becoming active and not already recording, try to start
            if (!isRecordingRef.current && mediaRecorderRef.current && socketRef.current?.connected) {
                console.log("Starting recording due to active state");
                startRecording();
            }
        }
    }, [isActive, startRecording, transcriptHandler]);

    /**
     * Effect to set up periodic prediction every 15 seconds
     * Uses refs to avoid recreating the interval when transcript changes
     */
    React.useEffect(() => {
        // Don't set up interval if not active
        if (!isActive) {
            // Clear interval if it exists
            if (periodicPredictionIntervalRef.current) {
                clearInterval(periodicPredictionIntervalRef.current);
                periodicPredictionIntervalRef.current = null;
            }
            return;
        }
        
        // Set up the interval
        setupPeriodicPredictionInterval();

        return () => {
            if (periodicPredictionIntervalRef.current) {
                clearInterval(periodicPredictionIntervalRef.current);
                periodicPredictionIntervalRef.current = null;
            }
        };
    }, [isActive, setupPeriodicPredictionInterval]); // Re-run when isActive changes

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
                    className={isActive ? styles.stopButton : styles.recordButton}
                    onClick={() => {
                        const newActiveState = !isActive;
                        setIsActive(newActiveState);
                        // Clear predicted tiles immediately when stopping
                        if (!newActiveState) {
                            setPredictedTiles([]);
                        }
                    }}
                >
                    {isActive ? "Stop" : "Start"}
                </button>
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
                    disabled={isPredicting || (!transcript.trim() && utteredTiles.length === 0)}
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
