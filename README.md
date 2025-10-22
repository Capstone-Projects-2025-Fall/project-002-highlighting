<div align="center">

# Highlighting
[![Report Issue on Jira](https://img.shields.io/badge/Report%20Issues-Jira-0052CC?style=flat&logo=jira-software)](https://temple-cis-projects-in-cs.atlassian.net/jira/software/c/projects/DT/issues)
[![Deploy Docs](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml/badge.svg)](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml)
[![Documentation Website Link](https://img.shields.io/badge/-Documentation%20Website-brightgreen)](https://capstone-projects-2025-fall.github.io/project-002-highlighting/)


</div>

## Keywords

Section #, as well as any words that quickly give your peers insights into the application like programming language, development platform, type of application, etc.

## Project Abstract

This document proposes an application that aims to replicate the intelligent text prediction found within smartphones into an AAC device. The application will use methods of highlighting to direct the attention of the user of the AAC device. This includes primarily the use of different levels of opacity to draw more attention to specific words that are relevant to the context of conversation. The application will allow the user to use the device's microphone to listen to conversations and highlight relevant words to choose from that best fit the context.

The goal of this application is to give the user a more efficient time to engage in conversation with others using an AAC device, while not limiting or overloading them with word options to choose from.

## Conceptual Design

The application will be built upon a previous capstone project that made an AAC board, Smartspeech will provide the basis for this project for us to build on it to incorporate the highlighting portion into it. The application will mainly incorporate Typescript and Python for the coding languages as the board was made primarily with them.

For the speech recognition to apply the highlighting to specific words, we will be using Whisper AI which is an automatic speech recognition system model. The frontend will be using Vercel to host on a browser for easy and convenient access to the board and its highlighting features.

## Background

The use of AAC devices is imperative for non-verbal communication and autism spectrum children. This application aims to improve the time efficiency of communication this way as in most AAC devices now still are lacking in how fast conversations are expected to be. The project hopes to solve this problem of conversations taking longer than expected by using context awareness methods like speech recognition and highlighting.

## How to Run:

1. Clone this repo.
2. CD into smartspeech/backend and create a .env file 
3. In the .env file add in : OPENAI_API_KEY = yourownkey
4. Run the following commands in smartspeech/backend:
```shell 
npm install
node server.mjs & (FOR Ubunut / MAC OS)
start node server.mjs (FOR Powershell)
```

5. Run the following commands in smartspeech/frontend:
```shell
npm i
npm run dev
```

6. Go to http://localhost:3000 to view the website


## Required Resources

* What users will need:

    * Ipad or tablet device (Needs microphone for active listening)
    * Internet access

* What the project needs:

    * Github and git commands
    * Strong enough machine to run AAC board and its features locally
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

</div>

