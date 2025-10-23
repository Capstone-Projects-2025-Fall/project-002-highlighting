---
sidebar_position: 1
---

# System Overview

## Project Abstract
This project aims to enhance an existing Augmentative and Alternative Communication (AAC) application with the integration of intelligent text prediction. The extension will use methods of highlighting to direct the attention of the user of the AAC device. This includes primarily the use of different levels of opacity to draw more attention to specific words that are relevant to the context of conversation. The extension will capture audio input through a microphone and use an intelligent contextual model to analyze and suggest words.

The goal of this application is to improve the efficiency and communication for AAC users by reducing the time required to create responses during conversations by offering them suggested words based on contextual analysis.

## Conceptual Design
This project builds upon a previous capstone project, SmartSpeech, which developed an AAC board for the use of non-verbal communication. This project will extend SmartSpeech and add the functionality by integrating audio input and a contextual highlighting system that will emphasize suggested word options based on the conversation.

This extension will be built with TypeScript and Python to maintain compatibility with SmartSpeech's code. Whisper AI, an automatic speech recognition (ASR) model will be incorporated to take care of speech-to-text conversion. This text will be analyzed by an intelligent contextual model and suggest words based on relevant words. Words with higher suggestion scores will have tiles that are made darker to clarify the relevance of the word to the context.

## Background
The use of AAC devices is imperative for non-verbal communication and autism spectrum children. This project aims to improve the time efficiency of communication that most AAC devices lack in. This project hopes to solve this problem of conversations taking longer than expected by using context awareness methods like speech recognition and highlighting.