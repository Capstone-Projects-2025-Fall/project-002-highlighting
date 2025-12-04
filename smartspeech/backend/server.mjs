/**
 * Audio Transcription Server
 * 
 * @module server
 * @description A Node.js server that handles real-time audio transcription using Socket.io and local Whisper model.
 * The server receives audio chunks from clients, processes them using FFmpeg, and transcribes them using local Whisper.
 */

import express from "express";
import http from "http";
import { Server } from "socket.io";
import { spawn, exec } from "child_process";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import ffmpegPath from "ffmpeg-static";
import os from "os";
import { pipeline } from "@xenova/transformers";
// loads variable from .env file into process.env
dotenv.config();
import { File } from "node:buffer";
globalThis.File = File;

// Default to the previous Whisper model unless overridden for constrained hosts
const WHISPER_MODEL_ID = process.env.WHISPER_MODEL_ID || "Xenova/whisper-base.en";
const USE_FAST_TILE_PREDICTION = (process.env.FAST_TILE_PREDICTION || "true").toLowerCase() === "true";

/**
 * Express application instance
 * 
 * @type {express.Application}
 * @description The main Express application object that handles HTTP requests
 */
const app = express();

/**
 * HTTP server instance
 * 
 * @type {http.Server}
 * @description HTTP server created from the Express application
 */
const server = http.createServer(app);

/**
 * Socket.io server instance
 * 
 * @type {Server}
 * @description Socket.io server bound to the HTTP server with CORS enabled
 */
const io = new Server(server, {
  cors: { origin: "*" },
});

/**
 * Current file path
 * 
 * @type {string}
 * @description Absolute path to the current module file
 */
const __filename = fileURLToPath(import.meta.url);

/**
 * Current directory path
 * 
 * @type {string}
 * @description Absolute path to the directory containing the current module
 */
const __dirname = path.dirname(__filename);

/**
 * Temporary files directory
 * 
 * @type {string}
 * @description Path to the temporary files directory
 */
const tempDir = path.join(__dirname, 'temp');

/**
 * Ensure temp directory exists
 * 
 * @description Creates the temp directory if it doesn't exist
 */
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log('Created temp directory:', tempDir);
}

/**
 * Configure Express to serve static files
 * 
 * @description Sets up middleware to serve static files from the current directory
 */
app.use(express.static(__dirname));

/**
 * Configure Express to parse JSON bodies
 * 
 * @description Sets up middleware to parse JSON request bodies
 */
app.use(express.json());

/**
 * Configure CORS for API endpoints
 * 
 * @description Sets up CORS headers to allow frontend requests
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

/**
 * Server runs in local mode only
 * - Uses local LLM with local vector search for tile prediction
 * - Uses local Whisper model for audio transcription
 */
console.log('Running in local mode - using local LLM and local Whisper transcription');

/**
 * Load words from words.json file
 * 
 * @type {Object}
 * @description Contains the list of all available tiles/words
 */
let wordsData = null;

try {
  const wordsPath = path.join(__dirname, 'resources', 'words.json');
  const wordsFile = fs.readFileSync(wordsPath, 'utf8');
  wordsData = JSON.parse(wordsFile);
  console.log(`Loaded ${wordsData.tiles.length} words from words.json`);
} catch (error) {
  console.error("Error loading words.json:", error);
  process.exit(1);
}


/**
 * Next Tile Prediction endpoint
 * 
 * @route POST /api/nextTilePred
 * @description Uses vector search and local LLM to predict next tiles based on:
 *   - Tiles pressed (even if there is no transcript)
 *   - The transcript (if available)
 *   - Both tiles pressed and transcript (if both are available)
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing optional transcript text and/or pressed tiles
 * @param {string} [req.body.transcript] - Optional transcript text to analyze
 * @param {string[]} [req.body.pressedTiles] - Optional array of recently pressed tiles to consider
 * @param {Object} res - Express response object
 * 
 * @returns {Object} JSON response with predicted tiles
 * @returns {string[]} predictedTiles - Array of suggested next tiles (up to 10)
 * @returns {string} status - Success or error status
 * @returns {string[]} pressedTiles - Array of pressed tiles that were considered
 * @returns {string} context - The context used for prediction (transcript or empty string)
 */
app.post('/api/nextTilePred', async (req, res) => {
  try {
    const { transcript, pressedTiles } = req.body;
    
    // Validate pressedTiles if provided
    const validPressedTiles = Array.isArray(pressedTiles) 
      ? pressedTiles.filter(t => typeof t === 'string' && t.trim().length > 0)
      : [];

    // Process transcript if provided
    let contextLines = '';
    if (transcript && typeof transcript === 'string' && transcript.trim()) {
      // Get the last few lines of the transcript for context
      const lines = transcript.trim().split('\n').filter(line => line.trim());
      contextLines = lines.slice(-2).join(' '); // Last 2 lines as context
    }

    // At least one of transcript or pressedTiles must be provided
    if (!contextLines.trim() && validPressedTiles.length === 0) {
      return res.status(400).json({ 
        error: 'Either transcript or pressedTiles (or both) must be provided',
        status: 'error'
      });
    }

    // Use Local LLM with vector search
    const predictionMode = contextLines.trim() && validPressedTiles.length > 0 
      ? 'transcript and tiles'
      : contextLines.trim() 
        ? 'transcript only'
        : 'tiles only';
    console.log(`[Prediction] Using Local LLM with vector search (mode: ${predictionMode})`);
    
    const predicted = await predictNextTilesLocalLLM(contextLines, validPressedTiles, 10);
    return res.json({
      predictedTiles: predicted,
      status: 'success',
      context: contextLines || '',
      pressedTiles: validPressedTiles
    });

  } catch (error) {
    console.error('NextTilePred error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      status: 'error'
    });
  }
});




/**
 * Simple word relevance matching function
 * 
 * @function findRelevantWords
 * @description Finds relevant words based on context using simple text matching
 * 
 * @param {string} context - The conversation context
 * @param {string[]} words - Array of available words
 * @returns {string[]} Array of relevant words (max 10)
 */
function findRelevantWords(context, words) {
  const contextLower = context.toLowerCase();
  const contextWords = contextLower.split(/\s+/);
  
  // Comprehensive exclusion list
  const excludedWords = [
    // Pronouns
    'he', 'she', 'it', 'they', 'we', 'you', 'him', 'her', 'his', 'hers', 'theirs', 'mine', 'yours', 'ours',
    // Prepositions/conjunctions
    'and', 'or', 'but', 'because', 'if', 'when', 'where', 'what', 'who', 'how', 'why',
    'at', 'by', 'for', 'from', 'in', 'of', 'on', 'to', 'with', 'up', 'down', 'over', 'under', 'through',
    // Auxiliary verbs
    'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must',
    // Filler words
    'again', 'also', 'still', 'very', 'really', 'maybe', 'definitely', 'almost', 'even', 'just', 'only',
    // Generic/low-value words
    'bottom', 'top', 'side', 'middle', 'front', 'back', 'left', 'right', 'center',
    'ai', 'animal', 'chair', 'bad', 'bridge', 'bring', 'thing', 'stuff', 'place', 'way', 'time',
    'day', 'night', 'year', 'month', 'week', 'hour', 'minute', 'second',
    'about', 'around', 'somewhere', 'anywhere', 'everywhere', 'nowhere',
    'awesome', 'cool', 'nice', 'good', 'great', 'wonderful', 'amazing', 'fantastic'
  ];
  
  // High-value words prioritized by category
  const highValueWords = {
    // Essential communication (highest priority)
    essential: ['yes', 'no', 'please', 'thankyou', 'hello', 'goodbye', 'okay', 'sorry', 'excuseMe'],
    
    // Action words (high priority)
    actions: ['eat', 'drink', 'sleep', 'walk', 'run', 'jump', 'sit', 'stand', 'play', 'work',
              'help', 'stop', 'start', 'finish', 'learn', 'teach', 'give', 'take', 'buy', 'sell',
              'cook', 'clean', 'wash', 'fix', 'open', 'close', 'push', 'pull', 'cut', 'break',
              'drive', 'ride', 'fly', 'swim', 'dance', 'sing', 'read', 'write', 'draw', 'paint'],
    
    // Emotional words (high priority)
    emotions: ['happy', 'sad', 'tired', 'sick', 'excited', 'scared', 'angry', 'confused', 'frustrated',
               'nervous', 'shy', 'smart', 'pretty', 'handsome', 'hungry', 'thirsty', 'hot', 'cold'],
    
    // Important nouns (medium-high priority)
    nouns: ['home', 'school', 'work', 'food', 'family', 'friend', 'mother', 'father', 'brother',
            'sister', 'grandma', 'grandpa', 'baby', 'boy', 'girl', 'man', 'woman', 'people',
            'water', 'milk', 'bread', 'pizza', 'hamburger', 'carrot', 'apple', 'orange',
            'car', 'bus', 'house', 'room', 'bed', 'table', 'door', 'window',
            'book', 'toy', 'game', 'music', 'song', 'tv', 'phone', 'computer'],
    
    // Descriptive words (medium priority)
    descriptive: ['big', 'small', 'new', 'old', 'fast', 'slow', 'loud', 'quiet',
                  'hard', 'soft', 'sharp', 'dull', 'clean', 'dirty', 'wet', 'dry', 'full', 'empty'],
    
    // Quantity/time words (lower priority)
    quantity: ['more', 'less', 'all', 'some', 'many', 'few', 'first', 'last', 'next', 'ready']
  };
  
  // Score words based on context relevance and category priority
  const scoredWords = words.map(word => {
    const wordLower = word.toLowerCase();
    
    // Skip excluded words
    if (excludedWords.includes(wordLower)) {
      return { word, score: -100 };
    }
    
    let score = 0;
    
    // High score for words that appear in context
    if (contextWords.includes(wordLower)) {
      score += 20;
    }
    
    // Score by category priority
    for (const [category, wordList] of Object.entries(highValueWords)) {
      if (wordList.includes(wordLower)) {
        switch (category) {
          case 'essential': score += 15; break;
          case 'actions': score += 12; break;
          case 'emotions': score += 10; break;
          case 'nouns': score += 8; break;
          case 'descriptive': score += 5; break;
          case 'quantity': score += 3; break;
        }
        break;
      }
    }
    
    // Common follow-up patterns
    const commonPatterns = [
      'yes', 'no', 'please', 'thankyou', 'hello', 'goodbye', 'okay', 'sorry',
      'more', 'help', 'stop', 'start', 'finish', 'ready'
    ];
    
    if (commonPatterns.includes(wordLower)) {
      score += 5;
    }
    
    return { word, score };
  });
  
  // Filter out negative scores and sort by score
  const relevantWords = scoredWords
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(item => item.word);
  
  // If we don't have enough words, add some fallback words
  if (relevantWords.length < 5) {
    const fallbackWords = [
      'yes', 'no', 'please', 'thankyou', 'hello', 'goodbye', 'okay',
      'more', 'help', 'stop', 'start', 'finish', 'ready', 'sorry'
    ];
    
    const additionalWords = fallbackWords.filter(word => 
      !relevantWords.includes(word) && 
      words.includes(word) && 
      !excludedWords.includes(word)
    );
    
    relevantWords.push(...additionalWords.slice(0, 10 - relevantWords.length));
  }
  
  return relevantWords.slice(0, 10);
}



/**
 * Local embedding pipeline and cache for vector search
 * Used by Local LLM prediction to find relevant tiles via semantic search
 */
let __localEmbeddingPipeline = null;
let __labelList = wordsData?.tiles || [];
let __labelEmbeddingsCache = null; // Cache for label embeddings

/**
 * Local LLM pipeline for text generation
 * 
 * @type {Promise<Object>|null}
 * @description Cached text generation pipeline for local LLM-based prediction
 */
let __localLLMPipeline = null;

/**
 * Local Whisper transcription pipeline
 * 
 * @type {Promise<Object>|null}
 * @description Cached Whisper pipeline for speech-to-text transcription
 */
let __localWhisperPipeline = null;

/**
 * Get or create the local Whisper transcription pipeline
 * 
 * @function getLocalWhisperPipeline
 * @description Initializes and returns a Whisper model pipeline for local transcription
 * @returns {Promise<Object>} The Whisper pipeline instance
 * @async
 */
async function getLocalWhisperPipeline() {
  if (!__localWhisperPipeline) {
    // whisper-base.en is smaller (~74MB) and faster
    // For better accuracy but slower, use 'Xenova/whisper-small.en' (~244MB)
    __localWhisperPipeline = await pipeline(
      'automatic-speech-recognition',
      'Xenova/whisper-base.en'
    );
  }
  return __localWhisperPipeline;
}

/**
 * Convert WAV buffer to Float32Array for Whisper
 * 
 * @function wavToFloat32Array
 * @description Parses WAV file buffer and converts PCM data to normalized Float32Array
 * @param {Buffer} wavBuffer - The WAV file buffer (with header)
 * @returns {Float32Array} Normalized audio samples as Float32Array
 */
function wavToFloat32Array(wavBuffer) {
  // WAV header is 44 bytes
  // Skip header and get PCM data (16-bit signed integers, little-endian)
  const pcmData = wavBuffer.slice(44);
  const samples = new Float32Array(pcmData.length / 2);
  
  // Convert 16-bit PCM to normalized float32 (-1.0 to 1.0)
  let maxAmplitude = 0;
  
  for (let i = 0; i < samples.length; i++) {
    // Read 16-bit signed integer (little-endian)
    const int16 = pcmData.readInt16LE(i * 2);
    // Normalize to [-1.0, 1.0] range
    samples[i] = int16 / 32768.0;
    maxAmplitude = Math.max(maxAmplitude, Math.abs(samples[i]));
  }
  
  // Only warn if audio is likely to fail
  if (maxAmplitude < 0.01) {
    console.warn('WARNING: Audio appears to be silent or very quiet');
  }
  
  return samples;
}


/**
 * Transcribe audio using local Whisper model
 * 
 * @function transcribeAudioLocal
 * @description Transcribes audio data using the local Whisper model
 * @param {string} audioFilePath - Path to the WAV audio file
 * @returns {Promise<string>} The transcribed text
 * @async
 */
async function transcribeAudioLocal(audioFilePath) {
  try {
    const whisper = await getLocalWhisperPipeline();
    
    // Read the WAV file
    const wavBuffer = fs.readFileSync(audioFilePath);
    
    // Convert WAV to Float32Array (normalized audio samples)
    // This function also logs audio stats
    const audioData = wavToFloat32Array(wavBuffer);
    
    // Check if audio has sufficient content - need at least 1.5 seconds for good transcription
    if (audioData.length < 24000) { // Less than 1.5 seconds
      return '';
    }
    
    // Quick silence check - only check first and last 10% of samples for speed
    const sampleSize = Math.floor(audioData.length * 0.1);
    let maxAmplitude = 0;
    for (let i = 0; i < sampleSize; i++) {
      maxAmplitude = Math.max(maxAmplitude, Math.abs(audioData[i]));
      maxAmplitude = Math.max(maxAmplitude, Math.abs(audioData[audioData.length - 1 - i]));
    }
    
    // If first/last samples are silent, check middle section 
    if (maxAmplitude < 0.01) {
      const midStart = Math.floor(audioData.length * 0.4);
      const midEnd = Math.floor(audioData.length * 0.6);
      for (let i = midStart; i < midEnd; i += 100) {
        maxAmplitude = Math.max(maxAmplitude, Math.abs(audioData[i]));
      }
    }
    
    // Skip if completely silent (threshold set to 0.0002)
    if (maxAmplitude < 0.0002) {
      return '';
    }
    
    // Optimized Whisper call - minimal options for fastest processing
    let result;
    try {
      result = await whisper(audioData, {
        return_timestamps: false, // Skip timestamps for speed
        language: 'en', // Specify language to avoid detection step
      });
    } catch (error) {
      console.error('Whisper call failed:', error.message);
      throw error;
    }
    
    // Extract the transcribed text
    // @xenova/transformers Whisper returns: { text: string }
    let transcribedText = '';
    if (result && result.text !== undefined && result.text !== null) {
      transcribedText = String(result.text);
    } else if (result?.chunks && Array.isArray(result.chunks) && result.chunks.length > 0) {
      // If result has chunks, extract text from first chunk
      transcribedText = result.chunks[0].text || '';
    } else if (typeof result === 'string') {
      // Sometimes the result might be a string directly
      transcribedText = result;
    }
    
    return transcribedText.trim();
  } catch (error) {
    console.error('Local transcription error:', error);
    throw error;
  }
}

async function getLocalEmbeddingPipeline() {
  if (!__localEmbeddingPipeline) {
    __localEmbeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return __localEmbeddingPipeline;
}

function meanPoolAndNormalize(embeddings) {
  // Handle different output formats from @xenova/transformers
  let data;
  if (Array.isArray(embeddings)) {
    data = embeddings;
  } else if (embeddings?.data) {
    // If it's a Tensor-like object, extract the data
    data = Array.isArray(embeddings.data) ? embeddings.data : Array.from(embeddings.data);
  } else if (embeddings?.tolist) {
    // If it's a Tensor with tolist method
    data = embeddings.tolist();
  } else {
    // Try to convert to array
    data = Array.from(embeddings);
  }

  // Handle 2D array (tokens x dimensions) - need to mean pool
  if (Array.isArray(data[0])) {
    const tokens = data.length;
    const dim = data[0].length;
    const output = new Float32Array(dim);
    
    // Mean pooling: average across tokens
    for (let i = 0; i < tokens; i++) {
      const row = data[i];
      for (let d = 0; d < dim; d++) {
        output[d] += Array.isArray(row) ? row[d] : row;
      }
    }
    for (let d = 0; d < dim; d++) output[d] /= tokens;
    
    // L2 normalization
    let norm = 0;
    for (let d = 0; d < dim; d++) norm += output[d] * output[d];
    norm = Math.sqrt(norm) || 1;
    for (let d = 0; d < dim; d++) output[d] /= norm;
    
    return output;
  } else {
    // Already 1D array (sentence embedding)
    const dim = data.length;
    const output = new Float32Array(dim);
    for (let d = 0; d < dim; d++) {
      output[d] = data[d];
    }
    
    // L2 normalization
    let norm = 0;
    for (let d = 0; d < dim; d++) norm += output[d] * output[d];
    norm = Math.sqrt(norm) || 1;
    for (let d = 0; d < dim; d++) output[d] /= norm;
    
    return output;
  }
}

async function embedText(text) {
  const pipe = await getLocalEmbeddingPipeline();
  const result = await pipe(text);
  
  // @xenova/transformers returns embeddings in result.data as a Tensor
  // The format is typically: { data: Tensor } where Tensor has shape [num_tokens, hidden_size]
  let embeddingArray;
  
  try {
    // Extract tensor from result
    const tensor = result?.data || result;
    
    // @xenova/transformers v2.x: tensor has tolist() method that preserves 2D structure
    if (tensor && typeof tensor.tolist === 'function') {
      embeddingArray = tensor.tolist();
    }
    // If tensor.data exists and is array-like
    else if (tensor?.data) {
      // Check if it's already an array
      if (Array.isArray(tensor.data)) {
        embeddingArray = tensor.data;
      }
      // If it has tolist method
      else if (typeof tensor.data.tolist === 'function') {
        embeddingArray = tensor.data.tolist();
      }
      // Otherwise try to convert (but this might flatten)
      else {
        const flatData = Array.from(tensor.data);
        // Check shape to reconstruct 2D if needed
        // all-MiniLM-L6-v2 hidden_size is 384
        const hiddenSize = 384;
        if (flatData.length % hiddenSize === 0) {
          // Reconstruct 2D array
          const numTokens = flatData.length / hiddenSize;
          embeddingArray = [];
          for (let i = 0; i < numTokens; i++) {
            embeddingArray.push(flatData.slice(i * hiddenSize, (i + 1) * hiddenSize));
          }
        } else {
          embeddingArray = flatData;
        }
      }
    }
    // If result is already an array
    else if (Array.isArray(result)) {
      embeddingArray = result;
    }
    else {
      // Last resort: try to convert, but this will likely flatten
      const flatData = Array.from(tensor || result);
      const hiddenSize = 384;
      if (flatData.length % hiddenSize === 0 && flatData.length > hiddenSize) {
        // Reconstruct 2D array
        const numTokens = flatData.length / hiddenSize;
        embeddingArray = [];
        for (let i = 0; i < numTokens; i++) {
          embeddingArray.push(flatData.slice(i * hiddenSize, (i + 1) * hiddenSize));
        }
      } else {
        embeddingArray = flatData;
      }
    }
    
    
  } catch (error) {
    console.error('Error extracting embedding:', error);
    console.error('Result type:', typeof result, 'Result keys:', Object.keys(result || {}));
    if (result?.data) {
      console.error('Tensor type:', typeof result.data, 'Tensor keys:', Object.keys(result.data || {}));
    }
    throw error;
  }
  
  // Mean pool and normalize
  return meanPoolAndNormalize(embeddingArray);
}

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    console.warn(`Cosine similarity: mismatched dimensions. vecA: ${vecA?.length}, vecB: ${vecB?.length}`);
    return 0;
  }
  
  let dot = 0;
  let hasNaN = false;
  for (let i = 0; i < vecA.length; i++) {
    const val = vecA[i] * vecB[i];
    if (isNaN(val) || !isFinite(val)) {
      hasNaN = true;
      break;
    }
    dot += val;
  }
  
  if (hasNaN) {
    console.warn('NaN detected in cosine similarity calculation');
    return 0;
  }
  
  return dot; // Already normalized, so dot product = cosine similarity
}

function topNIndices(arr, n) {
  return arr
    .map((v, i) => [v, i])
    .sort((a, b) => b[0] - a[0])
    .slice(0, n)
    .map(([, i]) => i);
}

/**
 * Get or create the local LLM pipeline
 * 
 * @function getLocalLLMPipeline
 * @description Initializes and returns a text generation pipeline for local LLM
 * @returns {Promise<Object>} The text generation pipeline instance
 * @async
 */
async function getLocalLLMPipeline() {
  if (!__localLLMPipeline) {
    // GPT-2 small model - fast and lightweight for local inference
    // Alternative models: 'Xenova/gpt2', 'Xenova/distilgpt2' (even smaller)
    __localLLMPipeline = await pipeline(
      'text-generation',
      'Xenova/distilgpt2' // Smaller and faster than GPT-2
    );
  }
  return __localLLMPipeline;
}

/**
 * Local LLM-based prediction with vector search (offline)
 * Combines local vector search with local LLM for intelligent predictions
 * Can work with:
 *   - Only pressed tiles (contextLines empty)
 *   - Only transcript (pressedTiles empty)
 *   - Both pressed tiles and transcript
 * 
 * @function predictNextTilesLocalLLM
 * @param {string} contextLines - The conversation context (transcript), can be empty string
 * @param {string[]} pressedTiles - Array of tiles that were recently pressed, can be empty array
 * @param {number} topN - Number of tiles to return (default: 10)
 * @returns {Promise<string[]>} Array of predicted tile words
 * @async
 */
async function predictNextTilesLocalLLM(contextLines = '', pressedTiles = [], topN = 10) {
  const excluded = new Set([
    'he','she','it','they','we','you','him','her','his','hers','theirs','mine','yours','ours',
    'and','or','but','because','if','when','where','what','who','how','why',
    'at','by','for','from','in','of','on','to','with','up','down','over','under','through',
    'am','is','are','was','were','be','been','being','have','has','had','do','does','did',
    'will','would','could','should','may','might','can','must',
    'again','also','still','very','really','maybe','definitely','almost','even','just','only',
    'bottom','top','side','middle','front','back','left','right','center',
    'ai','animal','chair','bridge','bring','thing','stuff','place','way','time','day','night','year','month','week','hour','minute','second',
    'about','around','somewhere','anywhere','everywhere','nowhere','awesome','cool','nice','great','wonderful','amazing','fantastic'
  ]);

  const labels = __labelList.filter(w => !excluded.has(String(w).toLowerCase()));
  if (!labels.length) return [];

  // Ensure embeddings are cached
  if (!__labelEmbeddingsCache || __labelEmbeddingsCache.length !== labels.length) {
    console.log(`Computing embeddings for ${labels.length} labels (first time only)...`);
    __labelEmbeddingsCache = [];
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      const emb = await embedText(label);
      __labelEmbeddingsCache.push(emb);
    }
    console.log('Label embeddings cached successfully.');
  }

  // Create combined context from transcript and/or pressed tiles
  let combinedContext = '';
  if (contextLines.trim() && pressedTiles.length > 0) {
    combinedContext = `Recently pressed tiles: ${pressedTiles.join(', ')}. Transcript: "${contextLines}"`;
  } else if (contextLines.trim()) {
    combinedContext = `Transcript: "${contextLines}"`;
  } else if (pressedTiles.length > 0) {
    combinedContext = `Recently pressed tiles: ${pressedTiles.join(', ')}`;
  } else {
    // Fallback: use empty context (shouldn't happen due to validation, but handle gracefully)
    combinedContext = '';
  }

  // Embed the combined context for vector search
  const queryEmb = await embedText(combinedContext || 'next word');
  const sims = __labelEmbeddingsCache.map(e => cosineSimilarity(queryEmb, e));
  
  // Get a larger set of candidate words from vector search (top 50-80) for LLM to consider

  const topK = Math.min(60, labels.length);
  const topIndices = topNIndices(sims, topK);
  const candidateWords = topIndices.map(i => labels[i]);

  // Use local LLM to select best words based on available context
  try {
    const llm = await getLocalLLMPipeline();
    
    // Create prompt based on what context is available
    let prompt = '';
    if (contextLines.trim() && pressedTiles.length > 0) {
      prompt = `Recently pressed tiles: ${pressedTiles.join(', ')}
Transcript: "${contextLines}"

Based on the recently pressed tiles and transcript, select the ${topN} best next tiles from: ${candidateWords.join(', ')}

Return words only, one per line:
`;
    } else if (contextLines.trim()) {
      prompt = `Transcript: "${contextLines}"

Based on the transcript, select the ${topN} best next tiles from: ${candidateWords.join(', ')}

Return words only, one per line:
`;
    } else if (pressedTiles.length > 0) {
      prompt = `Recently pressed tiles: ${pressedTiles.join(', ')}

Based on the recently pressed tiles, select the ${topN} best next tiles from: ${candidateWords.join(', ')}

Return words only, one per line:
`;
    } else {
      // Fallback: just use candidate words
      prompt = `Select the ${topN} best next tiles from: ${candidateWords.join(', ')}

Return words only, one per line:
`;
    }

    // Generate text with the LLM - optimized for speed
    const result = await llm(prompt, {
      max_new_tokens: 40, // Enough for 10 words
      temperature: 0, // Greedy decoding 
      do_sample: false, // Greedy decoding is faster
      return_full_text: false, // Don't return the prompt
    });

    // Extract generated text
    let generatedText = '';
    if (result && Array.isArray(result) && result.length > 0) {
      generatedText = result[0].generated_text || '';
    } else if (result && result.generated_text) {
      generatedText = result.generated_text;
    } else if (typeof result === 'string') {
      generatedText = result;
    }

    // Parse the generated text to extract words
    const extractedWords = generatedText
      .split('\n')
      .map(line => line.trim())
      .filter(line => {
        if (!line) return false;
        if (line.match(/^\d+\./)) return false; // Remove numbered lines
        if (line.toLowerCase().includes('here are')) return false;
        if (line.toLowerCase().includes('most relevant')) return false;
        if (line.toLowerCase().includes('based on')) return false;
        if (line.toLowerCase().includes('conversation context')) return false;
        if (line.toLowerCase().includes('suggested words')) return false;
        if (line.toLowerCase().includes('available tiles')) return false;
        if (line.toLowerCase().includes('recently pressed')) return false;
        return true;
      })
      .map(line => {
        // Extract just the word from each line
        const word = line.replace(/^\d+\.\s*/, '').trim().toLowerCase();
        return word;
      })
      .filter(word => {
        // Basic filters
        if (word.length <= 1) return false;
        // Must be in the candidate words list
        if (!candidateWords.some(cw => cw.toLowerCase() === word)) return false;
        return true;
      })
      .slice(0, topN); // Limit to topN

    // If LLM didn't generate enough valid words, fall back to vector search results
    if (extractedWords.length < topN) {
      const vectorSearchResults = topIndices.slice(0, topN).map(i => labels[i]);
      // Combine and deduplicate
      const combined = [...extractedWords, ...vectorSearchResults.filter(w => !extractedWords.includes(w.toLowerCase()))];
      return combined.slice(0, topN);
    }

    return extractedWords;

  } catch (error) {
    console.error('Local LLM prediction error:', error);
    // Fallback to pure vector search if LLM fails
    const indices = topNIndices(sims, Math.min(topN, labels.length));
    return indices.map(i => labels[i]);
  }
}

app.post('/api/nextTilePredLocal', async (req, res) => {
  try {
    const { transcript, pressedTiles, topN = 10 } = req.body || {};
    
    // Validate pressedTiles if provided
    const validPressedTiles = Array.isArray(pressedTiles) 
      ? pressedTiles.filter(t => typeof t === 'string' && t.trim().length > 0)
      : [];

    // Process transcript if provided
    let contextLines = '';
    if (transcript && typeof transcript === 'string' && transcript.trim()) {
      const lines = transcript.trim().split('\n').filter(line => line.trim());
      contextLines = lines.slice(-2).join(' ');
    }

    // At least one of transcript or pressedTiles must be provided
    if (!contextLines.trim() && validPressedTiles.length === 0) {
      return res.status(400).json({ 
        error: 'Either transcript or pressedTiles (or both) must be provided', 
        status: 'error' 
      });
    }

    const predicted = await predictNextTilesLocalLLM(contextLines, validPressedTiles, topN);

    return res.json({ 
      predictedTiles: predicted, 
      status: 'success', 
      context: contextLines || '',
      pressedTiles: validPressedTiles
    });
  } catch (err) {
    console.error('nextTilePredLocal error:', err);
    return res.status(500).json({ error: 'Internal server error', status: 'error' });
  }
});

/**
 * Cleanup function to remove old temporary files
 * 
 * @function cleanupTempFiles
 * @description Removes temporary files older than 1 hour
 */
const cleanupTempFiles = () => {
  try {
    const files = fs.readdirSync(tempDir);
    const oneHourAgo = Date.now() - (60 * 60 * 1000); // 1 hour ago
    
    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime.getTime() < oneHourAgo) {
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.error('Error cleaning up temp files:', error);
  }
};


/**
 * Track active socket connections
 * 
 * @type {Set<string>}
 * @description Set of active socket IDs
 */
const activeConnections = new Set();

/**
 * Timeout for shutting down when all clients disconnect
 * 
 * @type {NodeJS.Timeout|null}
 * @description Timer that triggers shutdown if no clients reconnect within the timeout period
 */
let shutdownTimeout = null;

/**
 * Delay before shutting down after all clients disconnect (in milliseconds)
 * 
 * @type {number}
 * @description Time to wait for reconnection before assuming website is closed (5 seconds)
 */
// Allow idle time of 1 hour before shutting down
const SHUTDOWN_DELAY = 60 * 60 * 1000;

/**
 * Shutdown the frontend Next.js dev server
 * 
 * @function shutdownFrontend
 * @description Attempts to find and kill the Next.js dev server process running on port 3000
 */
const shutdownFrontend = () => {
  return new Promise((resolve) => {
    const platform = os.platform();
    let command;
    
    if (platform === 'win32') {
      // Windows: Find process using port 3000 and kill it
      command = 'netstat -ano | findstr :3000';
      exec(command, (error, stdout) => {
        if (error || !stdout) {
          console.log('Frontend process not found or already stopped');
          resolve();
          return;
        }
        
        // Extract PID from netstat output
        const lines = stdout.trim().split('\n');
        const pids = new Set();
        lines.forEach(line => {
          const match = line.match(/\s+(\d+)\s*$/);
          if (match) {
            pids.add(match[1]);
          }
        });
        
        // Kill all processes using port 3000
        pids.forEach(pid => {
          exec(`taskkill /PID ${pid} /F`, (killError) => {
            if (!killError) {
              console.log(`Frontend process ${pid} terminated`);
            }
          });
        });
        resolve();
      });
    } else {
      // Unix/Linux/Mac: Find and kill process using port 3000
      command = 'lsof -ti:3000';
      exec(command, (error, stdout) => {
        if (error || !stdout) {
          console.log('Frontend process not found or already stopped');
          resolve();
          return;
        }
        
        const pids = stdout.trim().split('\n').filter(pid => pid);
        pids.forEach(pid => {
          exec(`kill -9 ${pid}`, (killError) => {
            if (!killError) {
              console.log(`Frontend process ${pid} terminated`);
            }
          });
        });
        resolve();
      });
    }
  });
};

/**
 * Shutdown handler
 * 
 * @function shutdown
 * @description Handles server shutdown and cleanup, including frontend shutdown
 * @param {boolean} shutdownFrontendProcess - Whether to also shutdown the frontend process
 */
const shutdown = async (shutdownFrontendProcess = false) => {
  console.log('Shutting down server...');
  
  // Clear any pending shutdown timeout
  if (shutdownTimeout) {
    clearTimeout(shutdownTimeout);
    shutdownTimeout = null;
  }
  
  // Shutdown frontend if requested
  if (shutdownFrontendProcess) {
    console.log('Attempting to shutdown frontend...');
    await shutdownFrontend();
  }
  
  // Clean up all temp files on shutdown
  try {
    const files = fs.readdirSync(tempDir);
    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Error cleaning up temp files on shutdown:', error);
  }
  
  // Close all socket connections
  io.disconnectSockets(true);
  
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

// Set up cleanup interval (every 30 minutes)
setInterval(cleanupTempFiles, 10 * 60 * 1000);

// Handle shutdown - also shutdown frontend when server is explicitly terminated
process.on('SIGTERM', () => shutdown(true));
process.on('SIGINT', () => shutdown(true));



/**
 * Preload all models on server startup
 * 
 * @function preloadAllModels
 * @description Loads all ML models into memory before server starts accepting requests
 * @returns {Promise<void>}
 * @async
 */
async function preloadAllModels() {
  console.log('\n========================================');
  console.log('Preloading ML Models...');
  console.log('========================================\n');
  
  const startTime = Date.now();
  
  try {
    // Load all three models in parallel for faster startup
    const loadPromises = [
      (async () => {
        console.log('[1/3] Loading Whisper transcription model...');
        const modelStart = Date.now();
        await getLocalWhisperPipeline();
        const modelTime = ((Date.now() - modelStart) / 1000).toFixed(2);
        console.log(`[1/3] ✓ Whisper model loaded (${modelTime}s)`);
      })(),
      (async () => {
        console.log('[2/3] Loading DistilGPT2 LLM model...');
        const modelStart = Date.now();
        await getLocalLLMPipeline();
        const modelTime = ((Date.now() - modelStart) / 1000).toFixed(2);
        console.log(`[2/3] ✓ LLM model loaded (${modelTime}s)`);
      })(),
      (async () => {
        console.log('[3/3] Loading all-MiniLM-L6-v2 embeddings model...');
        const modelStart = Date.now();
        await getLocalEmbeddingPipeline();
        const modelTime = ((Date.now() - modelStart) / 1000).toFixed(2);
        console.log(`[3/3] ✓ Embeddings model loaded (${modelTime}s)`);
      })()
    ];
    
    // Wait for all models to load
    await Promise.all(loadPromises);
    
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n========================================');
    console.log(`All models preloaded successfully! (${totalTime}s total)`);
    console.log('========================================\n');
  } catch (error) {
    console.error('\n Error preloading models:', error);
    throw error;
  }
}

/**
 * Start the HTTP server
 * 
 * @function listen
 * @description Starts the server on port 5000 after preloading all models
 * 
 * @postcondition Server is running and listening for connections on port 5000
 */
async function startServer() {
  try {
    // Preload all models before starting server
    await preloadAllModels();
    
    // Start server after models are loaded
    const PORT = process.env.PORT || 5000; // Render injects PORT for web services
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log("Temp directory:", tempDir);
      console.log("[Configuration] Transcription Model: Local Whisper");
      console.log("[Configuration] Prediction Model: Local LLM with vector search");
      console.log("\n✓ Server ready to accept requests!\n");
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

/**
 * Socket.io connection event handler
 * 
 * @event connection
 * @description Handles new client connections and sets up audio processing for each client
 * 
 * @param {Socket} socket - The Socket.io socket object for the connected client
 */
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  
  // Clear any pending shutdown timeout since a client has connected
  if (shutdownTimeout) {
    clearTimeout(shutdownTimeout);
    shutdownTimeout = null;
    console.log("Shutdown timeout cleared - client reconnected");
  }
  
  activeConnections.add(socket.id);
  console.log(`Active connections: ${activeConnections.size}`);

  /**
   * FFmpeg child process
   * 
   * @type {ChildProcess}
   * @description Child process running FFmpeg for audio conversion
   */
  let ffmpeg;
  
  /**
   * Audio buffer for storing processed audio chunks
   * 
   * @type {Buffer}
   * @description Buffer that accumulates audio data from FFmpeg for processing
   */
  let audioBuffer = Buffer.alloc(0);
  
  /**
   * Flag to prevent concurrent audio processing
   * 
   * @type {boolean}
   * @description When true, indicates that audio processing is in progress
   */
  let isProcessing = false;
  
  /**
   * Counter for generating unique temporary filenames
   * 
   * @type {number}
   * @description Incremented for each processed audio chunk to ensure unique filenames
   */
  let fileCounter = 0;
  
  /**
   * Counter for tracking consecutive empty audio inputs
   * 
   * @type {number}
   * @description Tracks how many consecutive times the audio buffer was too small to process
   */
  let silenceCounter = 0;
  
  /**
   * Last transcribed text to prevent duplicates
   * 
   * @type {string}
   * @description Stores the last transcription to avoid sending duplicates
   */
  let lastTranscription = '';
  
  /**
   * Timestamp of last transcription sent
   * 
   * @type {number}
   * @description Tracks when we last sent a transcription to prevent rapid duplicates
   */
  let lastTranscriptionTime = 0;
  
  /**
   * Minimum time between sending similar transcriptions (in milliseconds)
   * 
   * @type {number}
   * @description Prevents sending the same or very similar text within this time window
   */
  const MIN_TIME_BETWEEN_SIMILAR = 2000; // 2 seconds
  
  /**
   * Flag to track if first transcription has been logged
   * 
   * @type {boolean}
   * @description Tracks if we've logged the first transcription message
   */
  let firstTranscriptionLogged = false;
  
  /**
   * Duration in milliseconds between audio processing attempts
   * 
   * @type {number}
   * @description Defines how frequently the audio buffer is processed
   */
  const CHUNK_DURATION = 2000; // 2 seconds - process more frequently to catch words sooner 

  /**
   * Initializes the FFmpeg process for audio conversion
   * 
   * @function initializeFFmpeg
   * @description Creates a new FFmpeg child process configured to convert WebM audio to raw PCM format
   * 
   * @precondition FFmpeg must be installed on the system
   * @postcondition ffmpeg variable contains a running FFmpeg process ready to receive audio data
   * 
   * @throws {Error} If FFmpeg is not installed or encounters an error during initialization
   */
  const initializeFFmpeg = () => {
    // If an existing ffmpeg instance is running, don't spawn another
    if (ffmpeg && !ffmpeg.killed && ffmpeg.exitCode === null) {
      return;
    }

    ffmpeg = spawn(ffmpegPath, [
      "-f", "webm", // input format : webm
      "-i", "pipe:0", // input goes into stdin
      "-ar", "16000",
      "-ac", "1",
      "-acodec", "pcm_s16le",
      "-f", "s16le", // output format raw PCM(what whisper takes in)
      "pipe:1", //writes output to stdout
    ]);

    /**
     * FFmpeg stdin error event handler
     * 
     * @event stdin.error
     * @description Handles errors when writing to FFmpeg stdin (like EPIPE)
     * 
     * @param {Error} err - The error object
     */
    ffmpeg.stdin.on("error", (err) => {
      // EPIPE and EOF errors are expected when FFmpeg closes, don't log them as errors
      if (err.code !== 'EPIPE' && err.code !== 'EOF') {
        console.error("FFmpeg stdin error:", err);
      }
      // FFmpeg closed, will be reinitialized on next audio chunk if needed
    });

    /**
     * FFmpeg stderr data event handler
     * 
     * @event stderr.data
     * @description Logs FFmpeg error output for debugging
     * 
     * @param {Buffer} data - The error data from FFmpeg
     */
    ffmpeg.stderr.on("data", (data) => {
      // FFmpeg stderr output (usually just info, not errors)
    });

    /**
     * FFmpeg close event handler
     * 
     * @event close
     * @description Logs when the FFmpeg process closes
     * 
     * @param {number} code - The exit code from the FFmpeg process
     */
    ffmpeg.on("close", (code) => {
      console.log("ffmpeg closed with code", code);
      // Auto-restart FFmpeg so the next incoming chunk has a live process
      // Listeners (stdin/stdout/error) are reattached on each init
      initializeFFmpeg();
    });

    /**
     * FFmpeg error event handler
     * 
     * @event error
     * @description Handles errors from the FFmpeg process
     * 
     * @param {Error} err - The error object
     */
    ffmpeg.on("error", (err) => {
      console.error("FFmpeg error:", err);
    });

    /**
     * FFmpeg stdout data event handler
     * 
     * @event stdout.data
     * @description Collects converted PCM audio data from FFmpeg
     * 
     * @param {Buffer} chunk - A chunk of PCM audio data
     * @postcondition Audio data is appended to the audioBuffer
     */
    ffmpeg.stdout.on("data", (chunk) => {
      audioBuffer = Buffer.concat([audioBuffer, chunk]);
      
      // Trigger immediate processing if we have enough audio and not already processing
      // This provides lower latency and better word capture
      const preferredChunkSize = 128000; // 4 seconds
      if (!isProcessing && audioBuffer.length >= preferredChunkSize) {
        // Process immediately instead of waiting for interval
        processAudio().catch(err => {
          console.error("Error in immediate audio processing:", err);
        });
      }
    });
  };
  
  // Initialize ffmpeg process 
  initializeFFmpeg();

  /**
   * Creates a WAV file from raw PCM data
   * 
   * @function createWavFile
   * @description Manually constructs a WAV file by adding a WAV header to PCM data
   * 
   * @param {Buffer} pcmData - The raw PCM audio data
   * @returns {Buffer} A complete WAV file as a buffer
   */
  const createWavFile = (pcmData) => {
    const wavHeader = Buffer.alloc(44);
    const dataSize = pcmData.length;
    
    // RIFF header
    wavHeader.write('RIFF', 0);
    wavHeader.writeUInt32LE(36 + dataSize, 4);
    wavHeader.write('WAVE', 8);
    
    // fmt chunk
    wavHeader.write('fmt ', 12);
    wavHeader.writeUInt32LE(16, 16); // chunk size
    wavHeader.writeUInt16LE(1, 20); // PCM format
    wavHeader.writeUInt16LE(1, 22); // mono
    wavHeader.writeUInt32LE(16000, 24); // sample rate
    wavHeader.writeUInt32LE(16000 * 2, 28); // byte rate
    wavHeader.writeUInt16LE(2, 32); // block align
    wavHeader.writeUInt16LE(16, 34); // bits per sample
    
    // data chunk
    wavHeader.write('data', 36);
    wavHeader.writeUInt32LE(dataSize, 40);
    
    return Buffer.concat([wavHeader, pcmData]);
  };

  /**
   * Calculate similarity between two strings using word overlap
   * 
   * @function calculateSimilarity
   * @description Calculates similarity percentage between two text strings
   * @param {string} text1 - First text
   * @param {string} text2 - Second text
   * @returns {number} Similarity score between 0 and 1
   */
  const calculateSimilarity = (text1, text2) => {
    if (!text1 || !text2) return 0;
    
    // Exact match check first (case-insensitive)
    if (text1.toLowerCase() === text2.toLowerCase()) return 1;
    
    // Normalize texts for comparison (remove punctuation, lowercase)
    const normalize = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const norm1 = normalize(text1);
    const norm2 = normalize(text2);
    
    // Word-based similarity
    const words1 = new Set(norm1.split(/\s+/).filter(w => w.length > 0));
    const words2 = new Set(norm2.split(/\s+/).filter(w => w.length > 0));
    
    if (words1.size === 0 && words2.size === 0) return 1;
    if (words1.size === 0 || words2.size === 0) return 0;
    
    let intersection = 0;
    for (const word of words1) {
      if (words2.has(word)) intersection++;
    }
    
    const union = words1.size + words2.size - intersection;
    return intersection / union;
  };

  /**
   * Cleans transcription text by removing unwanted markers
   * 
   * @function cleanTranscription
   * @description Removes all square bracket markers (e.g., [BLANK_AUDIO], [INAUDIBLE], [gunshot], [clears throat]) from transcription text
   * 
   * @param {string} text - The raw transcription text
   * @returns {string} Cleaned transcription text without any markers, only spoken words
   */
  const cleanTranscription = (text) => {
    if (!text || typeof text !== 'string') {
      return '';
    }
    
    // Remove all square bracket markers (e.g., [BLANK_AUDIO], [INAUDIBLE], [gunshot], [clears throat], etc.)
    // Remove standalone ] and ^ markers as they are not actual speech content
    let cleaned = text
      // Remove all text in square brackets with any dots/spaces around them
      .replace(/\s*\.*\s*\[[^\]]+\]\s*\.*\s*/gi, ' ')
      // Remove standalone ] characters (not part of brackets)
      .replace(/\]/g, '')
      // Remove ^ characters (used by Whisper to indicate unclear/missing speech)
      .replace(/\^+/g, '')
      // Remove excessive dots (2 or more consecutive dots)
      .replace(/\.{2,}/g, '')
      // Remove dots/spaces at the beginning or end of lines
      .replace(/^[\s\.]+|[\s\.]+$/gm, '')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      // Remove standalone dots with spaces
      .replace(/\s*\.\s*/g, ' ')
      // Final trim
      .trim();
    
    return cleaned;
  };

  /**
   * Processes audio data and sends it for transcription
   * 
   * @function processAudio
   * @description Takes a chunk of audio from the buffer, converts it to WAV, and transcribes it using local Whisper model
   * 
   * @precondition Sufficient audio data must be available in the buffer
   * @postcondition Transcription results are emitted to the client if successful
   * 
   * @throws {Error} If there are issues with file operations or the local Whisper model
   * @async
   */
  const processAudio = async () => {
    // Skip processing if already busy or audio buffer is too small
    // Need at least 1.5 seconds for better transcription quality
    const minAudioSize = 24000; // 1.5 seconds = 16000 samples/sec * 2 bytes/sample * 1.5 sec
    if (isProcessing || audioBuffer.length < minAudioSize) {
      silenceCounter++;
      // Only reset buffer if we've had many silent attempts AND buffer is getting very large
      if (silenceCounter > 20 && audioBuffer.length > 480000) { // > 15 seconds of audio
        // Reset buffer if too much silence to prevent memory buildup
        // But keep the last 2 seconds in case there's valid audio
        const keepSize = 64000; // Keep 2 seconds
        audioBuffer = audioBuffer.slice(-keepSize);
        silenceCounter = 0;
      }
      return;
    }
    // lock processing
    isProcessing = true;
    silenceCounter = 0;
    
    // Take a chunk of audio - larger chunks provide better context for Whisper
    // 4 seconds = 128000 bytes - better quality and more context for accurate transcription
    const preferredChunkSize = 128000; // 4 seconds = 16000 samples/sec * 2 bytes/sample * 4 sec
    const chunkSize = Math.min(audioBuffer.length, preferredChunkSize);
    
    // Overlap to catch words at boundaries - 1 second overlap helps ensure no words are missed
    const overlapSize = 32000; // 1 second overlap - ensures words spanning boundaries are captured
    const pcmChunk = audioBuffer.slice(0, chunkSize);
    
    // DON'T remove audio from buffer yet - wait until we know transcription succeeded
    // This ensures we don't lose audio if transcription fails
    
    // Generate a unique filename per chunk
    const filename = `temp_${socket.id}_${Date.now()}_${fileCounter++}.wav`;
    
    // try creating the wavefile
    try {
      const wavData = createWavFile(pcmChunk);
      const filePath = path.join(tempDir, filename);
      fs.writeFileSync(filePath, wavData);
      
      // Use local Whisper model for transcription
      let transcribedText = '';
      try {
        transcribedText = await transcribeAudioLocal(filePath);
        if (transcribedText && transcribedText.trim() && !firstTranscriptionLogged) {
          console.log('[Transcription] Using Local Whisper model');
          console.log('[Transcription] Success - Local Whisper');
          firstTranscriptionLogged = true;
        }
      } catch (transcriptionError) {
        console.error('[Transcription] Failed - Local Whisper:', transcriptionError.message);
        throw transcriptionError;
      }
      
      // Clean the transcription to remove unwanted markers
      if (transcribedText) {
        transcribedText = cleanTranscription(transcribedText);
      }
      
      // Only emit if transcription is different from last one 
      let shouldSendTranscription = false;
      let shouldRemoveAudio = false;
      
      if (transcribedText && transcribedText.trim()) {
        const normalizedText = transcribedText.trim().toLowerCase();
        const now = Date.now();
        const timeSinceLastTranscription = now - lastTranscriptionTime;
        
        // Check if we have a previous transcription to compare
        if (lastTranscription && lastTranscription.trim()) {
          const normalizedLast = lastTranscription.trim().toLowerCase();
          
          // Calculate similarity - if texts are too similar, it's likely a duplicate from overlap
          const similarity = calculateSimilarity(normalizedText, normalizedLast);
          
          // Stricter duplicate detection:
          // 1. Exact match (similarity = 1.0) - skip sending but still remove audio 
          // 2. Very similar (>95%) - skip unless enough time has passed
          // 3. Similar (>85%) - skip if sent recently (< 2 seconds)
          // 4. Different enough (<85%) - always send
          
          if (similarity >= 0.95) {
            // Very similar or exact match - skip unless it's been a while
            if (timeSinceLastTranscription < MIN_TIME_BETWEEN_SIMILAR * 2) {
              // Skip duplicate, but still remove audio since it was successfully processed
              shouldRemoveAudio = true;
            } else {
              shouldSendTranscription = true;
              shouldRemoveAudio = true;
            }
          } else if (similarity >= 0.85) {
            // Similar - only send if enough time has passed
            if (timeSinceLastTranscription < MIN_TIME_BETWEEN_SIMILAR) {
              // Skip recent similar, but still remove audio
              shouldRemoveAudio = true;
            } else {
              shouldSendTranscription = true;
              shouldRemoveAudio = true;
            }
          } else {
            // Different enough to send
            shouldSendTranscription = true;
            shouldRemoveAudio = true;
          }
        } else {
          // No previous transcription, always send
          shouldSendTranscription = true;
          shouldRemoveAudio = true;
        }
        
        // Send the transcription if needed
        if (shouldSendTranscription) {
          socket.emit("transcript", transcribedText);
          lastTranscription = transcribedText;
          lastTranscriptionTime = now;
        }
      } else {
        // Transcription returned empty - audio was processed but result was empty (silence or noise)
        // Still remove audio since it was successfully processed, just had no speech
        shouldRemoveAudio = true;
      }
      
      // Always remove audio from buffer AFTER processing (successful or empty result)
      // This ensures we process all audio sequentially without gaps
      if (shouldRemoveAudio) {
        const removeSize = chunkSize - overlapSize; // Keep exactly 1 second of overlap
        audioBuffer = audioBuffer.slice(removeSize);
      }
      // error handling
    } catch (err) {
      console.error("Transcription error:", err);
      // On error, don't remove audio from buffer - keep it to retry
      // Only remove a small amount to prevent infinite retries on bad audio
      if (err.status === 400 || err.message?.includes('format')) {
        console.error("Bad request - audio format issue");
        // If there's a format issue, remove a small chunk and try to continue
        // But keep most of the audio in case it's recoverable
        const smallRemove = 16000; // Remove only 0.5 seconds
        if (audioBuffer.length > smallRemove) {
          audioBuffer = audioBuffer.slice(smallRemove);
        }
      }
      // For other errors, keep the audio in buffer to retry on next interval
    } finally {
      // Clean up temp file
      try {
        //delete temp file
        const filePath = path.join(tempDir, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupErr) {
        console.error("Error cleaning up file:", cleanupErr);
      }
      //reset isProcessing
      isProcessing = false;
    }
  };

  /**
   * Interval for regular audio processing
   * 
   * @type {NodeJS.Timeout}
   * @description Timer that triggers audio processing at regular intervals
   */
  const interval = setInterval(processAudio, CHUNK_DURATION);

  /**
   * Audio chunk event handler
   * 
   * @event audio-chunk
   * @description Receives audio chunks from the client and passes them to FFmpeg
   * 
   * @param {ArrayBuffer} data - The audio data chunk from the client
   * @throws {Error} If there are issues writing to the FFmpeg process
   */
  socket.on("audio-chunk", (data) => {
    try {
      // Ensure ffmpeg is alive before writing
      if (!ffmpeg || ffmpeg.killed || ffmpeg.exitCode !== null) {
        initializeFFmpeg();
      }
      if (ffmpeg && ffmpeg.stdin && ffmpeg.stdin.writable) {
        ffmpeg.stdin.write(Buffer.from(data), (err) => {
          // Handle write errors (EPIPE and EOF are expected when FFmpeg closes)
          if (err && err.code !== 'EPIPE' && err.code !== 'EOF') {
            console.error("stdin write error:", err);
            // Reinitialize FFmpeg if there's a non-EPIPE/EOF error
            if (ffmpeg) {
              try {
                ffmpeg.kill();
              } catch (killErr) {
                // Ignore errors when killing
              }
            }
            initializeFFmpeg();
          }
        });
      }
    } catch (err) {
      // EPIPE and EOF errors are expected when FFmpeg closes, don't log them
      if (err.code !== 'EPIPE' && err.code !== 'EOF') {
        console.error("stdin write error:", err);
        // Reinitialize FFmpeg if there's a non-EPIPE/EOF error
        if (ffmpeg) {
          try {
            ffmpeg.kill();
          } catch (killErr) {
            // Ignore errors when killing
          }
        }
        initializeFFmpeg();
      }
    }
  });

  /**
   * Socket disconnect event handler
   * 
   * @event disconnect
   * @description Cleans up resources when a client disconnects
   * 
   * @postcondition FFmpeg process is terminated, interval is cleared, and buffer is reset
   */
  socket.on("disconnect", async () => {
    console.log("Client disconnected:", socket.id);
    activeConnections.delete(socket.id);
    console.log(`Active connections: ${activeConnections.size}`);
    
    clearInterval(interval);
    
    // Process any remaining audio before cleaning up to capture last words
    if (audioBuffer.length >= 24000 && !isProcessing) { // At least 1.5 seconds
      try {
        await processAudio();
      } catch (err) {
        console.error("Error processing final audio on disconnect:", err);
      }
    }
    
    if (ffmpeg) {
      // Safely close FFmpeg stdin and kill process
      try {
        if (ffmpeg.stdin && !ffmpeg.stdin.destroyed && ffmpeg.stdin.writable) {
          ffmpeg.stdin.end();
        }
      } catch (err) {
        // EPIPE errors are expected when stdin is already closed
        if (err.code !== 'EPIPE') {
          console.error("Error closing FFmpeg stdin:", err);
        }
      }
      
      try {
        if (!ffmpeg.killed) {
          ffmpeg.kill();
        }
      } catch (err) {
        // Ignore errors when killing (process might already be dead)
      }
    }
    audioBuffer = Buffer.alloc(0);
    
    // If this was the last connection, start a shutdown timer
    // If a client reconnects (page refresh), the timer will be cleared
    if (activeConnections.size === 0) {
      console.log('All clients disconnected. Starting shutdown timer...');
      console.log(`Will shutdown in ${SHUTDOWN_DELAY / 1000} seconds if no clients reconnect.`);
      
      // Clear any existing timeout
      if (shutdownTimeout) {
        clearTimeout(shutdownTimeout);
      }
      
      // Set a new timeout to shutdown after delay
      shutdownTimeout = setTimeout(() => {
        console.log('No clients reconnected. Shutting down backend and frontend...');
        shutdown(true);
      }, SHUTDOWN_DELAY);
    }
  });
});
