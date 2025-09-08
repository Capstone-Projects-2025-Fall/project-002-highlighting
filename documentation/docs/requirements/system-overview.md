---
sidebar_position: 1
---

# System Overview

## Project Abstract
This document proposes an application that aims to replicate the intelligent text prediction found within smartphones into an AAC device. The application will use methods of highlighting to direct the attention of the user of the AAC device. This includes primarily the use of different levels of opacity to draw more attention to specific words that are relevant to the context of conversation. The application will allow the user to use the device's microphone to listen to conversations and highlight relevant words to choose from that best fit the context.

The goal of this application is to give the user a more efficient time to engage in conversation with others using an AAC device, while not limiting or overloading them with word options to choose from.

## Conceptual Design
The application will be built upon a previous capstone project that made an AAC board, Smartspeech will provide the basis for this project for us to build on it to incorporate the highlighting portion into it. The application will mainly incorporate Typescript and Python for the coding languages as the board was made primarily with them. 

For the speech recognition to apply the highlighting to specific words, we will be using Whisper AI which is an automatic speech recognition system model. The frontend will be using Vercel to host on a browser for easy and convenient access to the board and its highlighting features.



## Background
The use of AAC devices is imperative for non-verbal communication and autism spectrum children. This application aims to improve the time efficiency of communication this way as in most AAC devices now still are lacking in how fast conversations are expected to be. The project hopes to solve this problem of conversations taking longer than expected by using context awareness methods like speech recognition and highlighting.