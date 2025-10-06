---
sidebar_position: 1
---

# Highlighting





# **Audio Transcription**

This describes the functionality, state variables, and methods available in the `AudioTranscription` React component.


---

### `Component: AudioTranscription`
<details open="True">
    - A React component that records audio from the user’s microphone and sends it to a transcription server using Socket.io.
    - Displays real-time transcription results and provides playback for recorded audio.
</details>


---

### `Socket: socket`
<details open="True">
    - Establishes a WebSocket connection to the transcription server.
    - **Type:** `Socket`
    - **Server:** `http://localhost:5000`
</details>


### `State: record`
<details open="True">
    - Tracks whether recording is currently active.
    - **Type:** `boolean`
    - **Purpose:** Controls the recording state of the component.
</details>


### `State: transcript`
<details open="True">
    - Stores transcribed text received from the server.
    - **Type:** `string`
    - **Purpose:** Accumulates live transcription data from the socket connection.
</details>


### `State: audioURL`
<details open="True">
    - Holds the object URL for the most recently recorded audio blob.
    - **Type:** `string | null`
    - **Purpose:** Enables local playback of the last recording.
</details>


### `Ref: chunksRef`
<details open="True">
    - Stores raw audio chunks as they are recorded.
    - **Type:** `React.MutableRefObject<Blob[]>`
    - **Purpose:** Maintains recorded audio data between renders.
</details>


### `Ref: mediaRecorderRef`
<details open="True">
    - Holds the instance of the MediaRecorder API.
    - **Type:** `React.MutableRefObject<MediaRecorder | null>`
    - **Purpose:** Controls recording start, stop, and event handling.
</details>


---

### `useEffect: Initialize MediaRecorder`
<details open="True">
    - Requests microphone access from the browser.
    - Sets up the MediaRecorder and its event handlers once permission is granted.

    **Precondition:**
    - Browser must support the MediaDevices API.

    **Postcondition:**
    - MediaRecorder instance is created and ready for use.

    **Throws:**
    - Error if microphone access is denied or unavailable.
</details>


#### `Event: ondataavailable`
<details open="True">
    - Triggered whenever an audio chunk becomes available.
    - Sends the chunk buffer to the transcription server via Socket.io.
    - **Parameter:** `e (BlobEvent)` – Contains the recorded audio data.
</details>


#### `Event: onstop`
<details open="True">
    - Triggered when recording stops.
    - Combines all collected chunks into a single audio Blob and generates a playback URL.
    - **Parameter:** `e (Event)`
    - **Postcondition:** Playback URL is created and chunk buffer is cleared.
</details>


---

### `Function: startRecording()`
<details open="True">
    - Begins audio recording and streams data to the server every few seconds.

    **Precondition:**
    - MediaRecorder must be initialized and microphone access granted.

    **Postcondition:**
    - Recording state set to `true` and MediaRecorder starts capturing audio.

    **Throws:**
    - Error if MediaRecorder is not initialized or unavailable.
</details>


### `Function: stopRecording()`
<details open="True">
    - Stops active audio recording and finalizes the audio blob.

    **Precondition:**
    - MediaRecorder must be in `recording` state.

    **Postcondition:**
    - Recording state set to `false` and playback URL generated.

    **Throws:**
    - Error if MediaRecorder is not currently recording.
</details>


---

### `useEffect: Socket Listener`
<details open="True">
    - Listens for `"transcript"` events from the server.
    - Updates the transcript text in real time.
    - **Precondition:** Socket connection must be active.
    - **Postcondition:** Transcribed text appears dynamically in the UI.
</details>


---

### `Render`
<details open="True">
    - Renders the component UI, including:
        - Start and Stop recording buttons.
        - Recording status display.
        - Real-time transcript text.
        - Audio playback control (if available).
    - **Returns:** A JSX.Element
</details>





# **Audio Transcription Server**



# Module Documentation

This describes the functionality, configuration, and events of the **Audio Transcription Server**, a Node.js application that processes live audio via Socket.io and transcribes it using OpenAI’s Whisper API.


---

### `Module: server`
<details open="True">
    - A Node.js server that handles real-time audio transcription using Socket.io and OpenAI's Whisper API.
    - Receives audio chunks from clients, processes them with FFmpeg, converts them to WAV format, and sends them to Whisper for transcription.
</details>


---

### `Variable: app`
<details open="True">
    - **Type:** `express.Application`
    - **Description:** The main Express application object responsible for handling HTTP requests and serving static files.
</details>


### `Variable: server`
<details open="True">
    - **Type:** `http.Server`
    - **Description:** HTTP server instance created from the Express application.
</details>


### `Variable: io`
<details open="True">
    - **Type:** `Server`
    - **Description:** Socket.io server bound to the HTTP server with CORS enabled, used for real-time communication with clients.
</details>


### `Variable: __filename`
<details open="True">
    - **Type:** `string`
    - **Description:** Absolute path to the current module file.
</details>


### `Variable: __dirname`
<details open="True">
    - **Type:** `string`
    - **Description:** Absolute path to the directory containing the current module.
</details>


### `Middleware: express.static`
<details open="True">
    - Serves static files from the current directory.
    - **Purpose:** Allows clients to access frontend resources directly from the same server.
</details>


---

### `Variable: openai`
<details open="True">
    - **Type:** `OpenAI`
    - **Description:** Initialized OpenAI API client used to perform audio transcriptions with Whisper.
    - **Throws:** Error if `OPENAI_API_KEY` is not found in environment variables.
</details>


---

### `Function: server.listen()`
<details open="True">
    - **Description:** Starts the HTTP and Socket.io server.
    - **Postcondition:** The server is running and listening for connections on port `5000`.
</details>


---

### `Event: connection`
<details open="True">
    - **Emitter:** `io`
    - **Description:** Triggered when a new client connects via Socket.io.
    - **Parameter:** `socket (Socket)` — Represents the client’s active connection.
</details>


#### `Variable: ffmpeg`
<details open="True">
    - **Type:** `ChildProcess`
    - **Description:** Child process running FFmpeg for live audio conversion from WebM to PCM format.
</details>


#### `Variable: audioBuffer`
<details open="True">
    - **Type:** `Buffer`
    - **Description:** Holds accumulated PCM audio data for processing and transcription.
</details>


#### `Variable: isProcessing`
<details open="True">
    - **Type:** `boolean`
    - **Description:** Indicates whether the server is currently processing an audio chunk.
</details>


#### `Variable: fileCounter`
<details open="True">
    - **Type:** `number`
    - **Description:** Increments with each processed audio chunk to ensure unique filenames.
</details>


#### `Variable: silenceCounter`
<details open="True">
    - **Type:** `number`
    - **Description:** Tracks consecutive empty or too-small audio buffers to manage silence detection.
</details>


#### `Constant: CHUNK_DURATION`
<details open="True">
    - **Type:** `number`
    - **Value:** `4000`
    - **Description:** Defines the interval (in milliseconds) between automatic audio processing cycles.
</details>


---

### `Function: initializeFFmpeg()`
<details open="True">
    - **Description:** Initializes and configures the FFmpeg process to receive WebM audio input and output raw PCM data.

    **Precondition:**
    - FFmpeg must be installed and available in the system PATH.

    **Postcondition:**
    - `ffmpeg` variable contains an active process ready to handle audio input.

    **Throws:**
    - Error if FFmpeg is missing or encounters a startup failure.
</details>


#### `Event: stderr.data`
<details open="True">
    - Logs FFmpeg error messages for debugging.
    - **Parameter:** `data (Buffer)` — Contains FFmpeg stderr output.
</details>


#### `Event: close`
<details open="True">
    - Triggered when FFmpeg terminates.
    - **Parameter:** `code (number)` — Exit code from the FFmpeg process.
</details>


#### `Event: error`
<details open="True">
    - Handles FFmpeg errors gracefully and logs them.
    - **Parameter:** `err (Error)`
</details>


---

### `Event: stdout.data`
<details open="True">
    - Triggered when FFmpeg outputs PCM audio data.
    - **Parameter:** `chunk (Buffer)` — PCM audio chunk.
    - **Postcondition:** Data is appended to the `audioBuffer`.
</details>


---

### `Function: createWavFile(pcmData)`
<details open="True">
    - **Description:** Creates a valid WAV file from raw PCM audio data by manually writing the WAV header.
    - **Parameter:** `pcmData (Buffer)` — The raw PCM audio input.
    - **Returns:** `Buffer` — A complete WAV file ready for saving or transcription.
</details>


---

### `Function: processAudio()`
<details open="True">
    - **Description:** Processes buffered PCM audio, converts it to WAV, and sends it to OpenAI’s Whisper for transcription.

    **Precondition:**
    - Sufficient audio must exist in the buffer.

    **Postcondition:**
    - Transcription results are sent to the client via `socket.emit("transcript")`.

    **Throws:**
    - Error if file writing fails or the OpenAI API returns an error.

    **Async:** Yes
</details>


---

### `Variable: interval`
<details open="True">
    - **Type:** `NodeJS.Timeout`
    - **Description:** Interval timer that triggers `processAudio()` every `CHUNK_DURATION` milliseconds.
</details>


---

### `Event: audio-chunk`
<details open="True">
    - **Emitter:** `socket`
    - **Description:** Receives audio data chunks from clients and pipes them into the FFmpeg process.
    - **Parameter:** `data (ArrayBuffer)` — Raw audio data from the client.
    - **Throws:** Error if FFmpeg stdin is unwritable or encounters a write failure.
</details>


---

### `Event: disconnect`
<details open="True">
    - **Emitter:** `socket`
    - **Description:** Cleans up server-side resources when a client disconnects.
    - **Postcondition:**
        - FFmpeg process terminated.
        - Processing interval cleared.
        - Audio buffer reset.
</details>
