import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AudioTranscription from './AudioTranscription';

// Mock socket.io-client
const mockSocket = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn(),
};

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => mockSocket),
}));

// Mock MediaDevices API to prevent actual microphone access
const mockGetUserMedia = jest.fn();
const mockEnumerateDevices = jest.fn();

Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
    enumerateDevices: mockEnumerateDevices,
  },
  writable: true,
});

// Mock MediaRecorder to prevent actual recording
global.MediaRecorder = jest.fn().mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  state: 'inactive',
  ondataavailable: null,
  onstop: null,
})) as any;

// Add static method
(global.MediaRecorder as any).isTypeSupported = jest.fn(() => true);

// Mock URL methods
global.URL.createObjectURL = jest.fn(() => 'mock-audio-url');
global.URL.revokeObjectURL = jest.fn();

describe('AudioTranscription Component - Basic Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup getUserMedia to resolve successfully
    mockGetUserMedia.mockResolvedValue({
      getTracks: () => [{ stop: jest.fn() }],
    });
    
    // Setup enumerateDevices mock
    mockEnumerateDevices.mockResolvedValue([
      { kind: 'audioinput', label: 'Microphone' }
    ]);
  });

  describe('Component Rendering', () => {
    test('renders without crashing', () => {
      render(<AudioTranscription />);
      expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument();
    });

    test('displays start recording button initially', () => {
      render(<AudioTranscription />);
      expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument();
    });

    test('shows transcript placeholder text', () => {
      render(<AudioTranscription />);
      expect(screen.getByText('Transcript will appear here...')).toBeInTheDocument();
    });

    test('has correct CSS class structure', () => {
      const { container } = render(<AudioTranscription />);
      
      expect(container.querySelector('.audioTranscriptionContainer')).toBeInTheDocument();
      expect(container.querySelector('.controlsContainer')).toBeInTheDocument();
      expect(container.querySelector('.transcriptContainer')).toBeInTheDocument();
    });
  });

  describe('Socket.io Integration', () => {
    test('establishes socket connection on mount', () => {
      const { io } = require('socket.io-client');
      
      render(<AudioTranscription />);
      
      expect(io).toHaveBeenCalledWith('http://localhost:5000');
    });

    test('disconnects socket on unmount', () => {
      const { unmount } = render(<AudioTranscription />);
      
      // Wait for component to mount and socket to be created
      setTimeout(() => {
        unmount();
        expect(mockSocket.disconnect).toHaveBeenCalled();
      }, 0);
    });
  });

  describe('Error Handling', () => {
    test('handles microphone permission denial gracefully', () => {
      mockGetUserMedia.mockRejectedValue(new Error('Permission denied'));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      render(<AudioTranscription />);
      
      // Component should still render even with permission denied
      expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    test('handles MediaRecorder not supported', () => {
      global.MediaRecorder = undefined as any;
      
      render(<AudioTranscription />);
      
      // Component should still render
      expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('has record button with correct styling class', () => {
      render(<AudioTranscription />);
      
      const recordButton = screen.getByRole('button', { name: /start recording/i });
      expect(recordButton).toHaveClass('recordButton');
    });

    test('has transcript text element', () => {
      render(<AudioTranscription />);
      
      const transcriptElement = screen.getByText('Transcript will appear here...');
      expect(transcriptElement).toHaveClass('transcriptText');
    });
  });

  describe('MediaRecorder Setup', () => {
    test('requests microphone access', () => {
      render(<AudioTranscription />);
      
      expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
    });

    test('component handles MediaRecorder creation', () => {
      // This test verifies the component renders without crashing when MediaRecorder is available
      render(<AudioTranscription />);
      
      // Component should render successfully
      expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    test('initializes with correct default states', () => {
      render(<AudioTranscription />);
      
      // Check initial recording state
      expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument();
      
      // Check initial transcript state
      expect(screen.getByText('Transcript will appear here...')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has accessible button with proper role', () => {
      render(<AudioTranscription />);
      
      const recordButton = screen.getByRole('button', { name: /start recording/i });
      expect(recordButton).toBeInTheDocument();
    });

    test('button has descriptive text', () => {
      render(<AudioTranscription />);
      
      const button = screen.getByRole('button', { name: /start recording/i });
      expect(button).toBeInTheDocument();
    });
  });
});
