# AudioTranscription.tsx 

The `AudioTranscription.tsx` file implements a **React component** for real-time audio transcription and tile prediction, using the browser's microphone, the [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder), and a backend via [Socket.io](https://socket.io/).

This component is ideal for applications that require speech-to-text capabilities with intelligent suggestions (tiles) based on both spoken words and tile interactions—such as communication boards or accessible UIs for AAC (Augmentative and Alternative Communication).

## Dependencies - Socket.io

- `socket.io-client` for WebSocket communication.
- Several state/context providers (e.g., `useTranscript`, `usePredictedTiles`, `useUtteredTiles`, `useRecordingControl`)—assumed to be from the app's custom state management system.

**Purpose:** Sends audio chunks to the backend, receives live transcription.

- **Client emits:** `audio-chunk`
- **Server emits:** `transcript` (with transcribed text)

> **No REST endpoint, handled via Socket.io events.**

**Example flow:**
- Client emits: `audio-chunk` (binary)
- Server responds: `transcript` (string)


## Component Structure

### Main State & Refs

| Name                | Type                       | Purpose                                         |
|---------------------|---------------------------|-------------------------------------------------|
| record              | boolean                    | If recording is active                          |
| transcript          | string                     | Current transcript text                         |
| audioURL            | string \| null             | Recorded audio file URL                         |
| audioProgress       | number                     | Audio playback progress (0–100%)                |
| isPlaying           | boolean                    | If audio is currently playing                   |
| predictedTiles      | string[]                   | Tile suggestions from backend                   |
| utteredTiles        | Array<{ text: string } >   | Tiles "pressed" by the user                     |
| isActive            | boolean                    | If recording/session is enabled                 |
| isPredicting        | boolean                    | If a prediction request is in progress          |
| ...                 | ...                        | Various refs for timers, intervals, handlers    |



## Main Functions & Their Roles

| Function                       | Purpose                                                                                     | Usage Context               |
|--------------------------------|--------------------------------------------------------------------------------------------|-----------------------------|
| `startRecording()`             | Starts MediaRecorder, sets up listeners, and begins sending audio to server                | On start/auto-start         |
| `stopRecording()`              | Stops MediaRecorder, removes listeners, clears transcript & predictions                    | On stop or inactive         |
| `predictNextTiles()`           | Calls `/api/nextTilePred` to get suggestions based on transcript/tiles                     | On interval, tile click     |
| `setupPeriodicPredictionInterval()` | Sets up 15s interval for automatic prediction calls                                 | On recording                |
| `togglePlayback()`             | Plays or pauses recorded audio                                                             | On play/pause button        |
| `handleTimeUpdate()`           | Updates progress bar as audio plays                                                        | On audio playback           |



