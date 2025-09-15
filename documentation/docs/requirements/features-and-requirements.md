---
sidebar_position: 4
---

# Features and Requirements

## Functional Requirements

- The system must be organized in the fitzgerald key organization -- color coding system to represent different grammatical categories and parts of speech
    - verbs are highlighted in green
    - pronouns are highlighted in yellow
    - nouns are highlighted in orange

- The device must incorporate a next word prediction mechanism when typing through the keyboard
    - [INFO]AAC board apps utilize word tiles (tiles that contain  words and their associated picture representation). 
    - When utilizing the keyboard functionality, word tiles must be predicted based on the context of the previous words typed

- The system supports speech recognition 

- ([INFO]In congruence with use case 2)The framework allows speech to be used as a conversational context and subsequently changes the graphic opacity of the colored word tile categories (pronouns, nouns, verbs, questions, special categories, and etc) 

- ([INFO]In congruence with use case 1 and 5) On speaking to the device, a temporary custom board interface is created, and is dynamically populated with appropriate word tiles relating to the conversational context

- The environment is required to have have a microphone on/off toggle feature to respectively enable or disable the systems speech recogntion capability

## Nonfunctional Requirements
- Aid users in using the AAC board by drawing attention to singular or groups of words
    - Use a variety of available information as context 
        - Previous words selected 
        - Speech detection so that predictions can be made based on conversation directed at the user before the user types.
- Word tiles must stay in the same place as to not interfere with the users muscle memory
- Word tiles can be grouped by topic so that specific words can be easily found.
    - These topics or groups should be included in the attention drawing feature. 
