---
sidebar_position: 5
---

# Use-case descriptions

## Use Case 1 - AAC Board for communication
<i>As a user with a speech disorder, it is important for me to be able to communcate via a vritual interface easily.  </i>
1. The user will download the app and all its requirements
2. The user opens the application and connects via wifi
3. The user after hearing a question will select a response
4. After the response if formed he will play it back out loud

## Use Case 2 - AAC Board listens to its environment
<i>As a user, it is important that that the AAC device can listen to its environment and come up with responses accordingly   </i>
1. The user opens the app and gives access to the microphone
2. The microphone picks up speech automatically and stores it into workable data
3. This will allow for transformations of the data.

## Use Case 3 - AAC Board listens with low latecy
<i>As a user, it is crucial the audio processes information quickly to allow conversations to flow freely  </i>
1. The user opens the app and uses the microphone
2. The speech is processed via an API
3. This data is feed into a neural network which will give the best options to highlight, all done quickly

## Use Case 4 - AAC board keeps pictures in the same location to not confuse user
<i>As a user, it is crucial the words stay in the same place not to throw off muscle memory  </i>
1. The user opens the app, the microphone listens, and highlights answers
2. The user selects answers and has is speak out loud
3. The user turns on his mic to pick up a new conversation
4. When new answers are given the highlighted and non-highlighted words will be same location as not to confuse the users muscle memory

## Use Case 5 - Predicting answers 
<i>As a user, it is important that the device can display options to me based on what is being spoken by the other person in conversation </i>
1. A parent asks their child a question
2. AAC device would pick up the question through audio input (speech to text)
3. Displays suggestive options to form a sentence that would function as a relevant response. 
4. Child's mom could ask what the child wants for dinner with the board actively listening
5. Board will highlight several food word options to choose from

## Use Case 6 - Use context to highlight suggestions
<i>As a user it is important that the board can provide me relevant options to what I’ve put in the board already</i>
1. A child tries to form a sentence using the AAC board
2. Predictive texts are given i.e. first word could be choices like pronouns and then the following word could be something like a verb which follows up to another subject.
3. Predictive text highlights relevant words regarding to where user is in sentence making process, 
4. Child putting “I” in first in the AAC board
5. Board highlight words like need or want
6. Child picks one of these words then board highlight words like food or toys or words that might be relevant to the sentence



## Use Case 7 - Contextualized contact based predicting
<i>As a user it is important that based on who is speaking relevant options will be provided based on what is commonly talked about in conversations with them</i>
1. The AI model will predict words based on who they are speaking to using context from previous conversations and communication styles.
2. Child using AAC board with their mom might highlight more relevant words like regarding to wanting food
3. Child using AAC board with friends might highlight more relevant words to things like playing games

## Use Case 8 - Toggling microphone when not in a conversation
<i>As a user, it is important that I can toggle on and off the microphone when I am not in a conversation to prevent false positives and potential security violations.</i>
1. When the user first launches the application it will ask them if they want to give permissions to use the microphone
2. If accepted the users microphone will automatically be toggled on and it will show that via display on the screen
3. If the user wishes to toggle off their microphone for any reason they can hit the button and the icon will change indicating the microphone is off


## Use Case 9 - Highlighting specific catagories with context from question
<i>As a user, specific questions should be answered with specific answers corresponding to those questions.</i>
1. The user returns home from school
2. The user's brother asks them if they would like to play outside
3. This question is picked up by the application and sent to a machine learning set
4. The device highlights potential answers such as "yes", "no", or "maybe"

## Use Case 10 - Highlighting answers based on location
<i>As a user, I would ike a board that knows where I am to guess my answers more percisely .</i>
1. The user goes home from school
2. The users parent asks them how school was
3. Instead of at school where the board would highlight basic answers like good, bad, boring the board would highlight more use of language, perhaps something like hungry
