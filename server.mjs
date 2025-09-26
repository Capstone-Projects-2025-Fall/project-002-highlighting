import express from "express";
import http from "http";
import { Server } from "socket.io";
import { spawn } from "child_process";
import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
import { File } from "node:buffer";
globalThis.File = File;

// init
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve static files
app.use(express.static(__dirname));

// main route -> send app.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "app.html"));
});

if (!process.env.OPENAI_API_KEY) {
  console.error(" Missing OPENAI_API_KEY in environment");
  process.exit(1);
}
console.log("API key loaded? Yes");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

// -----------------------------
// socket connection
// -----------------------------
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  let ffmpeg;
  let audioBuffer = Buffer.alloc(0);
  let isProcessing = false;
  let fileCounter = 0;
  let silenceCounter = 0;
  const CHUNK_DURATION = 4000; // Process every 4 seconds

  const initializeFFmpeg = () => {
    ffmpeg = spawn("ffmpeg", [
      "-f", "webm",
      "-i", "pipe:0",
      "-ar", "16000",
      "-ac", "1",
      "-acodec", "pcm_s16le",
      "-f", "s16le",
      "pipe:1",
    ]);

    ffmpeg.stderr.on("data", (data) => {
      console.log("ffmpeg:", data.toString());
    });

    ffmpeg.on("close", (code) => {
      console.log("ffmpeg closed with code", code);
    });

    ffmpeg.on("error", (err) => {
      console.error("FFmpeg error:", err);
    });
  };

  initializeFFmpeg();

  // Collect raw PCM data instead of WAV data
  ffmpeg.stdout.on("data", (chunk) => {
    audioBuffer = Buffer.concat([audioBuffer, chunk]);
  });

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

  const processAudio = async () => {
    if (isProcessing || audioBuffer.length < 32000) { // Need at least 1 second of audio
      silenceCounter++;
      if (silenceCounter > 3) {
        // Reset buffer if too much silence to prevent memory buildup
        audioBuffer = Buffer.alloc(0);
        silenceCounter = 0;
      }
      return;
    }
    
    isProcessing = true;
    silenceCounter = 0;
    
    // Take a chunk of audio (4 seconds worth = 16000 samples/sec * 2 bytes/sample * 4 sec = 128000 bytes)
    const chunkSize = Math.min(audioBuffer.length, 128000);
    const pcmChunk = audioBuffer.slice(0, chunkSize);
    
    // Keep the remaining audio for next chunk
    audioBuffer = audioBuffer.slice(chunkSize);
    
    const filename = `temp_${socket.id}_${Date.now()}_${fileCounter++}.wav`;
    
    try {
      const wavData = createWavFile(pcmChunk);
      fs.writeFileSync(filename, wavData);
      console.log(`Saved ${wavData.length} bytes → ${filename}`);

      const transcription = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: fs.createReadStream(filename),
        language: "en",
        response_format: "json"
      });
      
      console.log("Transcript:", transcription.text);
      socket.emit("transcript", transcription.text);
      
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
        fs.unlinkSync(filename);
      } catch (cleanupErr) {
        console.error("Error cleaning up file:", cleanupErr);
      }
      isProcessing = false;
    }
  };

  // Process audio every 4 seconds
  const interval = setInterval(processAudio, CHUNK_DURATION);

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