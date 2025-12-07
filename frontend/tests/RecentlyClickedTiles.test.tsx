import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecentlyClickedTiles, { recentlyClickedTilesIds } from 'frontend/src/components/AAC/RecentlyClickedTiles';

// Mock the useUtteredTiles provider
jest.mock('frontend/src/react-state-management/providers/useUtteredTiles', () => ({
    useUtteredTiles: jest.fn(),
}));

// Mock the Tile component
jest.mock('frontend/src/components/AAC/Tile', () => ({
    __esModule: true,
    default: ({ text, image, tileColor, sound }: any) => (
        <div data-testid={`recent-tile-${text}`}>
            {text} - {image} - {tileColor} - {sound}
        </div>
    ),
}));

// Import after mocking
import { useUtteredTiles } from 'frontend/src/react-state-management/providers/useUtteredTiles';

const mockUseUtteredTiles = useUtteredTiles as jest.MockedFunction<typeof useUtteredTiles>;

describe('RecentlyClickedTiles Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        test('renders container with title', () => {
            mockUseUtteredTiles.mockReturnValue({
                tiles: [],
                tileHistory: [],
                clear: jest.fn(),
                addTile: jest.fn(),
                removeLastTile: jest.fn(),
            });

            render(<RecentlyClickedTiles />);

            expect(screen.getByTestId(recentlyClickedTilesIds.container)).toBeInTheDocument();
            expect(screen.getByTestId(recentlyClickedTilesIds.title)).toHaveTextContent('Recent Tiles');
        });

        test('renders empty state when no tiles in history', () => {
            mockUseUtteredTiles.mockReturnValue({
                tiles: [],
                tileHistory: [],
                clear: jest.fn(),
                addTile: jest.fn(),
                removeLastTile: jest.fn(),
            });

            render(<RecentlyClickedTiles />);

            expect(screen.getByTestId(recentlyClickedTilesIds.tileContainer)).toBeInTheDocument();
            expect(screen.queryByTestId(/recent-tile-/)).not.toBeInTheDocument();
        });

        test('renders tiles from tile history', () => {
            const mockTileHistory = [
                {
                    image: '/test/tile1.png',
                    text: 'Tile 1',
                    tileColor: 'yellow' as const,
                    sound: 'tile1',
                    rank: 1,
                },
                {
                    image: '/test/tile2.png',
                    text: 'Tile 2',
                    tileColor: 'blue' as const,
                    sound: 'tile2',
                    rank: 2,
                },
            ];

            mockUseUtteredTiles.mockReturnValue({
                tiles: [],
                tileHistory: mockTileHistory,
                clear: jest.fn(),
                addTile: jest.fn(),
                removeLastTile: jest.fn(),
            });

            render(<RecentlyClickedTiles />);

            expect(screen.getByTestId('recent-tile-Tile 1')).toBeInTheDocument();
            expect(screen.getByTestId('recent-tile-Tile 2')).toBeInTheDocument();
        });

        test('renders multiple tiles in correct order', () => {
            const mockTileHistory = [
                {
                    image: '/test/first.png',
                    text: 'First',
                    tileColor: 'red' as const,
                    sound: 'first',
                    rank: 1,
                },
                {
                    image: '/test/second.png',
                    text: 'Second',
                    tileColor: 'green' as const,
                    sound: 'second',
                    rank: 2,
                },
                {
                    image: '/test/third.png',
                    text: 'Third',
                    tileColor: 'purple' as const,
                    sound: 'third',
                    rank: 3,
                },
            ];

            mockUseUtteredTiles.mockReturnValue({
                tiles: [],
                tileHistory: mockTileHistory,
                clear: jest.fn(),
                addTile: jest.fn(),
                removeLastTile: jest.fn(),
            });

            render(<RecentlyClickedTiles />);

            const tiles = screen.getAllByTestId(/recent-tile-/);
            expect(tiles).toHaveLength(3);
            expect(tiles[0]).toHaveTextContent('First');
            expect(tiles[1]).toHaveTextContent('Second');
            expect(tiles[2]).toHaveTextContent('Third');
        });

        test('uses correct key for tiles', () => {
            const mockTileHistory = [
                {
                    image: '/test/tile.png',
                    text: 'Test',
                    tileColor: 'yellow' as const,
                    sound: 'test',
                    rank: 5,
                },
            ];

            mockUseUtteredTiles.mockReturnValue({
                tiles: [],
                tileHistory: mockTileHistory,
                clear: jest.fn(),
                addTile: jest.fn(),
                removeLastTile: jest.fn(),
            });

            render(<RecentlyClickedTiles />);

            expect(screen.getByTestId('recent-tile-Test')).toBeInTheDocument();
        });

        test('renders spacer div at the end', () => {
            mockUseUtteredTiles.mockReturnValue({
                tiles: [],
                tileHistory: [],
                clear: jest.fn(),
                addTile: jest.fn(),
                removeLastTile: jest.fn(),
            });

            const { container } = render(<RecentlyClickedTiles />);
            const spacer = container.querySelector('.w-44.h-1');
            expect(spacer).toBeInTheDocument();
        });
    });

    describe('Component Structure', () => {
        test('has correct container classes', () => {
            mockUseUtteredTiles.mockReturnValue({
                tiles: [],
                tileHistory: [],
                clear: jest.fn(),
                addTile: jest.fn(),
                removeLastTile: jest.fn(),
            });

            const { container } = render(<RecentlyClickedTiles />);
            const section = container.querySelector('section');
            
            expect(section).toHaveClass(
                'mr-3',
                'px-3',
                'pt-1',
                'pb-0',
                'mb-0',
                'border-black',
                'border-2',
                'rounded-md',
                'shadow-lg',
                'max-w-max',
                'overflow-y-scroll',
                'overflow-x-visible',
                'w-full'
            );
        });

        test('title has correct styling', () => {
            mockUseUtteredTiles.mockReturnValue({
                tiles: [],
                tileHistory: [],
                clear: jest.fn(),
                addTile: jest.fn(),
                removeLastTile: jest.fn(),
            });

            render(<RecentlyClickedTiles />);
            const title = screen.getByTestId(recentlyClickedTilesIds.title);
            
            expect(title).toHaveClass(
                'text-xl',
                'font-bold',
                'text-center',
                'mb-2',
                'border-b-2'
            );
        });

        test('tile container has correct flex classes', () => {
            mockUseUtteredTiles.mockReturnValue({
                tiles: [],
                tileHistory: [],
                clear: jest.fn(),
                addTile: jest.fn(),
                removeLastTile: jest.fn(),
            });

            render(<RecentlyClickedTiles />);
            const tileContainer = screen.getByTestId(recentlyClickedTilesIds.tileContainer);
            
            expect(tileContainer).toHaveClass(
                'flex',
                'flex-col',
                'gap-3',
                'items-center'
            );
        });
    });
});


