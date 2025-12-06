---
sidebar_position: 2
---
# Integration tests


## Use Case 1: AAC Board for Communication

- Download mock app and initialize

- Opening the app and connect to Wi-Fi

- Provide a mocked question input

- Select a response using the AAC Board

- Verify that the response is played back through audio


## Use Case 2: AAC Board Listens to Its Environment 

- Open the app

- Give access to a mocked microphone

- Simulate speech input through the microphone

- Verify that the input is captured into file and transformed with context prediction

- Verify if suggestions are compatible


## Use Case 4: AAC Board Keeps Pictures in the Same Location 

- Open the app and enable the microphone

- Simulate a conversation input and highlight answers

- Select an answer and play it out loud

- Simulate a new conversation input

- Verify that all highlighted and non-highlighted words remain in the same location


## Use Case 5: Predicting Answers – Suggest Relevant Responses

- Provide a mocked question input

- Simulate audio-to-text conversion using a mocked speech-to-text module

- Display suggested options for sentence formation

- Verify that relevant categories are highlighted for selection


## Use Case 6 - Use context to highlight suggestions
- Provide first tile input: “I” with mock input
- Expected words after should be verbs such as need or want
- After a verb the expected word after will be a noun such as food or toy

## Use Case 7 - Contextualized contact based predicting
- Use mock contact such as mom or friend
- Expected words for each contact must be similar to previous conversations had (if food was talked about recently with mom, the contact conversation history should reflect the tiles that are highlighted)

## Use Case 8 - Toggling microphone when not in a conversation
- Test that microphone permissions are asked when app is launched
- If user denies permissions, expect that microphone is turned off
- If user accepts permissions, expect that microphone is on

## Use Case 9 - Highlighting specific categories with context from question
- Use mock input such as “Do you want to play outside” 
- Expected results to be highlighted should be “yes, no, or maybe”