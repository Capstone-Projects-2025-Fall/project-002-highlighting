import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tile, { computeTileContainerName, tileColors, TileColor } from 'frontend/src/components/AAC/Tile';

// Mock the useUtteredTiles provider
jest.mock('frontend/src/react-state-management/providers/useUtteredTiles', () => ({
    useUtteredTiles: jest.fn(),
}));

// Mock the Speech utility
jest.mock('frontend/src/util/AAC/Speech', () => ({
    speak: jest.fn(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt, ...props }: any) => (
        <img src={src} alt={alt} {...props} />
    ),
}));

// Import after mocking
import { useUtteredTiles } from 'frontend/src/react-state-management/providers/useUtteredTiles';
import { speak } from 'frontend/src/util/AAC/Speech';

const mockUseUtteredTiles = useUtteredTiles as jest.MockedFunction<typeof useUtteredTiles>;
const mockSpeak = speak as jest.MockedFunction<typeof speak>;

describe('Tile Component', () => {
    const mockAddTile = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseUtteredTiles.mockReturnValue({
            tiles: [],
            tileHistory: [],
            clear: jest.fn(),
            addTile: mockAddTile,
            removeLastTile: jest.fn(),
        });
    });

    describe('Rendering', () => {
        test('renders tile with required props', () => {
            render(
                <Tile
                    image="/test/image.png"
                    text="Hello"
                    tileColor="yellow"
                />
            );

            expect(screen.getByTestId(computeTileContainerName('Hello'))).toBeInTheDocument();
            expect(screen.getByTestId('tile-text')).toHaveTextContent('Hello');
            expect(screen.getByTestId('tile-image')).toHaveAttribute('src', '/test/image.png');
        });

        test('renders tile with all props', () => {
            render(
                <Tile
                    image="/test/image.png"
                    text="Test Tile"
                    tileColor="blue"
                    sound="test sound"
                    hasSubTiles={true}
                    opacity={50}
                    hasBorder={true}
                />
            );

            const container = screen.getByTestId(computeTileContainerName('Test Tile'));
            expect(container).toBeInTheDocument();
            expect(container).toHaveStyle({ opacity: '0.5', border: '4px solid #000' });
        });

        test('applies correct color class for each tile color', () => {
            const colors: TileColor[] = ['yellow', 'green', 'blue', 'orange', 'red', 'purple', 'gray'];
            
            colors.forEach((color) => {
                const { container } = render(
                    <Tile
                        image="/test.png"
                        text={`Tile ${color}`}
                        tileColor={color}
                    />
                );
                expect(container.firstChild).toHaveClass(`tile-color-${color}`);
            });
        });

        test('shows folder icon when hasSubTiles is true', () => {
            render(
                <Tile
                    image="/test.png"
                    text="Folder Tile"
                    tileColor="yellow"
                    hasSubTiles={true}
                />
            );

            const container = screen.getByTestId(computeTileContainerName('Folder Tile'));
            const folderIcon = container.querySelector('svg');
            expect(folderIcon).toBeInTheDocument();
        });

        test('does not show folder icon when hasSubTiles is false', () => {
            render(
                <Tile
                    image="/test.png"
                    text="Regular Tile"
                    tileColor="yellow"
                    hasSubTiles={false}
                />
            );

            const container = screen.getByTestId(computeTileContainerName('Regular Tile'));
            const folderIcon = container.querySelector('svg');
            expect(folderIcon).not.toBeInTheDocument();
        });

        test('applies opacity correctly', () => {
            render(
                <Tile
                    image="/test.png"
                    text="Opacity Tile"
                    tileColor="yellow"
                    opacity={75}
                />
            );

            const container = screen.getByTestId(computeTileContainerName('Opacity Tile'));
            expect(container).toHaveStyle({ opacity: '0.75' });
        });

        test('applies default opacity of 100 when not specified', () => {
            render(
                <Tile
                    image="/test.png"
                    text="Default Opacity"
                    tileColor="yellow"
                />
            );

            const container = screen.getByTestId(computeTileContainerName('Default Opacity'));
            expect(container).toHaveStyle({ opacity: '1' });
        });

        test('applies border when hasBorder is true', () => {
            render(
                <Tile
                    image="/test.png"
                    text="Bordered Tile"
                    tileColor="yellow"
                    hasBorder={true}
                />
            );

            const container = screen.getByTestId(computeTileContainerName('Bordered Tile'));
            expect(container).toHaveStyle({ border: '4px solid #000' });
        });

        test('applies override background color', () => {
            render(
                <Tile
                    image="/test.png"
                    text="Override Color"
                    tileColor="yellow"
                    overrideBgColor="#FF0000"
                />
            );

            const container = screen.getByTestId(computeTileContainerName('Override Color'));
            expect(container).toHaveStyle({ backgroundColor: '#FF0000' });
        });

        test('applies pulsing class when isPulsing is true', () => {
            render(
                <Tile
                    image="/test.png"
                    text="Pulsing Tile"
                    tileColor="yellow"
                    isPulsing={true}
                />
            );

            const container = screen.getByTestId(computeTileContainerName('Pulsing Tile'));
            expect(container).toHaveClass('pulse-highlight');
        });

        test('applies 3D button class when is3D is true', () => {
            render(
                <Tile
                    image="/test.png"
                    text="3D Tile"
                    tileColor="yellow"
                    is3D={true}
                />
            );

            const container = screen.getByTestId(computeTileContainerName('3D Tile'));
            expect(container).toHaveClass('three-d-button');
        });
    });

    describe('Interactions', () => {
        test('calls speak and addTile when clicked with sound', () => {
            render(
                <Tile
                    image="/test.png"
                    text="Clickable Tile"
                    tileColor="yellow"
                    sound="test sound"
                />
            );

            const container = screen.getByTestId(computeTileContainerName('Clickable Tile'));
            fireEvent.click(container);

            expect(mockSpeak).toHaveBeenCalledWith('test sound');
            expect(mockAddTile).toHaveBeenCalledWith({
                image: '/test.png',
                sound: 'test sound',
                text: 'Clickable Tile',
                tileColor: 'yellow',
            });
        });

        test('does not call speak or addTile when clicked without sound', () => {
            render(
                <Tile
                    image="/test.png"
                    text="Soundless Tile"
                    tileColor="yellow"
                />
            );

            const container = screen.getByTestId(computeTileContainerName('Soundless Tile'));
            fireEvent.click(container);

            expect(mockSpeak).not.toHaveBeenCalled();
            expect(mockAddTile).not.toHaveBeenCalled();
        });

        test('handles multiple clicks correctly', () => {
            render(
                <Tile
                    image="/test.png"
                    text="Multi Click Tile"
                    tileColor="yellow"
                    sound="test"
                />
            );

            const container = screen.getByTestId(computeTileContainerName('Multi Click Tile'));
            
            fireEvent.click(container);
            fireEvent.click(container);
            fireEvent.click(container);

            expect(mockSpeak).toHaveBeenCalledTimes(3);
            expect(mockAddTile).toHaveBeenCalledTimes(3);
        });
    });

    describe('computeTileContainerName', () => {
        test('generates correct test ID for simple text', () => {
            expect(computeTileContainerName('Hello')).toBe('tile-container-Hello');
        });

        test('replaces spaces with underscores', () => {
            expect(computeTileContainerName('Hello World')).toBe('tile-container-Hello_World');
        });

        test('handles multiple spaces', () => {
            expect(computeTileContainerName('Hello  World')).toBe('tile-container-Hello__World');
        });
    });
});


