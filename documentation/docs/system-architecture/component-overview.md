---
sidebar_position: 6
---

# Component Overview
## Client Side (TypeScript)
### Responsibilities:
Captures audio from the user’s microphone.
Records and packages the audio stream for transfer.
Sends audio data to the backend server via WebSocket.
Receives transcription and classification results from the server.
Updates the AAC board by highlighting relevant pictographic labels based on the returned results.

### Components & Interfaces:
#### Media Devices Interface
**Function**: Requests access to the user’s microphone.
**Input**: User permission to access device.
**Output**: Live audio stream object.

#### Media Recorder Interface
**Function**: Controls audio recording (start, stop).
**Input**: Audio stream from Media Devices.
**Output**: Encoded audio chunks.
**Interface**: Sends audio chunks via WebSocket to the server.

#### AI Model (Client-Side Layer)
**Function**: Receives classification results from server.
**Input**: Transcribed text + pictographic labels.
**Output**: Highlighting of AAC board with relevant pictographs.

## Server Side (Node.js, .mjs)
### Responsibilities:
Accepts incoming audio streams from client over WebSocket.
Converts raw audio data into a format compatible with Whisper AI.
Requests transcription from Whisper API.
Sends back transcription and pictographic classifications to the client.

### Components & Interfaces:
#### WebSocket Server Interface
**Function**: Receives audio streams from client, returns transcription data.
**Input**: Encoded audio chunks from client.
**Output**: Transcribed text + classification results.

#### Audio Processing Module (FFmpeg)
**Function**: Converts audio format from WebM to PCM.
**Input**: Raw audio chunks from client.
**Output**: PCM data with WAV header.

#### Whisper AI API
**Function**: Performs speech-to-text transcription.
**Input**: WAV file (PCM encoded audio).
**Output**: Transcription (JSON, plain text, or SRT) with metadata such as timestamps.


#### Classification Module (Server-Side AI Model Layer)
**Function**: Maps transcribed words to pictographic labels.
**Input**: Text transcription.
**Output**: List of pictographs + context-sensitive highlighting data for client.


## Database Layer (Future Integration)
### Responsibilities:
Stores user transcripts, audio metadata, and classification outputs.
Maintains logs for repeated use and system improvement.
Supports personalized AAC board adaptation over time.

### Interfaces:
#### Data Storage Interface
**Input**: Transcriptions, pictograph mappings, user interaction logs.
**Output**: Stored and retrievable records.

#### Query Interface
**Function**: Provides past transcripts and context to the AI model for more accurate predictions.
**Output**: Context-aware classification suggestions.