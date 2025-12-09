---
sidebar_position: 2
---

<img width="1919" height="647" alt="Screenshot_2025-12-08_130316" src="https://github.com/user-attachments/assets/ed8992ff-14e7-4f5f-a2da-d8444277b11b" />


# System Block Diagram










**Figure 1.** High level design of Highlighting project


# Description
User speech is audio input to the AAC Board. Audio recording is transcribed by Whisper AI and saved into transcription which will then be sent back to the AAC board and sent to an intelligent contextual model which will analyze possible suggestions to answer audio input based on similarity scores. Analyzed scores will be sent to backend database and will change opacity of tiles on AAC board based on how well answer choices fit the audio input.


