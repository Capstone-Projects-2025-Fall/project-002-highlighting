// Jest setup file for testing configuration

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock AudioContext
global.AudioContext = jest.fn().mockImplementation(() => ({
  createAnalyser: jest.fn(),
  createGain: jest.fn(),
  createOscillator: jest.fn(),
  createBufferSource: jest.fn(),
  createMediaStreamSource: jest.fn(),
  destination: {},
  sampleRate: 44100,
  state: 'running',
  suspend: jest.fn(),
  resume: jest.fn(),
  close: jest.fn(),
}));

// Mock HTMLAudioElement
Object.defineProperty(HTMLAudioElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockImplementation(() => Promise.resolve()),
});

Object.defineProperty(HTMLAudioElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLAudioElement.prototype, 'load', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLAudioElement.prototype, 'currentTime', {
  writable: true,
  value: 0,
});

Object.defineProperty(HTMLAudioElement.prototype, 'duration', {
  writable: true,
  value: 100,
});

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Set up console mocking globally
console.error = jest.fn();
console.warn = jest.fn();
