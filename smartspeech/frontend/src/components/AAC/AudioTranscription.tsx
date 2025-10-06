import React from "react";
import { io } from "socket.io-client";

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
    const socket = io("http://localhost:5000");

    /**
     * State to track whether recording is active
     * 
     * @type {boolean}
     * @description Controls the recording state of the component
     */
    const [record, setRecording] = React.useState(false);
    
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
    const [audioURL, setaudioURL] = React.useState<string | null >(null);
    
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
                            socket.emit("audio-chunk", buffer);
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

            }).catch((err) => {
                console.error("The following error occured: ", err);
            }
            );
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
        //Check if browser sees any audio-in devices(if you have no mic, no stream object will be created)
        navigator.mediaDevices.enumerateDevices().then(devices => {
            // Print whether your device has a mic or not(f12)
            console.log(devices);
        });

        // start recorder
        mediaRecorderRef.current!.start(3000);
        // print mediaRecorder state
        console.log("recorder state", mediaRecorderRef.current!.state);
        console.log("recorder started");
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
        mediaRecorderRef.current!.stop();
        console.log(mediaRecorderRef.current!.state);
        console.log("recorder stopped");
    };

    /**
     * Effect to set up Socket.io event listener for transcription results
     * 
     * @method useEffect
     * @description Listens for 'transcript' events from the server and updates the transcript state
     * 
     * @precondition Socket connection must be established
     * @postcondition Component will receive and display transcription updates
     */
    React.useEffect(() => {
        socket.on("transcript", (text: String) => {
            setTranscript((prev) => prev + " " + text);
        });
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
        <div>
            <h2>Hello with Socket.io</h2>
            <button onClick={startRecording} >Start</button>
            <button onClick={stopRecording}>Stop</button>
            <p>Recording: {record ? "Yes" : "No"}</p>
            <p>Transcript: {transcript}</p>
            {audioURL && (
                <div>
                    <p>Click to listen:</p>
                    <audio src={audioURL} controls />
                </div>
            )}
        </div>
    );
}; 

export default AudioTranscription;