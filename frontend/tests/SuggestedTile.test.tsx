import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuggestedTiles, { getSimilarWords } from 'frontend/src/components/AAC/SuggestedTile';

// Mock the SuggestedTilesProvider
jest.mock('frontend/src/react-state-management/providers/SuggestedTilesProvider', () => ({
    useSuggestedTilesContext: jest.fn(),
}));

// Mock the Tile component
jest.mock('frontend/src/components/AAC/Tile', () => ({
    __esModule: true,
    default: ({ text, image, tileColor, sound }: any) => (
        <div data-testid={`suggested-tile-${text}`}>
            {text} - {image} - {tileColor} - {sound}
        </div>
    ),
}));

// Import after mocking
import { useSuggestedTilesContext } from 'frontend/src/react-state-management/providers/SuggestedTilesProvider';

const mockUseSuggestedTilesContext = useSuggestedTilesContext as jest.MockedFunction<typeof useSuggestedTilesContext>;

// Mock fetch globally
global.fetch = jest.fn();

describe('SuggestedTiles Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        test('renders title', () => {
            mockUseSuggestedTilesContext.mockReturnValue({
                tiles: [],
            });

            render(<SuggestedTiles />);
            expect(screen.getByText('Suggested Tiles')).toBeInTheDocument();
        });

        test('renders empty state when no tiles', () => {
            mockUseSuggestedTilesContext.mockReturnValue({
                tiles: [],
            });

            render(<SuggestedTiles />);
            const container = screen.getByTestId('tiles-container');
            expect(container).toBeEmptyDOMElement();
        });

        test('renders suggested tiles', () => {
            const mockTiles = [
                {
                    image: '/test/tile1.png',
                    text: 'Tile1',
                    tileColor: 'yellow' as const,
                    sound: 'tile1',
                },
                {
                    image: '/test/tile2.png',
                    text: 'Tile2',
                    tileColor: 'blue' as const,
                    sound: 'tile2',
                },
            ];

            mockUseSuggestedTilesContext.mockReturnValue({
                tiles: mockTiles,
            });

            render(<SuggestedTiles />);
            expect(screen.getByTestId('suggested-tile-Tile1')).toBeInTheDocument();
            expect(screen.getByTestId('suggested-tile-Tile2')).toBeInTheDocument();
        });

        test('renders multiple tiles in grid', () => {
            const mockTiles = Array.from({ length: 6 }, (_, i) => ({
                image: `/test/tile${i}.png`,
                text: `Tile${i}`,
                tileColor: 'yellow' as const,
                sound: `tile${i}`,
            }));

            mockUseSuggestedTilesContext.mockReturnValue({
                tiles: mockTiles,
            });

            render(<SuggestedTiles />);
            const tiles = screen.getAllByTestId(/suggested-tile-/);
            expect(tiles).toHaveLength(6);
        });

        test('has correct container classes', () => {
            mockUseSuggestedTilesContext.mockReturnValue({
                tiles: [],
            });

            render(<SuggestedTiles />);
            const container = screen.getByTestId('tiles-container');
            expect(container).toHaveClass('grid', 'grid-cols-6', 'gap-6');
        });

        test('title has correct styling', () => {
            mockUseSuggestedTilesContext.mockReturnValue({
                tiles: [],
            });

            render(<SuggestedTiles />);
            const title = screen.getByText('Suggested Tiles');
            expect(title).toHaveClass('font-bold', 'text-xl');
        });
    });

    describe('getSimilarWords Function', () => {
        beforeEach(() => {
            (global.fetch as jest.Mock).mockClear();
        });

        test('fetches similar words from backend', async () => {
            const mockResponse = {
                suggestions: ['word1', 'word2', 'word3', 'word4', 'word5'],
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const inputWords = ['hello'];
            const result = await getSimilarWords(inputWords);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/similarity'),
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ words: inputWords }),
                })
            );

            // Should include input word plus 4 suggestions
            expect(result).toEqual(['hello', 'word1', 'word2', 'word3', 'word4']);
        });

        test('uses production URL when NEXT_PUBLIC_PROG_MODE is PROD', async () => {
            const originalEnv = process.env.NEXT_PUBLIC_PROG_MODE;
            process.env.NEXT_PUBLIC_PROG_MODE = 'PROD';
            process.env.NEXT_PUBLIC_BACKEND_URL_PROD = 'https://prod.example.com';

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ suggestions: [] }),
            });

            await getSimilarWords(['test']);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('https://prod.example.com'),
                expect.any(Object)
            );

            process.env.NEXT_PUBLIC_PROG_MODE = originalEnv;
        });

        test('uses dev URL when NEXT_PUBLIC_PROG_MODE is not PROD', async () => {
            const originalEnv = process.env.NEXT_PUBLIC_PROG_MODE;
            process.env.NEXT_PUBLIC_PROG_MODE = 'DEV';
            process.env.NEXT_PUBLIC_BACKEND_URL_DEV = 'https://dev.example.com';

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ suggestions: [] }),
            });

            await getSimilarWords(['test']);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('https://dev.example.com'),
                expect.any(Object)
            );

            process.env.NEXT_PUBLIC_PROG_MODE = originalEnv;
        });

        test('handles empty suggestions array', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ suggestions: [] }),
            });

            const result = await getSimilarWords(['hello']);

            expect(result).toEqual(['hello']);
        });

        test('handles multiple input words', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    suggestions: ['sug1', 'sug2', 'sug3', 'sug4'],
                }),
            });

            const result = await getSimilarWords(['word1', 'word2']);

            expect(result).toEqual(['word1', 'word2', 'sug1', 'sug2', 'sug3']);
        });

        test('limits to 5 total words (input + 4 suggestions)', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    suggestions: ['sug1', 'sug2', 'sug3', 'sug4', 'sug5', 'sug6'],
                }),
            });

            const result = await getSimilarWords(['word1']);

            expect(result).toHaveLength(5);
            expect(result).toEqual(['word1', 'sug1', 'sug2', 'sug3', 'sug4']);
        });
    });

    describe('Component Structure', () => {
        test('renders section wrapper', () => {
            mockUseSuggestedTilesContext.mockReturnValue({
                tiles: [],
            });

            const { container } = render(<SuggestedTiles />);
            const section = container.querySelector('section');
            expect(section).toBeInTheDocument();
        });

        test('uses correct key for tiles', () => {
            const mockTiles = [
                {
                    image: '/test.png',
                    text: 'Test',
                    tileColor: 'yellow' as const,
                    sound: 'test',
                },
            ];

            mockUseSuggestedTilesContext.mockReturnValue({
                tiles: mockTiles,
            });

            render(<SuggestedTiles />);
            expect(screen.getByTestId('suggested-tile-Test')).toBeInTheDocument();
        });
    });
});


