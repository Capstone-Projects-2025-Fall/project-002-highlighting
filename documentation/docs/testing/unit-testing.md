---
sidebar_position: 1
---
# Unit Testing

## Library Explanation: 
- Jest 
- React Testing Library

Used for unit testing the AudioTranscription React component, which handles real-time audio input, socket connections, and audio transcripts.

### Modules

**Jest** – The main testing framework for running and organizing unit tests.

**@testing-library/react** – Tools for rendering React components and simulating user interactions in a virtual DOM environment.

**@testing-library/jest-dom** – Extends Jest with custom DOM matchers (e.g., toBeInTheDocument, toHaveClass).

### Key Features

**Testing style** – Tests simulate real user behavior rather than focusing on implementation details.

**DOM-based rendering** – Renders components in a virtual DOM to isolate them from the rest of the application.

**Mocking support** – Mocks browser APIs, socket connections, and other dependencies.

**Built-in coverage reporting** –  Offers information on untested code parts.

### Why It Was Chosen

- Developed for React and works with the front-end of the project.

- Provides component tests that are fast, simple, and maintainable.

- Simplifies testing of user-facing behavior (like button clicks, text updates).

- Integrated easily with TypeScript and Jest configuration.

## Execution of Tests:
**“Npx jest – coverage”** : runs all tests with coverage report

**“Npx jest [test file name]”** : run a specific test file
