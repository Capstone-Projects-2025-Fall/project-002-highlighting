---
sidebar_position: 5
---
# Class Diagrams



**Figure 1.** High level view Front end class diagram

### Frontend Components

#### 1. Audio Transcription Server

**Location**: `backend/server.mjs`

**Purpose**: Handles real-time audio transcription using local Whisper model.

**Architecture**:
```
Client (WebSocket)
    ↓
Audio Chunks (WebM)
    ↓
FFmpeg (WebM → PCM)
    ↓
WAV File Creation
    ↓
Whisper Model (Local)
    ↓
Transcription Text
    ↓
Client (WebSocket)
```

#### 2. Tiles Component

**Location**: `frontend/src/components/AAC/Tiles.tsx`

**Purpose**: Displays the AAC board with tiles and applies highlighting based on predictions.

**Key Features**:
- Renders tiles in a grid layout
- Supports hierarchical navigation (folders/subtiles)
- Applies opacity-based highlighting to predicted tiles
- Supports multiple highlight methods (opacity, darken)
- Manages tile selection and navigation state

**Highlighting Logic**:
```typescript
// Predicted tiles: 100% opacity, pulsing animation when selected, border outline when selected
// Non-predicted tiles: 50% opacity (when predictions exist), not pulsing, doesn't have an outline
// Default: 100% opacity (when no predictions)

const tileOpacity = shouldBeHighlighted ? 100 : 50;
```

**State Management**:
- Uses `useTilesProvider` for tile data
- Uses `usePredictedTiles` for prediction results
- Uses `useHighlightMethods` for highlight mode selection
- Uses reducer (`stackReducer`) for navigation stack


#### 3. State Management Providers

**Location**: `frontend/src/react-state-management/providers/`

**Key Providers**:

1. **TranscriptProvider**: Manages transcript state
   - Stores accumulated transcript text
   - Provides `transcript` and `setTranscript`

2. **PredictedTilesProvider**: Manages predicted tiles
   - Stores array of predicted tile words
   - Provides `predictedTiles` and `setPredictedTiles`

3. **RecordingControlProvider**: Manages recording state
   - Tracks if recording is active
   - Provides `isActive` and `setIsActive`

4. **useUtteredTiles**: Tracks pressed tiles
   - Maintains history of clicked tiles
   - Provides `tiles`, `addTile`, `removeLastTile`, `clear`

5. **HighlightMethodsProvider**: Manages highlight modes
   - Supports 'opacity' and 'darken' methods
   - Provides `activeHighlights` Set






---







**Figure 2.** High level view Back end class diagram

## Backend Components

#### 1. Audio Transcription Server

**Location**: `backend/server.mjs`

**Purpose**: Handles real-time audio transcription using local Whisper model.

**Architecture**:

```
Client (WebSocket)
    ↓
Audio Chunks (WebM)
    ↓
FFmpeg (WebM → PCM)
    ↓
WAV File Creation
    ↓
Whisper Model (Local)
    ↓
Transcription Text
    ↓
Client (WebSocket)
```
**Key Functions**:

1. **Audio Processing Pipeline**:
   ```javascript
   // Receives WebM audio chunks
   socket.on("audio-chunk", (data) => {
     ffmpeg.stdin.write(Buffer.from(data))
   })
   
   // FFmpeg converts to PCM
   ffmpeg.stdout.on("data", (chunk) => {
     audioBuffer = Buffer.concat([audioBuffer, chunk])
   })
   
   // Process audio every 3-6 seconds
   const processAudio = async () => {
     const wavData = createWavFile(pcmChunk)
     const transcribedText = await transcribeAudioLocal(filePath)
     socket.emit("transcript", transcribedText)
   }
   ```

2. **Whisper Transcription**:
   - Model: `Xenova/whisper-small.en`
   - Input: WAV file (16kHz, mono, PCM)
   - Output: Transcribed text
   - Anti-hallucination parameters:
     - `temperature: 0` (greedy decoding)
     - `no_speech_threshold: 0.6`
     - `logprob_threshold: -1.0`
     - `compression_ratio_threshold: 2.4`

3. **Audio Validation**:
   - Checks RMS energy to detect silence
   - Validates minimum audio duration (1.5 seconds)
   - Filters out hallucinations using pattern matching
   - Removes unwanted markers from transcription

4. **Duplicate Detection**:
   - Compares new transcriptions with previous ones
   - Uses similarity scoring to prevent duplicate sends
   - Implements time-based throttling (2 seconds minimum)

#### 2. Tile Prediction System

**Location**: `backend/server.mjs` (function: `predictNextTilesLocalLLM`)

**Purpose**: Predicts relevant tiles based on transcript and pressed tiles.

**Architecture**:

```
Input: Transcript + Pressed Tiles
    ↓
Context Embedding (all-MiniLM-L6-v2)
    ↓
Vector Search (Cosine Similarity)
    ↓
Candidate Selection (Top 60)
    ↓
LLM Prompt Generation (DistilGPT2)
    ↓
Text Generation
    ↓
Word Extraction & Filtering
    ↓
Output: Predicted Tiles (Top 10)
```

**Prediction Modes**:

1. **Transcript Only**: Uses only transcribed text
2. **Tiles Only**: Uses only recently pressed tiles
3. **Both**: Combines transcript and pressed tiles

**Key Functions**:

1. **Embedding Generation**:
   ```javascript
   // Embed context (transcript + tiles)
   const queryEmb = await embedText(combinedContext)
   
   // Embed all tile labels (cached)
   const labelEmbeddings = await embedText(label)
   ```

2. **Vector Search**:
   ```javascript
   // Calculate cosine similarity
   const sims = labelEmbeddings.map(e => 
     cosineSimilarity(queryEmb, e)
   )
   
   // Get top 60 candidates
   const topIndices = topNIndices(sims, 60)
   ```

3. **LLM-Based Selection**:
   ```javascript
   // Generate prompt with context
   const prompt = `Recently pressed tiles: ${pressedTiles.join(', ')}
   Transcript: "${contextLines}"
   
   Based on the context, select the 10 best next tiles from: ${candidateWords.join(', ')}`
   
   // Generate with LLM
   const result = await llm(prompt, {
     max_new_tokens: 40,
     temperature: 0,
     do_sample: false
   })
   ```

4. **Word Filtering**:
   - Excludes common words (pronouns, prepositions, etc.)
   - Prioritizes high-value words (actions, emotions, nouns)
   - Validates words against candidate list
   - Returns top 10 predictions

**API Endpoint**: `POST /api/nextTilePred`

**Request Body**:
```json
{
  "transcript": "string (optional)",
  "pressedTiles": ["string"] (optional)
}
```

**Response**:
```json
{
  "predictedTiles": ["word1", "word2", ...],
  "status": "success",
  "context": "transcript text",
  "pressedTiles": ["tile1", "tile2", ...]
}
```

#### 3. Python FastAPI Server

**Location**: `backend/src/main.py`

**Purpose**: Provides REST API endpoints for additional features.

**Endpoints**:
- `GET /`: Health check
- `GET /health-check`: Health status
- `POST /similarity`: Word similarity suggestions (uses spaCy)
- `POST /tts`: Text-to-speech
- `POST /rekognition`: Image recognition
- `POST /s3/*`: S3 file operations
- `POST /custom_tiles/*`: Custom tile management

**Similarity Endpoint** (`/similarity`):
- Uses spaCy `en_core_web_lg` model
- Calculates semantic similarity between words
- Returns top N similar words from vocabulary

---

#### Data Flow

#### Audio Transcription Flow

```
1. User clicks "Start Recording"
   ↓
2. AudioTranscription component requests microphone access
   ↓
3. MediaRecorder starts capturing audio (WebM format)
   ↓
4. Audio chunks sent via WebSocket to backend
   ↓
5. Backend receives chunks, converts to PCM via FFmpeg
   ↓
6. Audio buffer accumulates (3-6 second chunks)
   ↓
7. WAV file created from PCM data
   ↓
8. Whisper model transcribes audio
   ↓
9. Transcription validated and cleaned
   ↓
10. Transcript sent back to client via WebSocket
    ↓
11. Client updates transcript state
    ↓
12. Prediction request triggered automatically
```
#### Tile Prediction Flow

```
1. Transcript updated OR tiles pressed
   ↓
2. AudioTranscription component calls fetchPredictions()
   ↓
3. HTTP POST to /api/nextTilePred
   Request: { transcript, pressedTiles }
   ↓
4. Backend creates combined context
   ↓
5. Context embedded using all-MiniLM-L6-v2
   ↓
6. Vector search finds top 60 candidate tiles
   ↓
7. LLM (DistilGPT2) selects best 10 from candidates
   ↓
8. Response: { predictedTiles: [...] }
   ↓
9. Frontend updates PredictedTilesProvider
   ↓
10. Tiles component re-renders with highlighting
```

#### Highlighting Flow

```
1. PredictedTilesProvider updated with new predictions
   ↓
2. Tiles component receives predictedTiles array
   ↓
3. For each tile:
   - Check if tile text matches predicted tiles
   - Check if any subtiles match (recursive)
   ↓
4. Calculate opacity:
   - Predicted: 100% opacity
   - Non-predicted: 50% opacity (when predictions exist)
   - Default: 100% opacity (when no predictions)
   ↓
5. Apply opacity via CSS data attribute
   ↓
6. Tiles visually highlighted on screen
```

---

## Model Details

#### Whisper Model

**Model**: `Xenova/whisper-small.en`
- **Size**: ~244MB
- **Language**: English only
- **Input**: 16kHz mono PCM audio
- **Output**: Transcribed text
- **Performance**: ~1-3 seconds per 3-6 second audio chunk

**Configuration**:
```javascript
{
  return_timestamps: false,
  language: 'en',
  temperature: 0,  // Greedy decoding
  no_speech_threshold: 0.6,
  logprob_threshold: -1.0,
  compression_ratio_threshold: 2.4
}
```

#### Embedding Model

**Model**: `Xenova/all-MiniLM-L6-v2`
- **Size**: ~80MB
- **Dimensions**: 384
- **Purpose**: Semantic similarity search
- **Performance**: ~50-100ms per embedding

**Usage**:
- Embeds conversation context
- Embeds all tile labels (cached on startup)
- Cosine similarity for vector search

#### LLM Model

**Model**: `Xenova/distilgpt2`
- **Size**: ~350MB
- **Purpose**: Text generation for tile selection
- **Performance**: ~200-500ms per generation

**Configuration**:
```javascript
{
  max_new_tokens: 40,
  temperature: 0,  // Greedy decoding
  do_sample: false,
  return_full_text: false
}
```

---

## Configuration

#### Environment Variables

**Backend** (`.env` file):
```bash
OPENAI_API_KEY=sk-proj-...  # For testing (not used in local mode)
```

#### Server Configuration

**Ports**:
- Frontend: `http://localhost:3000`
- Backend (Node.js): `http://localhost:5000`
- Backend (Python FastAPI): Default port
8
**CORS Configuration**:
```javascript
origins: [
  "http://localhost:3000",
  "http://localhost",
  "https://highlighting.vercel.app/"
]
```

#### Audio Processing Settings

- **Sample Rate**: 16000 Hz
- **Channels**: Mono (1)
- **Format**: PCM 16-bit signed little-endian
- **Chunk Duration**: 3-6 seconds
- **Overlap**: 0.5 seconds (to catch boundary words)

