/**
 * Audio Transcription Server
 * 
 * @module server
 * @description A Node.js server that handles real-time audio transcription using Socket.io and OpenAI's Whisper API.
 * The server receives audio chunks from clients, processes them using FFmpeg, and sends them to OpenAI for transcription.
 */

import express from "express";
import http from "http";
import { Server } from "socket.io";
import { spawn } from "child_process";
import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// loads variable from .env file into process.env
dotenv.config();
import { File } from "node:buffer";
globalThis.File = File;

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
 * Configure Express to serve static files
 * 
 * @description Sets up middleware to serve static files from the current directory
 */
app.use(express.static(__dirname));

/**
 * OpenAI API client
 * 
 * @type {OpenAI}
 * @description Initialized OpenAI client with API key from environment variables
 * @throws {Error} If OPENAI_API_KEY is not defined in environment variables
 */
if (!process.env.OPENAI_API_KEY) {
  console.error(" Missing OPENAI_API_KEY in environment");
  process.exit(1);
}
console.log("API key loaded? Yes");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Start the HTTP server
 * 
 * @function listen
 * @description Starts the server on port 5000
 * 
 * @postcondition Server is running and listening for connections on port 5000
 */
server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

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
   * Duration in milliseconds between audio processing attempts
   * 
   * @type {number}
   * @description Defines how frequently the audio buffer is processed (4 seconds)
   */
  const CHUNK_DURATION = 4000; 

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
    ffmpeg = spawn("ffmpeg", [
      "-f", "webm", // input format : webm
      "-i", "pipe:0", // input goes into stdin
      "-ar", "16000",
      "-ac", "1",
      "-acodec", "pcm_s16le",
      "-f", "s16le", // output format raw PCM(what whisper takes in)
      "pipe:1", //writes output to stdout
    ]);

    /**
     * FFmpeg stderr data event handler
     * 
     * @event stderr.data
     * @description Logs FFmpeg error output for debugging
     * 
     * @param {Buffer} data - The error data from FFmpeg
     */
    ffmpeg.stderr.on("data", (data) => {
      console.log("ffmpeg:", data.toString());
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
  };
  
  // Initialize ffmpeg process 
  initializeFFmpeg();

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
  });

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
   * Processes audio data and sends it for transcription
   * 
   * @function processAudio
   * @description Takes a chunk of audio from the buffer, converts it to WAV, and sends it to OpenAI for transcription
   * 
   * @precondition Sufficient audio data must be available in the buffer
   * @postcondition Transcription results are emitted to the client if successful
   * 
   * @throws {Error} If there are issues with file operations or the OpenAI API
   * @async
   */
  const processAudio = async () => {
    // Skip processing if already busy or audio buffer is too small
    if (isProcessing || audioBuffer.length < 32000) { // Need at least 1 second of audio
      silenceCounter++;
      if (silenceCounter > 3) {
        // Reset buffer if too much silence to prevent memory buildup
        audioBuffer = Buffer.alloc(0);
        silenceCounter = 0;
      }
      return;
    }
    // lock processing
    isProcessing = true;
    silenceCounter = 0;
    
    // Take a chunk of audio (4 seconds worth = 16000 samples/sec * 2 bytes/sample * 4 sec = 128000 bytes)
    const chunkSize = Math.min(audioBuffer.length, 128000);
    // new buffer that crops referenced buffer(audio buffer) to only 4 seconds of audio
    const pcmChunk = audioBuffer.slice(0, chunkSize);
    
    // Keep the remaining audio for next chunk
    audioBuffer = audioBuffer.slice(chunkSize);
    
    // Generate a unique filename per chunk
    const filename = `temp_${socket.id}_${Date.now()}_${fileCounter++}.wav`;
    
    // try creating the wavefile
    try {
      const wavData = createWavFile(pcmChunk);
      fs.writeFileSync(filename, wavData);
      console.log(`Saved ${wavData.length} bytes → ${filename}`);
      // call whisper ai 
      const transcription = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: fs.createReadStream(filename), // upload the wav file via stream
        language: "en",
        response_format: "json"
      });
      
      console.log("Transcript:", transcription.text);
      socket.emit("transcript", transcription.text);
      // error handling
    } catch (err) {
      console.error("Transcription error:", err);
      if (err.status === 400) {
        console.error("Bad request - audio format issue");
        // If there's a format issue, try with a different approach
        if (audioBuffer.length > 128000) {
          // If we have enough data, try skipping the problematic chunk
          audioBuffer = audioBuffer.slice(128000);
        }
      }
    } finally {
      // Clean up temp file
      try {
        //delete temp file
        fs.unlinkSync(filename);
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
      if (ffmpeg && ffmpeg.stdin.writable) {
        ffmpeg.stdin.write(Buffer.from(data));
      }
    } catch (err) {
      console.error("stdin write error:", err);
      // Reinitialize FFmpeg if there's an error
      if (ffmpeg) {
        ffmpeg.kill();
      }
      initializeFFmpeg();
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
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    clearInterval(interval);
    if (ffmpeg) {
      ffmpeg.stdin.end();
      ffmpeg.kill();
    }
    audioBuffer = Buffer.alloc(0);
  });
});