import React from "react";
import { io } from "socket.io-client";

const AudioTranscription = () => {

    const socket = io("http://localhost:5000");

    // Create record state variable. Can be flipped on and off by clicking ona button
    const [record, setRecording] = React.useState(false);
    // coming soon...
    const [transcript, setTranscript] = React.useState("");
    // Declare(not yet instiated) variable that will record audio stream 
    const [audioURL, setaudioURL] = React.useState<string | null >(null);
    const chunksRef = React.useRef<Blob[]>([]); // store audio chunks (UseRef ensures no re-render when var changes)
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null); // declare mediaRecorder var
    // Request mic permision 
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


                // event that triggers when recorder picks up audio
                mediaRecorderRef.current.ondataavailable = (e) => {
                    if (e.data.size > 0) {

                        e.data.arrayBuffer().then((buffer) => {
                            socket.emit("audio-chunk", buffer);
                        });
                    }
                    chunksRef.current.push(e.data);
                };


                // event that triggers when Recorder is stopped
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
    // Start recording functionality
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
    // turn off recorder
    const stopRecording = () => {
        setRecording(false);
        mediaRecorderRef.current!.stop();
        console.log(mediaRecorderRef.current!.state);
        console.log("recorder stopped");

    };

    React.useEffect(() => {
        socket.on("transcript", (text: String) => {
            setTranscript((prev) => prev + " " + text);
        });
    }, []);



    // return  DOM element to be injected into root id div
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
}; export default AudioTranscription;
