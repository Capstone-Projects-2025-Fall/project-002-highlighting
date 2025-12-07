import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ManualTilesPopup, { ManualPopupTestIds } from 'frontend/src/components/AAC/ManualTilesPopup';

// Mock the ManualModalProvider
jest.mock('frontend/src/react-state-management/providers/ManualModalProvider', () => ({
    useManualModeModelContext: jest.fn(),
}));

// Mock child components
jest.mock('frontend/src/components/AAC/Tiles', () => ({
    __esModule: true,
    default: () => <div data-testid="tiles-component">Tiles Component</div>,
}));

jest.mock('frontend/src/components/AAC/SelectedTilesActionBar', () => ({
    __esModule: true,
    default: () => <div data-testid="selected-tiles-action-bar">Action Bar</div>,
}));

// Import after mocking
import { useManualModeModelContext } from 'frontend/src/react-state-management/providers/ManualModalProvider';

const mockUseManualModeModelContext = useManualModeModelContext as jest.MockedFunction<typeof useManualModeModelContext>;

describe('ManualTilesPopup Component', () => {
    const mockToggleModal = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        test('renders when modal is open', () => {
            mockUseManualModeModelContext.mockReturnValue([true, mockToggleModal]);

            render(<ManualTilesPopup />);

            expect(screen.getByTestId('selected-tiles-action-bar')).toBeInTheDocument();
            expect(screen.getByTestId('tiles-component')).toBeInTheDocument();
        });

        test('does not render when modal is closed', () => {
            mockUseManualModeModelContext.mockReturnValue([false, mockToggleModal]);

            const { container } = render(<ManualTilesPopup />);

            expect(screen.queryByTestId('selected-tiles-action-bar')).not.toBeInTheDocument();
            expect(screen.queryByTestId('tiles-component')).not.toBeInTheDocument();
            expect(container.firstChild).toBeEmptyDOMElement();
        });

        test('renders with correct section classes when open', () => {
            mockUseManualModeModelContext.mockReturnValue([true, mockToggleModal]);

            const { container } = render(<ManualTilesPopup />);
            const section = container.querySelector('section');

            expect(section).toHaveClass(
                'absolute',
                'bg-white',
                'z-20',
                'top-0',
                'left-0',
                'right-0',
                'bottom-0',
                'w-screen',
                'h-screen'
            );
        });

        test('renders SelectedTilesActionBar component', () => {
            mockUseManualModeModelContext.mockReturnValue([true, mockToggleModal]);

            render(<ManualTilesPopup />);

            expect(screen.getByTestId('selected-tiles-action-bar')).toBeInTheDocument();
        });

        test('renders Tiles component', () => {
            mockUseManualModeModelContext.mockReturnValue([true, mockToggleModal]);

            render(<ManualTilesPopup />);

            expect(screen.getByTestId('tiles-component')).toBeInTheDocument();
        });
    });

    describe('Modal State Management', () => {
        test('uses toggleModal from context', () => {
            mockUseManualModeModelContext.mockReturnValue([true, mockToggleModal]);

            render(<ManualTilesPopup />);

            // The toggleModal function should be available from context
            expect(mockUseManualModeModelContext).toHaveBeenCalled();
        });

        test('handles state changes correctly', () => {
            const { rerender } = render(<ManualTilesPopup />);
            
            // Initially closed
            mockUseManualModeModelContext.mockReturnValue([false, mockToggleModal]);
            rerender(<ManualTilesPopup />);
            expect(screen.queryByTestId('tiles-component')).not.toBeInTheDocument();

            // Now open
            mockUseManualModeModelContext.mockReturnValue([true, mockToggleModal]);
            rerender(<ManualTilesPopup />);
            expect(screen.getByTestId('tiles-component')).toBeInTheDocument();
        });
    });

    describe('Component Structure', () => {
        test('has correct wrapper structure', () => {
            mockUseManualModeModelContext.mockReturnValue([true, mockToggleModal]);

            const { container } = render(<ManualTilesPopup />);
            
            // Should have a div wrapper
            const wrapper = container.firstChild;
            expect(wrapper).toBeInTheDocument();
        });

        test('section covers full screen', () => {
            mockUseManualModeModelContext.mockReturnValue([true, mockToggleModal]);

            const { container } = render(<ManualTilesPopup />);
            const section = container.querySelector('section');

            expect(section).toHaveStyle({
                position: 'absolute',
                width: '100vw',
                height: '100vh',
            });
        });
    });
});


