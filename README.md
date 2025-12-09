<div align="center">

# Highlighting
[![Report Issue on Jira](https://img.shields.io/badge/Report%20Issues-Jira-0052CC?style=flat&logo=jira-software)](https://temple-cis-projects-in-cs.atlassian.net/jira/software/c/projects/DT/issues)
[![Deploy Docs](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml/badge.svg)](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml)
[![Documentation Website Link](https://img.shields.io/badge/-Documentation%20Website-brightgreen)](https://capstone-projects-2025-fall.github.io/project-002-highlighting/)


</div>

## Keywords

002, real-time, AAC, highlighting, context
## Project Abstract

This project aims to enhance an existing Augmentative and Alternative Communication (AAC) application with the integration of intelligent text prediction. The extension will use methods of highlighting to direct the attention of the user of the AAC device. This includes primarily the use of different levels of opacity to draw more attention to specific words that are relevant to the context of conversation. The extension will capture audio input through a microphone and use an intelligent contextual model to analyze and suggest words.

The goal of this application is to improve the efficiency and communication for AAC users by reducing the time required to create responses during conversations by offering them suggested words based on contextual analysis.
## Conceptual Design

This project builds upon a previous capstone project, SmartSpeech, which developed an AAC board for the use of non-verbal communication. This project will extend SmartSpeech and add the functionality by integrating audio input and a contextual highlighting system that will emphasize suggested word options based on the conversation.

This extension will be built with TypeScript and Python to maintain compatibility with SmartSpeech's code. Whisper AI, an automatic speech recognition (ASR) model will be incorporated to take care of speech-to-text conversion. This text will be analyzed by an intelligent contextual model and suggest words based on relevant words. Words with higher suggestion scores will have tiles that are made darker to clarify the relevance of the word to the context.

## Background
The use of AAC devices is imperative for non-verbal communication and autism spectrum children. This project aims to improve the time efficiency of communication that most AAC devices lack in. This project hopes to solve this problem of conversations taking longer than expected by using context awareness methods like speech recognition and highlighting.
## How to Run:

1. Clone this repo.
2. Create a .env file and add in:
```shell 
OPENAI_API_KEY= (yourkey)
```

3. Run the following commands:
   
```shell
cd backend 
npm install
node server.mjs & (FOR Ubunut / MAC OS)
start node server.mjs (FOR Powershell)
```

4. Go back to root folder
```shell
cd..
```
5. Run the following commands:
```shell
cd frontend
npm i
npm run dev
```

6. Go to http://localhost:3000 to view the website

**Deployed version**

1. Go to https://aachighlighting.vercel.app/

## Required Resources

* What users will need:

    * Ipad or tablet device (Needs microphone for active listening)
    * Internet access

* What the project needs:

    * Github and git commands
    * Strong enough machine to run AAC board and its features locally or through deployed version on Vercel
    * Whisper AI for speech recognition
    * Typescript
    * Python
    * Docusaurus for convenient documentation
    * Vercel to host the AAC board

## Collaborators

<div align="center">


[Joo Cha](https://github.com/tuh14497) •
[Jude Piacentino](https://github.com/JudeP2) •
[Hemanth Kamana](https://github.com/123GetBuckets) •
[Kevin Hitch](https://github.com/tun72869) •
[Sley Chery](https://github.com/SleyChery) •
[Anim Ohene](https://github.com/tun66280) •

</div>

