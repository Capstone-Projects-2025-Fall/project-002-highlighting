import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Canvas from 'frontend/src/components/AAC/Canvas';

// Mock hooks and providers
jest.mock('frontend/src/react-helpers/hooks/useDraw', () => ({
    useDraw: jest.fn(),
    PRED_INTERVAL: 2000,
}));

jest.mock('frontend/src/react-helpers/hooks/useSize', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('frontend/src/react-helpers/hooks/useClientRender', () => ({
    __esModule: true,
    default: jest.fn(() => true),
}));

jest.mock('frontend/src/react-state-management/providers/useSimilarity', () => ({
    useSimilarity: jest.fn(),
}));

jest.mock('frontend/src/react-state-management/providers/InferenceProvider', () => ({
    useInferenceContext: jest.fn(),
}));

jest.mock('frontend/src/react-state-management/providers/StrokeProvider', () => ({
    useStrokeRecorderContext: jest.fn(),
}));

// Import after mocking
import { useDraw } from 'frontend/src/react-helpers/hooks/useDraw';
import useSize from 'frontend/src/react-helpers/hooks/useSize';
import { useSimilarity } from 'frontend/src/react-state-management/providers/useSimilarity';
import { useInferenceContext } from 'frontend/src/react-state-management/providers/InferenceProvider';
import { useStrokeRecorderContext } from 'frontend/src/react-state-management/providers/StrokeProvider';

const mockUseDraw = useDraw as jest.MockedFunction<typeof useDraw>;
const mockUseSize = useSize as jest.MockedFunction<typeof useSize>;
const mockUseSimilarity = useSimilarity as jest.MockedFunction<typeof useSimilarity>;
const mockUseInferenceContext = useInferenceContext as jest.MockedFunction<typeof useInferenceContext>;
const mockUseStrokeRecorderContext = useStrokeRecorderContext as jest.MockedFunction<typeof useStrokeRecorderContext>;

describe('Canvas Component', () => {
    const mockClearCanvas = jest.fn();
    const mockUndoStroke = jest.fn();
    const mockOnMouseDown = jest.fn();
    const mockPredict = jest.fn();
    const mockSetItems = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        // Mock canvas ref
        const mockCanvas = document.createElement('canvas');
        mockCanvas.width = 640;
        mockCanvas.height = 320;
        const mockGetContext = jest.fn(() => ({
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            stroke: jest.fn(),
            fill: jest.fn(),
            arc: jest.fn(),
            clearRect: jest.fn(),
        }));
        mockCanvas.getContext = mockGetContext;

        const mockCanvasRef = { current: mockCanvas };

        mockUseDraw.mockReturnValue({
            canvasRef: mockCanvasRef,
            onMouseDown: mockOnMouseDown,
            clear: mockClearCanvas,
            undoStroke: mockUndoStroke,
            promptUserRecogination: jest.fn(),
        });

        mockUseSize.mockReturnValue({ width: 640, height: 320 });

        mockUseSimilarity.mockReturnValue({
            setItems: mockSetItems,
        });

        mockUseInferenceContext.mockReturnValue({
            predict: mockPredict,
        });

        mockUseStrokeRecorderContext.mockReturnValue({
            points: [],
            addStoke: jest.fn(),
            clear: jest.fn(),
            removeLastStroke: jest.fn(),
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('Rendering', () => {
        test('renders canvas element', () => {
            render(<Canvas />);
            expect(screen.getByTestId('my-canvas')).toBeInTheDocument();
        });

        test('renders clear button', () => {
            render(<Canvas />);
            expect(screen.getByTestId('clearImage')).toBeInTheDocument();
        });

        test('renders undo stroke button', () => {
            render(<Canvas />);
            expect(screen.getByTestId('undo-stroke')).toBeInTheDocument();
        });

        test('canvas has correct default dimensions', () => {
            render(<Canvas />);
            const canvas = screen.getByTestId('my-canvas') as HTMLCanvasElement;
            expect(canvas.width).toBe(640);
            expect(canvas.height).toBe(320);
        });

        test('canvas has correct classes', () => {
            render(<Canvas />);
            const canvas = screen.getByTestId('my-canvas');
            expect(canvas).toHaveClass('border-black', 'border-2', 'shadow-lg', 'rounded-md');
        });
    });

    describe('Interactions', () => {
        test('calls clearCanvas when clear button is clicked', () => {
            render(<Canvas />);
            const clearButton = screen.getByTestId('clearImage');
            fireEvent.click(clearButton);
            expect(mockClearCanvas).toHaveBeenCalled();
        });

        test('calls undoStroke when undo button is clicked', () => {
            render(<Canvas />);
            const undoButton = screen.getByTestId('undo-stroke');
            fireEvent.click(undoButton);
            expect(mockUndoStroke).toHaveBeenCalled();
        });

        test('calls onMouseDown when canvas is clicked', () => {
            render(<Canvas />);
            const canvas = screen.getByTestId('my-canvas');
            fireEvent.mouseDown(canvas);
            expect(mockOnMouseDown).toHaveBeenCalled();
        });

        test('calls onMouseDown when canvas is touched', () => {
            render(<Canvas />);
            const canvas = screen.getByTestId('my-canvas');
            fireEvent.touchStart(canvas);
            expect(mockOnMouseDown).toHaveBeenCalled();
        });
    });

    describe('Canvas Resizing', () => {
        test('updates canvas dimensions when container size changes', () => {
            const { rerender } = render(<Canvas />);
            
            mockUseSize.mockReturnValue({ width: 800, height: 400 });
            rerender(<Canvas />);

            const canvas = screen.getByTestId('my-canvas') as HTMLCanvasElement;
            expect(canvas.width).toBe(800);
            expect(canvas.height).toBe(400);
        });

        test('clears canvas when dimensions change', () => {
            const { rerender } = render(<Canvas />);
            mockClearCanvas.mockClear();

            mockUseSize.mockReturnValue({ width: 800, height: 400 });
            rerender(<Canvas />);

            expect(mockClearCanvas).toHaveBeenCalled();
        });

        test('does not clear canvas if dimensions have not changed', () => {
            const { rerender } = render(<Canvas />);
            mockClearCanvas.mockClear();

            mockUseSize.mockReturnValue({ width: 640, height: 320 });
            rerender(<Canvas />);

            // Should not call clear if dimensions are the same
            expect(mockClearCanvas).not.toHaveBeenCalled();
        });
    });

    describe('Prediction Triggering', () => {
        test('triggers prediction after PRED_INTERVAL when points are added', async () => {
            mockUseStrokeRecorderContext.mockReturnValue({
                points: [{ x: 10, y: 20 }],
                addStoke: jest.fn(),
                clear: jest.fn(),
                removeLastStroke: jest.fn(),
            });

            const mockCanvas = document.createElement('canvas');
            const mockCanvasRef = { current: mockCanvas };
            mockUseDraw.mockReturnValue({
                canvasRef: mockCanvasRef,
                onMouseDown: mockOnMouseDown,
                clear: mockClearCanvas,
                undoStroke: mockUndoStroke,
                promptUserRecogination: jest.fn(),
            });

            render(<Canvas />);

            jest.advanceTimersByTime(2000);

            await waitFor(() => {
                expect(mockPredict).toHaveBeenCalledWith(mockCanvas);
            });
        });

        test('does not trigger prediction when points array is empty', () => {
            mockUseStrokeRecorderContext.mockReturnValue({
                points: [],
                addStoke: jest.fn(),
                clear: jest.fn(),
                removeLastStroke: jest.fn(),
            });

            render(<Canvas />);

            jest.advanceTimersByTime(2000);

            expect(mockPredict).not.toHaveBeenCalled();
        });

        test('clears prediction timer on unmount', () => {
            const { unmount } = render(<Canvas />);

            mockUseStrokeRecorderContext.mockReturnValue({
                points: [{ x: 10, y: 20 }],
                addStoke: jest.fn(),
                clear: jest.fn(),
                removeLastStroke: jest.fn(),
            });

            unmount();
            jest.advanceTimersByTime(2000);

            expect(mockPredict).not.toHaveBeenCalled();
        });
    });

    describe('Container Shifting', () => {
        test('clears canvas when container stops shifting', () => {
            render(<Canvas />);
            mockClearCanvas.mockClear();

            // Trigger container dimension change
            mockUseSize.mockReturnValue({ width: 800, height: 400 });
            const { rerender } = render(<Canvas />);
            
            // Wait for shifting timeout
            jest.advanceTimersByTime(1000);
            rerender(<Canvas />);

            // Should clear after shifting stops
            expect(mockClearCanvas).toHaveBeenCalled();
        });
    });
});


