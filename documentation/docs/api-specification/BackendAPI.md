# Audio Transcription Server 

## Overview

The Audio Transcription Server enables real-time speech-to-text and context-aware word/tile suggestions for clients (such as web applications). It leverages:

- **Express** for HTTP and API endpoints
- **Socket.io** for real-time audio streaming
- **FFmpeg** for audio format conversion
- **Local Whisper model** for speech transcription
- **Local LLM (DistilGPT2)** and **vector search (MiniLM)** for word prediction
- **Supabase** (optional) for event logging

## Environment Variables

| Variable                     | Description                                 | Required? | Example                             |
|------------------------------|---------------------------------------------|-----------|-------------------------------------|
| `SUPABASE_URL`               | Supabase project REST API URL               | Optional  | `https://xyz.supabase.co`           |
| `SUPABASE_KEY`               | Supabase API Key                            | Optional  | `service-role-key`                  |
| `SUPABASE_LOG_TABLE`         | Supabase table for logging events           | Optional  | `transcript_highlights`             |

# API Endpoints

## Next Tile Prediction (Local LLM + Vector)

### `/api/nextTilePred` (POST)

Predicts the next set of tiles (words) based on transcript and/or pressed tiles using a local LLM and vector search.

#### Expected Input

- `transcript` (optional): Full or partial transcript text (string)
- `pressedTiles` (optional): Array of recently pressed tile strings

#### Output

- `predictedTiles`: Array of up to 10 suggested next tiles
- `status`: `success` or `error`
- `pressedTiles`: Array of tiles considered
- `context`: Text context used for prediction

#### Example Request

```bash
curl -X POST http://localhost:5000/api/nextTilePred \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "I would like to eat pizza",
    "pressedTiles": ["eat", "pizza"]
  }'
```

#### Example Response

```json
{
  "predictedTiles": ["drink", "water", "bread", "yes", "no", "please", "thankyou", "more", "help", "stop"],
  "status": "success",
  "context": "I would like to eat pizza",
  "pressedTiles": ["eat", "pizza"]
}
```

### API Block: Next Tile Prediction (POST)

```api
{
    "title": "Next Tile Prediction",
    "description": "Predict the next set of tiles/words based on transcript and/or pressed tiles using local LLM and vector search.",
    "method": "POST",
    "baseUrl": "http://localhost:5000",
    "endpoint": "/api/nextTilePred",
    "headers": [
        {
            "key": "Content-Type",
            "value": "application/json",
            "required": true
        }
    ],
    "queryParams": [],
    "pathParams": [],
    "bodyType": "json",
    "requestBody": "{\n  \"transcript\": \"I would like to eat pizza\",\n  \"pressedTiles\": [\"eat\", \"pizza\"]\n}",
    "responses": {
        "200": {
            "description": "Success",
            "body": "{\n  \"predictedTiles\": [\"drink\", \"water\", \"bread\", \"yes\", \"no\", \"please\", \"thankyou\", \"more\", \"help\", \"stop\"],\n  \"status\": \"success\",\n  \"context\": \"I would like to eat pizza\",\n  \"pressedTiles\": [\"eat\", \"pizza\"]\n}"
        },
        "400": {
            "description": "Validation error",
            "body": "{\n  \"error\": \"Either transcript or pressedTiles (or both) must be provided\",\n  \"status\": \"error\"\n}"
        },
        "500": {
            "description": "Internal error",
            "body": "{\n  \"error\": \"Internal server error\",\n  \"status\": \"error\"\n}"
        }
    }
}
```

## Next Tile Prediction (Local LLM, Customizable TopN)

### `/api/nextTilePredLocal` (POST)

Similar to `/api/nextTilePred`, but allows specifying the number of predictions (`topN`).

#### Expected Input

- `transcript` (optional): Full or partial transcript text (string)
- `pressedTiles` (optional): Array of recently pressed tile strings
- `topN` (optional): Number of top tiles to return (default: 10)

#### Output

- `predictedTiles`: Array of up to `topN` suggested next tiles
- `status`: `success` or `error`
- `pressedTiles`: Array of tiles considered
- `context`: Text context used for prediction

#### Example Request

```bash
curl -X POST http://localhost:5000/api/nextTilePredLocal \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "I am thirsty",
    "pressedTiles": ["drink"],
    "topN": 5
  }'
```

#### Example Response

```json
{
  "predictedTiles": ["water", "milk", "juice", "yes", "no"],
  "status": "success",
  "context": "I am thirsty",
  "pressedTiles": ["drink"]
}
```

### API Block: Next Tile Prediction Local (POST)

```api
{
    "title": "Next Tile Prediction Local",
    "description": "Predict the next set of tiles/words based on transcript and/or pressed tiles using local LLM and vector search, allowing custom topN.",
    "method": "POST",
    "baseUrl": "http://localhost:5000",
    "endpoint": "/api/nextTilePredLocal",
    "headers": [
        {
            "key": "Content-Type",
            "value": "application/json",
            "required": true
        }
    ],
    "queryParams": [],
    "pathParams": [],
    "bodyType": "json",
    "requestBody": "{\n  \"transcript\": \"I am thirsty\",\n  \"pressedTiles\": [\"drink\"],\n  \"topN\": 5\n}",
    "responses": {
        "200": {
            "description": "Success",
            "body": "{\n  \"predictedTiles\": [\"water\", \"milk\", \"juice\", \"yes\", \"no\"],\n  \"status\": \"success\",\n  \"context\": \"I am thirsty\",\n  \"pressedTiles\": [\"drink\"]\n}"
        },
        "400": {
            "description": "Validation error",
            "body": "{\n  \"error\": \"Either transcript or pressedTiles (or both) must be provided\",\n  \"status\": \"error\"\n}"
        },
        "500": {
            "description": "Internal error",
            "body": "{\n  \"error\": \"Internal server error\",\n  \"status\": \"error\"\n}"
        }
    }
}
```

# WebSocket (Real-time) Audio Transcription

Clients can connect to the server via Socket.io and stream audio in real time. The server transcribes audio and emits results back.

## WebSocket Events

### Client → Server

- **audio-chunk**: Send a chunk of raw WebM audio data.

### Server → Client

- **transcript**: Emits the latest transcribed text.

## Example Client Usage (JavaScript)

```js
import io from "socket.io-client";

const socket = io("http://localhost:5000");

// ... obtain an audio chunk (arraybuffer) ...
socket.emit("audio-chunk", audioBuffer);

// Listen for transcription results
socket.on("transcript", (text) => {
  console.log("Transcribed:", text);
});
```

## Example: Finding Relevant Words

```js
const context = "I would like to drink water";
const words = ["yes", "no", "drink", "water", "bread", "hello"];
const relevant = findRelevantWords(context, words);
// Output: ["drink", "water", "yes", "no", ...]
```
