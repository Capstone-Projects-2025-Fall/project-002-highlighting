---
sidebar_position: 2
---

<img width="1919" height="647" alt="Screenshot_2025-12-08_130316" src="https://github.com/user-attachments/assets/ed8992ff-14e7-4f5f-a2da-d8444277b11b" />


# System Block Diagram










**Figure 1.** High level design of Highlighting project


# Description  
The frontend consists of a web-based interface that captures user audio and displays AAC tiles. Audio is streamed to the backend through a WebSocket connection, while tile prediction requests are sent via REST.  

The backend includes two main services. The Audio Transcription Service converts audio with FFmpeg and produces transcripts using a local Whisper model. The Prediction Service processes transcripts by generating embeddings, comparing them to cached tile vectors, and using a local LLM to refine the top predicted tiles. These predictions are then returned to the frontend for highlighting.  

Optional auxiliary systems, such as Supabase and FastAPI, support logging, analytics, and utility functions.


