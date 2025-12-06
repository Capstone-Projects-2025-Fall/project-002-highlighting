---
sidebar_position: 2
---

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

