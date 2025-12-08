---
sidebar_position: 1
---

# System Overview

## Project Abstract
This project focuses on enhancing an existing Augmentative and Alternative Communication (AAC) application by integrating intelligent text prediction and contextual highlighting. The extension introduces a system that captures audio input through a microphone, processes it using an intelligent contextual model, and suggests relevant words based on the ongoing conversation. Suggested words are visually emphasized through highlighting techniques to help direct the user’s attention and improve communication efficiency.

The goal of this application is to improve the efficiency and communication for AAC users by reducing the time required to create responses during conversations by offering them suggested words based on contextual analysis.

## Conceptual Design
This project builds upon a previous capstone project, SmartSpeech, which developed an AAC board for the use of non-verbal communication. This project will extend SmartSpeech and add the functionality by integrating audio input and a contextual highlighting system that will emphasize suggested word options based on the conversation.

This extension will be built with TypeScript and Python to maintain compatibility with SmartSpeech's code. Whisper AI, an automatic speech recognition (ASR) model will be incorporated to take care of speech-to-text conversion. This text will be analyzed by an intelligent contextual model and suggest words based on relevant words. Words with higher suggestion scores will have tiles that are made darker to clarify the relevance of the word to the context.

## Background
AAC devices play a critical role in supporting communication for individuals who are non-verbal, including many children with autism. However, traditional AAC systems can be slow, requiring users to manually navigate and select words. This project aims to address this challenge by incorporating context-aware methods such as speech recognition and visual highlighting to improve communication speed and user experience.
