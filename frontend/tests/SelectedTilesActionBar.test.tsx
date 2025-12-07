import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectedTilesActionBar, { actionBarDataTestIds } from 'frontend/src/components/AAC/SelectedTilesActionBar';

// Mock providers
jest.mock('frontend/src/react-state-management/providers/useUtteredTiles', () => ({
    useUtteredTiles: jest.fn(),
}));

jest.mock('frontend/src/react-state-management/providers/HealthCheckProvider', () => ({
    useHealthCheckContext: jest.fn(),
}));

jest.mock('frontend/src/react-state-management/providers/PredictedTilesProvider', () => ({
    usePredictedTiles: jest.fn(),
}));

jest.mock('frontend/src/react-state-management/providers/TranscriptProvider', () => ({
    useTranscript: jest.fn(),
}));

jest.mock('frontend/src/react-state-management/providers/RecordingControlProvider', () => ({
    useRecordingControl: jest.fn(),
}));

jest.mock('frontend/src/react-state-management/providers/HighlightMethodsProvider', () => ({
    useHighlightMethods: jest.fn(),
}));

jest.mock('frontend/src/react-state-management/providers/useRekognition', () => ({
    useRekognition: jest.fn(),
}));

// Mock Speech utility
jest.mock('frontend/src/util/AAC/Speech', () => ({
    speak: jest.fn(),
}));

// Mock MiniTile component
jest.mock('frontend/src/components/AAC/MiniTile', () => ({
    __esModule: true,
    default: ({ text, image }: any) => (
        <div data-testid={`mini-tile-${text}`}>
            {text} - {image}
        </div>
    ),
}));

// Import after mocking
import { useUtteredTiles } from 'frontend/src/react-state-management/providers/useUtteredTiles';
import { useHealthCheckContext } from 'frontend/src/react-state-management/providers/HealthCheckProvider';
import { usePredictedTiles } from 'frontend/src/react-state-management/providers/PredictedTilesProvider';
import { useTranscript } from 'frontend/src/react-state-management/providers/TranscriptProvider';
import { useRecordingControl } from 'frontend/src/react-state-management/providers/RecordingControlProvider';
import { useHighlightMethods } from 'frontend/src/react-state-management/providers/HighlightMethodsProvider';
import { useRekognition } from 'frontend/src/react-state-management/providers/useRekognition';
import { speak } from 'frontend/src/util/AAC/Speech';

const mockUseUtteredTiles = useUtteredTiles as jest.MockedFunction<typeof useUtteredTiles>;
const mockUseHealthCheckContext = useHealthCheckContext as jest.MockedFunction<typeof useHealthCheckContext>;
const mockUsePredictedTiles = usePredictedTiles as jest.MockedFunction<typeof usePredictedTiles>;
const mockUseTranscript = useTranscript as jest.MockedFunction<typeof useTranscript>;
const mockUseRecordingControl = useRecordingControl as jest.MockedFunction<typeof useRecordingControl>;
const mockUseHighlightMethods = useHighlightMethods as jest.MockedFunction<typeof useHighlightMethods>;
const mockUseRekognition = useRekognition as jest.MockedFunction<typeof useRekognition>;
const mockSpeak = speak as jest.MockedFunction<typeof speak>;

describe('SelectedTilesActionBar Component', () => {
    const mockClear = jest.fn();
    const mockRemoveLastTile = jest.fn();
    const mockSetPredictedTiles = jest.fn();
    const mockSetTranscript = jest.fn();
    const mockSetIsActive = jest.fn();
    const mockToggleHighlightMethod = jest.fn();
    const mockToggleCamera = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseUtteredTiles.mockReturnValue({
            tiles: [],
            tileHistory: [],
            clear: mockClear,
            addTile: jest.fn(),
            removeLastTile: mockRemoveLastTile,
        });

        mockUseHealthCheckContext.mockReturnValue({
            backendActive: true,
        });

        mockUsePredictedTiles.mockReturnValue({
            predictedTiles: [],
            setPredictedTiles: mockSetPredictedTiles,
        });

        mockUseTranscript.mockReturnValue({
            transcript: '',
            setTranscript: mockSetTranscript,
        });

        mockUseRecordingControl.mockReturnValue({
            isActive: false,
            setIsActive: mockSetIsActive,
        });

        mockUseHighlightMethods.mockReturnValue({
            activeHighlights: new Set(),
            toggleHighlightMethod: mockToggleHighlightMethod,
        });

        mockUseRekognition.mockReturnValue({
            toggle: false,
            toggleCamera: mockToggleCamera,
        });
    });

    describe('Rendering', () => {
        test('renders container', () => {
            render(<SelectedTilesActionBar />);
            expect(screen.getByTestId(actionBarDataTestIds.container)).toBeInTheDocument();
        });

        test('renders word box', () => {
            render(<SelectedTilesActionBar />);
            expect(screen.getByTestId(actionBarDataTestIds.wordBox)).toBeInTheDocument();
        });

        test('renders speak button', () => {
            render(<SelectedTilesActionBar />);
            expect(screen.getByTestId(actionBarDataTestIds.speakBtn)).toBeInTheDocument();
        });

        test('renders clear button', () => {
            render(<SelectedTilesActionBar />);
            expect(screen.getByTestId(actionBarDataTestIds.clearBtn)).toBeInTheDocument();
        });

        test('renders backspace button', () => {
            render(<SelectedTilesActionBar />);
            expect(screen.getByTestId(actionBarDataTestIds.backspaceBtn)).toBeInTheDocument();
        });

        test('renders camera toggle button when backend is active', () => {
            render(<SelectedTilesActionBar />);
            expect(screen.getByTestId(actionBarDataTestIds.toggleCamBtn)).toBeInTheDocument();
        });

        test('does not render camera toggle button when backend is inactive', () => {
            mockUseHealthCheckContext.mockReturnValue({
                backendActive: false,
            });

            render(<SelectedTilesActionBar />);
            expect(screen.queryByTestId(actionBarDataTestIds.toggleCamBtn)).not.toBeInTheDocument();
        });

        test('renders start/stop recording button', () => {
            render(<SelectedTilesActionBar />);
            const buttons = screen.getAllByRole('button');
            const recordButton = buttons.find(btn => 
                btn.getAttribute('title') === 'Start Recording' || 
                btn.getAttribute('title') === 'Stop Recording'
            );
            expect(recordButton).toBeInTheDocument();
        });

        test('renders settings button', () => {
            render(<SelectedTilesActionBar />);
            const buttons = screen.getAllByRole('button');
            const settingsButton = buttons.find(btn => 
                btn.getAttribute('title') === 'Settings'
            );
            expect(settingsButton).toBeInTheDocument();
        });
    });

    describe('Tile Display', () => {
        test('displays tiles in word box', () => {
            mockUseUtteredTiles.mockReturnValue({
                tiles: [
                    { image: '/test1.png', text: 'Tile1', tileColor: 'yellow' as const, sound: 'tile1' },
                    { image: '/test2.png', text: 'Tile2', tileColor: 'blue' as const, sound: 'tile2' },
                ],
                tileHistory: [],
                clear: mockClear,
                addTile: jest.fn(),
                removeLastTile: mockRemoveLastTile,
            });

            render(<SelectedTilesActionBar />);
            expect(screen.getByTestId('mini-tile-Tile1')).toBeInTheDocument();
            expect(screen.getByTestId('mini-tile-Tile2')).toBeInTheDocument();
        });

        test('displays empty word box when no tiles', () => {
            render(<SelectedTilesActionBar />);
            const wordBox = screen.getByTestId(actionBarDataTestIds.wordBox);
            expect(wordBox).toBeEmptyDOMElement();
        });
    });

    describe('Button Interactions', () => {
        test('calls speak when speak button is clicked', () => {
            mockUseUtteredTiles.mockReturnValue({
                tiles: [
                    { image: '/test.png', text: 'Hello', tileColor: 'yellow' as const, sound: 'hello' },
                    { image: '/test.png', text: 'World', tileColor: 'blue' as const, sound: 'world' },
                ],
                tileHistory: [],
                clear: mockClear,
                addTile: jest.fn(),
                removeLastTile: mockRemoveLastTile,
            });

            render(<SelectedTilesActionBar />);
            fireEvent.click(screen.getByTestId(actionBarDataTestIds.speakBtn));

            expect(mockSpeak).toHaveBeenCalledWith('hello world', true);
        });

        test('filters out tiles without sound when speaking', () => {
            mockUseUtteredTiles.mockReturnValue({
                tiles: [
                    { image: '/test.png', text: 'Hello', tileColor: 'yellow' as const, sound: 'hello' },
                    { image: '/test.png', text: 'NoSound', tileColor: 'blue' as const },
                    { image: '/test.png', text: 'World', tileColor: 'green' as const, sound: 'world' },
                ],
                tileHistory: [],
                clear: mockClear,
                addTile: jest.fn(),
                removeLastTile: mockRemoveLastTile,
            });

            render(<SelectedTilesActionBar />);
            fireEvent.click(screen.getByTestId(actionBarDataTestIds.speakBtn));

            expect(mockSpeak).toHaveBeenCalledWith('hello world', true);
        });

        test('calls clear when clear button is clicked', () => {
            render(<SelectedTilesActionBar />);
            fireEvent.click(screen.getByTestId(actionBarDataTestIds.clearBtn));

            expect(mockClear).toHaveBeenCalled();
            expect(mockSetPredictedTiles).toHaveBeenCalledWith([]);
            expect(mockSetTranscript).toHaveBeenCalledWith('');
        });

        test('calls removeLastTile when backspace button is clicked', () => {
            render(<SelectedTilesActionBar />);
            fireEvent.click(screen.getByTestId(actionBarDataTestIds.backspaceBtn));

            expect(mockRemoveLastTile).toHaveBeenCalled();
        });

        test('toggles recording state when start/stop button is clicked', () => {
            render(<SelectedTilesActionBar />);
            const buttons = screen.getAllByRole('button');
            const recordButton = buttons.find(btn => 
                btn.getAttribute('title') === 'Start Recording'
            );

            fireEvent.click(recordButton!);
            expect(mockSetIsActive).toHaveBeenCalledWith(true);
        });

        test('clears predicted tiles when stopping recording', () => {
            mockUseRecordingControl.mockReturnValue({
                isActive: true,
                setIsActive: mockSetIsActive,
            });

            render(<SelectedTilesActionBar />);
            const buttons = screen.getAllByRole('button');
            const recordButton = buttons.find(btn => 
                btn.getAttribute('title') === 'Stop Recording'
            );

            fireEvent.click(recordButton!);
            expect(mockSetIsActive).toHaveBeenCalledWith(false);
            expect(mockSetPredictedTiles).toHaveBeenCalledWith([]);
        });

        test('toggles camera when camera button is clicked', () => {
            render(<SelectedTilesActionBar />);
            fireEvent.click(screen.getByTestId(actionBarDataTestIds.toggleCamBtn));

            expect(mockToggleCamera).toHaveBeenCalled();
        });

        test('shows camera on icon when toggle is true', () => {
            mockUseRekognition.mockReturnValue({
                toggle: true,
                toggleCamera: mockToggleCamera,
            });

            render(<SelectedTilesActionBar />);
            expect(screen.getByTestId(actionBarDataTestIds.cameraIconOn)).toBeInTheDocument();
        });

        test('shows camera off icon when toggle is false', () => {
            mockUseRekognition.mockReturnValue({
                toggle: false,
                toggleCamera: mockToggleCamera,
            });

            render(<SelectedTilesActionBar />);
            expect(screen.getByTestId(actionBarDataTestIds.cameraIconOff)).toBeInTheDocument();
        });
    });

    describe('Settings Menu', () => {
        test('opens settings menu when settings button is clicked', () => {
            render(<SelectedTilesActionBar />);
            const buttons = screen.getAllByRole('button');
            const settingsButton = buttons.find(btn => 
                btn.getAttribute('title') === 'Settings'
            );

            fireEvent.click(settingsButton!);
            expect(screen.getByText('Highlighting Methods')).toBeInTheDocument();
        });

        test('displays highlighting method options', () => {
            render(<SelectedTilesActionBar />);
            const buttons = screen.getAllByRole('button');
            const settingsButton = buttons.find(btn => 
                btn.getAttribute('title') === 'Settings'
            );

            fireEvent.click(settingsButton!);
            expect(screen.getByText('Opacity')).toBeInTheDocument();
            expect(screen.getByText('Border')).toBeInTheDocument();
            expect(screen.getByText('Pulse')).toBeInTheDocument();
        });

        test('toggles highlight method when option is clicked', () => {
            render(<SelectedTilesActionBar />);
            const buttons = screen.getAllByRole('button');
            const settingsButton = buttons.find(btn => 
                btn.getAttribute('title') === 'Settings'
            );

            fireEvent.click(settingsButton!);
            fireEvent.click(screen.getByText('Opacity'));

            expect(mockToggleHighlightMethod).toHaveBeenCalledWith('opacity');
        });

        test('shows checked state for active highlight methods', () => {
            mockUseHighlightMethods.mockReturnValue({
                activeHighlights: new Set(['opacity', 'border']),
                toggleHighlightMethod: mockToggleHighlightMethod,
            });

            render(<SelectedTilesActionBar />);
            const buttons = screen.getAllByRole('button');
            const settingsButton = buttons.find(btn => 
                btn.getAttribute('title') === 'Settings'
            );

            fireEvent.click(settingsButton!);
            
            const checkboxes = screen.getAllByRole('checkbox');
            expect(checkboxes[0]).toBeChecked(); // Opacity
            expect(checkboxes[1]).toBeChecked(); // Border
            expect(checkboxes[2]).not.toBeChecked(); // Pulse
        });
    });

    describe('Recording State', () => {
        test('shows stop icon when recording is active', () => {
            mockUseRecordingControl.mockReturnValue({
                isActive: true,
                setIsActive: mockSetIsActive,
            });

            render(<SelectedTilesActionBar />);
            const buttons = screen.getAllByRole('button');
            const recordButton = buttons.find(btn => 
                btn.getAttribute('title') === 'Stop Recording'
            );
            expect(recordButton).toBeInTheDocument();
        });

        test('shows play icon when recording is inactive', () => {
            mockUseRecordingControl.mockReturnValue({
                isActive: false,
                setIsActive: mockSetIsActive,
            });

            render(<SelectedTilesActionBar />);
            const buttons = screen.getAllByRole('button');
            const recordButton = buttons.find(btn => 
                btn.getAttribute('title') === 'Start Recording'
            );
            expect(recordButton).toBeInTheDocument();
        });
    });
});


