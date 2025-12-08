---
sidebar_position: 2
---
<img width="1901" height="1186" alt="SBD" src="https://github.com/user-attachments/assets/04475812-f8ab-4e42-9b0b-7a32422ecfc1" />


# System Block Diagram


# System Block Diagram










**Figure 1.** High level design of Highlighting project


# Description
User speech is audio input to the AAC Board. Audio recording is transcribed by Whisper AI and saved into transcription which will then be sent back to the AAC board and sent to an intelligent contextual model which will analyze possible suggestions to answer audio input based on similarity scores. Analyzed scores will be sent to backend database and will change opacity of tiles on AAC board based on how well answer choices fit the audio input.


