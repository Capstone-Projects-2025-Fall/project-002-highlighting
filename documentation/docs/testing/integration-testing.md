---
sidebar_position: 2
---
# Integration Tests

This document describes the integration tests created for each use case in the project. These tests verify that the entire user flow works correctly end-to-end.

## Test Files

### Backend Integration Tests

#### Use Case 1: Audio Transcription for Hearing Loss
**File:** `backend/src/routers/tests/test_use_case_1_audio_transcription.py`

Tests the complete flow of recording audio and transcribing it for hearing-impaired communication.

**Key Test Cases:**
- `test_microphone_permission_request` - App requests microphone permissions on startup
- `test_audio_recording_transcription` - Audio is captured and sent to transcription service
- `test_audio_replay_after_transcription` - Recorded audio can be replayed
- `test_multiple_recordings_sequence` - Multiple recordings can be made in sequence
- `test_transcription_with_background_noise` - Works with lower confidence scores
- `test_app_remains_responsive_during_recording` - App stays responsive while recording

**Run Command:**
```bash
cd backend
pytest src/routers/tests/test_use_case_1_audio_transcription.py -v
```

#### Use Case 2: Sentence Formation via AAC Board
**File:** `backend/src/routers/tests/test_use_case_2_sentence_formation.py`

Tests the complete flow of selecting tiles to form sentences and converting them to speech.

**Key Test Cases:**
- `test_app_launches_with_tiles` - Tiles are available when app starts
- `test_tile_selection_sequence` - User can select tiles in sequence to form sentence
- `test_text_to_speech_conversion` - Text is converted to speech
- `test_tts_audio_playback` - Audio can be played back
- `test_clear_sentence_between_uses` - Sentence can be cleared between uses
- `test_rapid_tile_selection` - App handles rapid tile presses
- `test_tts_with_custom_voice_settings` - TTS respects custom voice settings
- `test_sentence_history_tracking` - App tracks sentence history

**Run Command:**
```bash
cd backend
pytest src/routers/tests/test_use_case_2_sentence_formation.py -v
```

#### Use Case 3: Contextual Based Prediction
**File:** `backend/src/routers/tests/test_use_case_3_contextual_prediction.py`

Tests the complete flow of listening to context and suggesting relevant response tiles.

**Key Test Cases:**
- `test_transcribe_question_from_parent` - Device transcribes parent's question
- `test_generate_contextual_suggestions` - Suggestive options are generated
- `test_highlight_food_tiles_for_dinner_question` - Relevant tiles are highlighted
- `test_different_contexts_generate_different_suggestions` - Different questions produce different suggestions
- `test_suggestion_updates_on_new_question` - Suggestions update when new question is asked
- `test_confidence_score_filtering` - Only high-confidence suggestions are shown
- `test_active_listening_continuous_mode` - Board stays in active listening mode
- `test_context_history_for_better_predictions` - Previous context improves suggestions

**Run Command:**
```bash
cd backend
pytest src/routers/tests/test_use_case_3_contextual_prediction.py -v
```

#### Use Case 4: Toggling Microphone When Not in Conversation
**File:** `backend/src/routers/tests/test_use_case_4_microphone_toggle.py`

Tests the complete flow of requesting microphone permissions and toggling microphone on/off.

**Key Test Cases:**
- `test_app_startup_requests_permissions` - App requests permissions on startup
- `test_microphone_permission_accepted` - Microphone is enabled when permission accepted
- `test_microphone_status_display_when_enabled` - Display shows microphone is on
- `test_toggle_microphone_off` - User can toggle microphone off
- `test_toggle_microphone_back_on` - User can toggle microphone back on
- `test_rapid_microphone_toggling` - Rapid toggling works correctly
- `test_microphone_permission_denied` - App handles denied permissions gracefully
- `test_microphone_status_persistence` - Toggle state persists across app sessions
- `test_microphone_in_background_mode` - Microphone behavior correct in background
- `test_microphone_permission_revocation` - App detects permission revocation

**Run Command:**
```bash
cd backend
pytest src/routers/tests/test_use_case_4_microphone_toggle.py -v
```

### Frontend Integration Tests

#### All Use Cases
**File:** `frontend/src/components/AAC/integration.test.tsx`

Tests the frontend components for all use cases, verifying user interactions and visual feedback.

**Test Suites:**
- **Use Case 1: Audio Transcription** - Recording, transcription display, replay
- **Use Case 2: Sentence Formation** - Tile selection, sentence building, audio output
- **Use Case 3: Contextual Prediction** - Tile highlighting, suggestion updates
- **Use Case 4: Microphone Toggle** - Toggle visibility, status display, state persistence
- **Cross-Use Case Tests** - Switching between features, state preservation

**Run Command:**
```bash
cd frontend
npm test -- integration.test.tsx
```

## Running All Integration Tests

### Backend Tests Only
```bash
cd backend
pytest src/routers/tests/test_use_case_*.py -v
```

### Frontend Tests Only
```bash
cd frontend
npm test -- --testPathPattern="integration"
```

### All Tests (Backend + Frontend)
```bash
# From project root
cd backend
pytest src/routers/tests/test_use_case_*.py -v

cd ../frontend
npm test -- --testPathPattern="integration"
```

## Test Coverage

These integration tests cover:
- **Startup & Initialization** - App launches correctly
- **User Permissions** - Microphone and other permissions
- **Audio Processing** - Recording, transcription, playback
- **UI Interactions** - Tile selection, button clicks, toggle states
- **State Management** - Data persistence across actions
- **Error Handling** - Graceful degradation when services fail
- **Performance** - App responsiveness during operations
- **Edge Cases** - Rapid actions, permission changes, context switching

## Mocking Strategy

All tests use mocking to avoid external dependencies:
- **TTS API**: Mocked with `requests_mock`
- **Transcription Service**: Mocked with `requests_mock`
- **S3 Storage**: Mocked with `moto`
- **Database**: Mocked with `unittest.mock.Mock`
- **Browser APIs**: Mocked for audio recording and permissions
- **Socket Connections**: Mocked for real-time updates

## Continuous Integration

These integration tests can be run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Backend Integration Tests
  run: |
    cd backend
    pytest src/routers/tests/test_use_case_*.py -v --cov

- name: Run Frontend Integration Tests
  run: |
    cd frontend
    npm test -- --testPathPattern="integration" --coverage
```

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

