# AudioTranscription.tsx 📻

The `AudioTranscription.tsx` file implements a **React component** for real-time audio transcription and tile prediction, using the browser's microphone, the [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder), and a backend via [Socket.io](https://socket.io/).

This component is ideal for applications that require speech-to-text capabilities with intelligent suggestions (tiles) based on both spoken words and tile interactions—such as communication boards or accessible UIs for AAC (Augmentative and Alternative Communication).

---

## Component Purpose

- **Records audio** from the user via the browser.
- Sends audio chunks to a local transcription server via WebSockets.
- Receives live transcription results and displays them.
- Predicts and displays "next tiles" (suggested actions or words) based on the transcript and tile interactions.
- Provides UI controls for starting/stopping recording, audio playback, and fetching suggestions.

---

## Key Features & Data Flow

- **Live audio recording** and real-time transcription.
- **Tile prediction** via a backend API endpoint.
- **Periodic and debounced prediction triggers** (every 15 seconds and on user tile clicks).
- **User interface** for controlling recording, viewing transcriptions, and exploring predictions.
- **Playback controls** for recorded audio.

---

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

---

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


---

## UI Controls and Layout

- **Start/Stop** button toggles audio recording and prediction.
- **Transcript area** shows the latest transcription.
- **Tile prediction** section with:
  - Search (🔍) button to manually fetch suggestions.
  - List of suggested tiles (or "No suggestions yet").
- **Audio playback** controls (if a recording exists):
  - Play/Pause button.
  - Progress bar with current/total time.

---


# Main Functions & Their Roles

Here are the most relevant internal methods in the component:

| Function                       | Purpose                                                                                     | Usage Context               |
|--------------------------------|--------------------------------------------------------------------------------------------|-----------------------------|
| `startRecording()`             | Starts MediaRecorder, sets up listeners, and begins sending audio to server                | On start/auto-start         |
| `stopRecording()`              | Stops MediaRecorder, removes listeners, clears transcript & predictions                    | On stop or inactive         |
| `predictNextTiles()`           | Calls `/api/nextTilePred` to get suggestions based on transcript/tiles                     | On interval, tile click     |
| `setupPeriodicPredictionInterval()` | Sets up 15s interval for automatic prediction calls                                 | On recording                |
| `togglePlayback()`             | Plays or pauses recorded audio                                                             | On play/pause button        |
| `handleTimeUpdate()`           | Updates progress bar as audio plays                                                        | On audio playback           |

---

### Special Logic: Prediction Triggers

- **Periodic:** Every 15 seconds during recording, if transcript or tiles have content, prediction is called.
- **Debounced by Tile Clicks:** When the user clicks tiles, a prediction is made after 1.5 seconds of inactivity, so rapid clicks don't spam the API.
- **Manual:** User can press the 🔍 button to force a prediction.

---

# Example UI Flow

1. **User clicks Start:** Microphone permission is requested. If granted, recording begins.
2. **Audio chunks stream to backend:** Transcription server emits transcript snippets, which display in real time.
3. **User presses tiles:** Prediction is (debounced) triggered and suggestions update.
4. **User clicks 🔍:** Manual prediction request is sent.
5. **Recording stops:** Transcript and suggestions reset; audio playback controls appear.


---
