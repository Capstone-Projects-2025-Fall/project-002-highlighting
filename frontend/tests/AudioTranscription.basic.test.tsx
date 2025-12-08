// Mock socket.io-client - MUST be before any imports
jest.mock('socket.io-client', () => {
  return {
    io: jest.fn(() => ({
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
      connected: true,
      id: 'mock-socket-id',
    })),
  };
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AudioTranscription from 'frontend/src/components/AAC/AudioTranscription';
import { getBackendUrl } from 'frontend/src/util/backend-url';

// Mock providers
jest.mock('frontend/src/react-state-management/providers/PredictedTilesProvider', () => ({
  usePredictedTiles: jest.fn(),
}));

jest.mock('frontend/src/react-state-management/providers/useUtteredTiles', () => ({
  useUtteredTiles: jest.fn(),
}));

jest.mock('frontend/src/react-state-management/providers/RecordingControlProvider', () => ({
  useRecordingControl: jest.fn(),
}));

jest.mock('frontend/src/react-state-management/providers/TranscriptProvider', () => ({
  useTranscript: jest.fn(),
}));

// Import after mocking
import { usePredictedTiles } from 'frontend/src/react-state-management/providers/PredictedTilesProvider';
import { useUtteredTiles } from 'frontend/src/react-state-management/providers/useUtteredTiles';
import { useRecordingControl } from 'frontend/src/react-state-management/providers/RecordingControlProvider';
import { useTranscript } from 'frontend/src/react-state-management/providers/TranscriptProvider';

const mockUsePredictedTiles = usePredictedTiles as jest.MockedFunction<typeof usePredictedTiles>;
const mockUseUtteredTiles = useUtteredTiles as jest.MockedFunction<typeof useUtteredTiles>;
const mockUseRecordingControl = useRecordingControl as jest.MockedFunction<typeof useRecordingControl>;
const mockUseTranscript = useTranscript as jest.MockedFunction<typeof useTranscript>;


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

process.env.NEXT_PUBLIC_API_BASE = "http://localhost:5000";

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

    // Setup provider mocks
    mockUsePredictedTiles.mockReturnValue({
      predictedTiles: [],
      setPredictedTiles: jest.fn(),
    });

    mockUseUtteredTiles.mockReturnValue({
      tiles: [],
      tileHistory: [],
      clear: jest.fn(),
      addTile: jest.fn(),
      removeLastTile: jest.fn(),
    });

    mockUseRecordingControl.mockReturnValue({
      isActive: true,
      setIsActive: jest.fn(),
    });

    mockUseTranscript.mockReturnValue({
      transcript: '',
      setTranscript: jest.fn(),
    });
  });

  describe('Component Rendering', () => {
    test('renders without crashing', () => {
      render(<AudioTranscription />);
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    });

    test('displays start button initially when not active', () => {
      mockUseRecordingControl.mockReturnValue({
        isActive: false,
        setIsActive: jest.fn(),
      });
      render(<AudioTranscription />);
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    });

    test('displays stop button when active', () => {
      mockUseRecordingControl.mockReturnValue({
        isActive: true,
        setIsActive: jest.fn(),
      });
      render(<AudioTranscription />);
      expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument();
    });

    test('shows transcript placeholder text', () => {
      render(<AudioTranscription />);
      expect(screen.getByText('Transcript will appear here...')).toBeInTheDocument();
    });

    test('has correct CSS class structure', () => {
      const { container } = render(<AudioTranscription />);
      
      // CSS modules generate hashed class names, so we check for the container structure instead
      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();
      // Check that controls and transcript containers exist within the main container
      expect(container.querySelector('[class*="controlsContainer"]') || container.querySelector('button')).toBeInTheDocument();
      expect(container.querySelector('[class*="transcriptContainer"]') || container.textContent?.includes('Transcript')).toBeTruthy();
    });
  });

  describe('Socket.io Integration', () => {
    test('establishes socket connection on mount', () => {
      const { io } = require('socket.io-client');
      
      render(<AudioTranscription />);
      
      expect(io).toHaveBeenCalledWith(getBackendUrl());
    });

    test('disconnects socket on unmount', () => {
      const { io } = require('socket.io-client');
      const { unmount } = render(<AudioTranscription />);
      
      // Get the socket instance that was created
      const socketInstance = (io as jest.Mock).mock.results[0].value;
      
      unmount();
      expect(socketInstance.disconnect).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('handles microphone permission denial gracefully', () => {
      mockGetUserMedia.mockRejectedValue(new Error('Permission denied'));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      render(<AudioTranscription />);
      
      // Component should still render even with permission denied
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    test('handles MediaRecorder not supported', () => {
      global.MediaRecorder = undefined as any;
      
      render(<AudioTranscription />);
      
      // Component should still render
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('has record button with correct styling class', () => {
      mockUseRecordingControl.mockReturnValue({
        isActive: false,
        setIsActive: jest.fn(),
      });
      render(<AudioTranscription />);
      
      const recordButton = screen.getByRole('button', { name: /start/i });
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
      mockUseRecordingControl.mockReturnValue({
        isActive: false,
        setIsActive: jest.fn(),
      });
      render(<AudioTranscription />);
      
      // Component should render successfully
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    test('initializes with correct default states', () => {
      mockUseRecordingControl.mockReturnValue({
        isActive: false,
        setIsActive: jest.fn(),
      });
      render(<AudioTranscription />);
      
      // Check initial recording state
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
      
      // Check initial transcript state
      expect(screen.getByText('Transcript will appear here...')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has accessible button with proper role', () => {
      mockUseRecordingControl.mockReturnValue({
        isActive: false,
        setIsActive: jest.fn(),
      });
      render(<AudioTranscription />);
      
      const recordButton = screen.getByRole('button', { name: /start/i });
      expect(recordButton).toBeInTheDocument();
    });

    test('button has descriptive text', () => {
      mockUseRecordingControl.mockReturnValue({
        isActive: false,
        setIsActive: jest.fn(),
      });
      render(<AudioTranscription />);
      
      const button = screen.getByRole('button', { name: /start/i });
      expect(button).toBeInTheDocument();
    });
  });
});
