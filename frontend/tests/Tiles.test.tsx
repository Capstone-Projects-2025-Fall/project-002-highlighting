import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tiles, { BACK_BTN_TEXT, TilesTestIds } from 'frontend/src/components/AAC/Tiles';
import { TileAssets } from 'frontend/src/components/AAC/TileTypes';

// Mock the providers using absolute paths
jest.mock('frontend/src/react-state-management/providers/tileProvider', () => ({
    useTilesProvider: jest.fn(),
    __esModule: true,
    default: ({ children }: any) => <>{children}</>,
}));

jest.mock('frontend/src/react-state-management/providers/PredictedTilesProvider', () => ({
    usePredictedTiles: jest.fn(),
    __esModule: true,
    default: ({ children }: any) => <>{children}</>,
}));

jest.mock('frontend/src/react-state-management/providers/HighlightMethodsProvider', () => ({
    useHighlightMethods: jest.fn(),
}));

jest.mock('frontend/src/react-state-management/providers/RecordingControlProvider', () => ({
    useRecordingControl: jest.fn(),
}));

// Import after mocking
import { useTilesProvider } from 'frontend/src/react-state-management/providers/tileProvider';
import { usePredictedTiles } from 'frontend/src/react-state-management/providers/PredictedTilesProvider';
import { useHighlightMethods } from 'frontend/src/react-state-management/providers/HighlightMethodsProvider';
import { useRecordingControl } from 'frontend/src/react-state-management/providers/RecordingControlProvider';
import TileProvider from 'frontend/src/react-state-management/providers/tileProvider';
import PredictedTilesProvider from 'frontend/src/react-state-management/providers/PredictedTilesProvider';

const mockUseTilesProvider = useTilesProvider as jest.MockedFunction<typeof useTilesProvider>;
const mockUsePredictedTiles = usePredictedTiles as jest.MockedFunction<typeof usePredictedTiles>;
const mockUseHighlightMethods = useHighlightMethods as jest.MockedFunction<typeof useHighlightMethods>;
const mockUseRecordingControl = useRecordingControl as jest.MockedFunction<typeof useRecordingControl>;

// Mock the Tile component
jest.mock('frontend/src/components/AAC/Tile', () => {
    return function MockTile({ text, opacity, hasSubTiles }: any) {
        return (
            <div 
                data-testid={`tile-${text}`}
                data-opacity={opacity}
                data-has-subtiles={hasSubTiles}
            >
                {text}
            </div>
        );
    };
});

// Mock Speech utility
jest.mock('frontend/src/util/AAC/Speech', () => ({
    speak: jest.fn(),
}));

describe('Tiles Component', () => {
    const mockTiles: TileAssets = {
        i: {
            image: '/test/i.png',
            text: 'I',
            sound: 'I',
            tileColor: 'blue',
        },
        you: {
            image: '/test/you.png',
            text: 'You',
            sound: 'You',
            tileColor: 'green',
        },
        good: {
            image: '/test/good.png',
            text: 'Good',
            sound: 'Good',
            tileColor: 'green',
        },
        colors: {
            image: '/test/colors.png',
            text: 'Colors',
            sound: 'Colors',
            tileColor: 'yellow',
            subTiles: {
                red: {
                    image: '/test/red.png',
                    text: 'Red',
                    sound: 'Red',
                    tileColor: 'red',
                },
                blue: {
                    image: '/test/blue.png',
                    text: 'Blue',
                    sound: 'Blue',
                    tileColor: 'blue',
                },
            },
        },
        shapes: {
            image: '/test/shapes.png',
            text: 'Shapes',
            sound: 'Shapes',
            tileColor: 'purple',
            subTiles: {
                circle: {
                    image: '/test/circle.png',
                    text: 'Circle',
                    sound: 'Circle',
                    tileColor: 'yellow',
                },
            },
        },
        eat: {
            image: '/test/eat.png',
            text: 'Eat',
            sound: 'Eat',
            tileColor: 'orange',
        },
        taste: {
            image: '/test/taste.png',
            text: 'Taste',
            sound: 'Taste',
            tileColor: 'orange',
        },
        taco: {
            image: '/test/taco.png',
            text: 'Taco',
            sound: 'Taco',
            tileColor: 'yellow',
        },
    };

    const mockSetPredictedTiles = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockUseTilesProvider.mockReturnValue({
            tiles: mockTiles,
            flatList: {},
            customTiles: [],
            triggerRefreshCustomTiles: jest.fn(),
        });

        mockUsePredictedTiles.mockReturnValue({
            predictedTiles: [],
            setPredictedTiles: mockSetPredictedTiles,
        });

        mockUseHighlightMethods.mockReturnValue({
            activeHighlights: new Set(['opacity']),
            toggleHighlightMethod: jest.fn(),
        });

        mockUseRecordingControl.mockReturnValue({
            isActive: true,
            setIsActive: jest.fn(),
        });
    });

    describe('Basic Rendering', () => {
        test('renders without crashing', () => {
            render(<Tiles />);
            expect(screen.getByTestId(TilesTestIds.mainContainer)).toBeInTheDocument();
        });

        test('renders tiles in root view', () => {
            render(<Tiles />);
            
            expect(screen.getByTestId('tile-I')).toBeInTheDocument();
            expect(screen.getByTestId('tile-You')).toBeInTheDocument();
        });

        test('does not show back button in root view', () => {
            render(<Tiles />);
            
            expect(screen.queryByText(BACK_BTN_TEXT)).not.toBeInTheDocument();
        });
    });

    describe('Tile Ordering - Root View', () => {
        test('orders tiles according to ROOT_LAYOUT_COLUMN_KEYS in root view', () => {
            const rootTiles: TileAssets = {
                self: {
                    image: '/test/self.png',
                    text: 'Self',
                    sound: 'Self',
                    tileColor: 'blue',
                },
                you: {
                    image: '/test/you.png',
                    text: 'You',
                    sound: 'You',
                    tileColor: 'green',
                },
                they: {
                    image: '/test/they.png',
                    text: 'They',
                    sound: 'They',
                    tileColor: 'blue',
                },
                good: {
                    image: '/test/good.png',
                    text: 'Good',
                    sound: 'Good',
                    tileColor: 'green',
                },
                bad: {
                    image: '/test/bad.png',
                    text: 'Bad',
                    sound: 'Bad',
                    tileColor: 'red',
                },
                stop: {
                    image: '/test/stop.png',
                    text: 'Stop',
                    sound: 'Stop',
                    tileColor: 'red',
                },
            };

            mockUseTilesProvider.mockReturnValue({
                tiles: rootTiles,
                flatList: {},
                customTiles: [],
                triggerRefreshCustomTiles: jest.fn(),
            });

            render(<Tiles />);

            const tiles = screen.getAllByTestId(/^tile-/);
            const tileTexts = tiles.map((t: any) => t.textContent);
            
            // Should follow root layout order (column-major: first column first, then second column, etc.)
            // ROOT_LAYOUT_COLUMN_KEYS: [["self", "you", "they"], ["good", "bad", "stop"], ...]
            // So order should be: Self, Good, You, Bad, They, Stop (column-major)
            expect(tileTexts).toContain('Self');
            expect(tileTexts).toContain('You');
            expect(tileTexts).toContain('They');
            expect(tileTexts).toContain('Good');
            expect(tileTexts).toContain('Bad');
            expect(tileTexts).toContain('Stop');
            // Check that Self comes before Good (first row of first column before first row of second column)
            const selfIndex = tileTexts.indexOf('Self');
            const goodIndex = tileTexts.indexOf('Good');
            expect(selfIndex).toBeLessThan(goodIndex);
        });
    });

    describe('Tile Ordering - Non-Root View', () => {
        test('prioritizes pronouns first in non-root view', () => {
            const nonRootTiles: TileAssets = {
                i: {
                    image: '/test/i.png',
                    text: 'I',
                    sound: 'I',
                    tileColor: 'blue',
                },
                you: {
                    image: '/test/you.png',
                    text: 'You',
                    sound: 'You',
                    tileColor: 'green',
                },
                random: {
                    image: '/test/random.png',
                    text: 'Random',
                    sound: 'Random',
                    tileColor: 'purple',
                },
            };

            mockUseTilesProvider.mockReturnValue({
                tiles: { colors: { ...mockTiles.colors, subTiles: nonRootTiles } },
                flatList: {},
                customTiles: [],
                triggerRefreshCustomTiles: jest.fn(),
            });

            const { container } = render(
                <TileProvider>
                    <PredictedTilesProvider>
                        <Tiles />
                    </PredictedTilesProvider>
                </TileProvider>
            );

            // Click colors to navigate to subTiles
            const colorsTile = screen.getByTestId('tile-Colors');
            fireEvent.click(colorsTile);

            waitFor(() => {
                const tiles = screen.getAllByTestId(/^tile-/);
                const tileTexts = tiles.map((t: any) => t.textContent);
                // Pronouns should come first
                expect(tileTexts).toContain('I');
                expect(tileTexts).toContain('You');
                const iIndex = tileTexts.indexOf('I');
                const youIndex = tileTexts.indexOf('You');
                const randomIndex = tileTexts.indexOf('Random');
                expect(iIndex).toBeLessThan(randomIndex);
                expect(youIndex).toBeLessThan(randomIndex);
            });
        });

        test('prioritizes non-folder priority words (good, bad, stop) after pronouns', () => {
            const nonRootTiles: TileAssets = {
                good: {
                    image: '/test/good.png',
                    text: 'Good',
                    sound: 'Good',
                    tileColor: 'green',
                },
                random: {
                    image: '/test/random.png',
                    text: 'Random',
                    sound: 'Random',
                    tileColor: 'purple',
                },
                bad: {
                    image: '/test/bad.png',
                    text: 'Bad',
                    sound: 'Bad',
                    tileColor: 'red',
                },
            };

            mockUseTilesProvider.mockReturnValue({
                tiles: { colors: { ...mockTiles.colors, subTiles: nonRootTiles } },
                flatList: {},
                customTiles: [],
                triggerRefreshCustomTiles: jest.fn(),
            });

            render(<Tiles />);

            const colorsTile = screen.getByTestId('tile-Colors');
            fireEvent.click(colorsTile);

            waitFor(() => {
                const tiles = screen.getAllByTestId(/^tile-/);
                const tileTexts = tiles.map((t: any) => t.textContent);
                // Good should come before Random
                const goodIndex = tileTexts.indexOf('Good');
                const randomIndex = tileTexts.indexOf('Random');
                expect(goodIndex).toBeLessThan(randomIndex);
            });
        });

        test('prioritizes special folder keys (shapes) after first non-folder', () => {
            const nonRootTiles: TileAssets = {
                good: {
                    image: '/test/good.png',
                    text: 'Good',
                    sound: 'Good',
                    tileColor: 'green',
                },
                shapes: {
                    image: '/test/shapes.png',
                    text: 'Shapes',
                    sound: 'Shapes',
                    tileColor: 'purple',
                    subTiles: {},
                },
                random: {
                    image: '/test/random.png',
                    text: 'Random',
                    sound: 'Random',
                    tileColor: 'blue',
                },
            };

            mockUseTilesProvider.mockReturnValue({
                tiles: { colors: { ...mockTiles.colors, subTiles: nonRootTiles } },
                flatList: {},
                customTiles: [],
                triggerRefreshCustomTiles: jest.fn(),
            });

            render(<Tiles />);

            const colorsTile = screen.getByTestId('tile-Colors');
            fireEvent.click(colorsTile);

            waitFor(() => {
                const tiles = screen.getAllByTestId(/^tile-/);
                const tileTexts = tiles.map((t: any) => t.textContent);
                // Shapes should come after Good but before Random
                const goodIndex = tileTexts.indexOf('Good');
                const shapesIndex = tileTexts.indexOf('Shapes');
                const randomIndex = tileTexts.indexOf('Random');
                expect(shapesIndex).toBeGreaterThan(goodIndex);
                expect(shapesIndex).toBeLessThan(randomIndex);
            });
        });
    });

    describe('Navigation', () => {
        test('shows back button when not in root view', () => {
            render(<Tiles />);

            const colorsTile = screen.getByTestId('tile-Colors');
            fireEvent.click(colorsTile);

            waitFor(() => {
                expect(screen.getByText(BACK_BTN_TEXT)).toBeInTheDocument();
            });
        });

        test('navigates to subtiles when clicking a tile with subtiles', () => {
            render(<Tiles />);

            const colorsTile = screen.getByTestId('tile-Colors');
            fireEvent.click(colorsTile);

            waitFor(() => {
                expect(screen.getByTestId('tile-Red')).toBeInTheDocument();
                expect(screen.getByTestId('tile-Blue')).toBeInTheDocument();
            });
        });

        test('navigates back when clicking back button', () => {
            render(<Tiles />);

            // Navigate into subtiles
            const colorsTile = screen.getByTestId('tile-Colors');
            fireEvent.click(colorsTile);

            waitFor(() => {
                expect(screen.getByTestId('tile-Red')).toBeInTheDocument();
            });

            // Click back button
            const backButton = screen.getByText(BACK_BTN_TEXT);
            fireEvent.click(backButton);

            waitFor(() => {
                expect(screen.queryByTestId('tile-Red')).not.toBeInTheDocument();
                expect(screen.getByTestId('tile-Colors')).toBeInTheDocument();
            });
        });
    });

    describe('Predicted Tiles Highlighting', () => {
        test('highlights predicted tiles at 100% opacity', () => {
            mockUsePredictedTiles.mockReturnValue({
                predictedTiles: ['I', 'You'],
                setPredictedTiles: mockSetPredictedTiles,
            });

            render(<Tiles />);

            const iTile = screen.getByTestId('tile-I');
            const youTile = screen.getByTestId('tile-You');
            const goodTile = screen.getByTestId('tile-Good');

            expect(iTile).toHaveAttribute('data-opacity', '100');
            expect(youTile).toHaveAttribute('data-opacity', '100');
            expect(goodTile).toHaveAttribute('data-opacity', '50');
        });

        test('highlights non-predicted tiles at 50% opacity when predictions exist', () => {
            mockUsePredictedTiles.mockReturnValue({
                predictedTiles: ['I'],
                setPredictedTiles: mockSetPredictedTiles,
            });

            render(<Tiles />);

            const goodTile = screen.getByTestId('tile-Good');
            expect(goodTile).toHaveAttribute('data-opacity', '50');
        });

        test('uses default opacity when no predictions exist', () => {
            mockUsePredictedTiles.mockReturnValue({
                predictedTiles: [],
                setPredictedTiles: mockSetPredictedTiles,
            });

            render(<Tiles />);

            const iTile = screen.getByTestId('tile-I');
            // Default opacity should be 100 when no predictions and opacity method is active
            expect(iTile).toHaveAttribute('data-opacity', '100');
        });

        test('highlights parent tile when subtile is predicted', () => {
            mockUsePredictedTiles.mockReturnValue({
                predictedTiles: ['Red'],
                setPredictedTiles: mockSetPredictedTiles,
            });

            render(<Tiles />);

            const colorsTile = screen.getByTestId('tile-Colors');
            expect(colorsTile).toHaveAttribute('data-opacity', '100');
        });

        test('recursively checks subtiles for predictions', () => {
            const nestedTiles: TileAssets = {
                level1: {
                    image: '/test/level1.png',
                    text: 'Level1',
                    sound: 'Level1',
                    tileColor: 'blue',
                    subTiles: {
                        level2: {
                            image: '/test/level2.png',
                            text: 'Level2',
                            sound: 'Level2',
                            tileColor: 'green',
                            subTiles: {
                                level3: {
                                    image: '/test/level3.png',
                                    text: 'Level3',
                                    sound: 'Level3',
                                    tileColor: 'red',
                                },
                            },
                        },
                    },
                },
            };

            mockUseTilesProvider.mockReturnValue({
                tiles: nestedTiles,
                flatList: {},
                customTiles: [],
                triggerRefreshCustomTiles: jest.fn(),
            });

            mockUsePredictedTiles.mockReturnValue({
                predictedTiles: ['Level3'],
                setPredictedTiles: mockSetPredictedTiles,
            });

            render(<Tiles />);

            const level1Tile = screen.getByTestId('tile-Level1');
            expect(level1Tile).toHaveAttribute('data-opacity', '100');
        });

        test('case-insensitive matching for predicted tiles', () => {
            mockUsePredictedTiles.mockReturnValue({
                predictedTiles: ['i', 'GOOD'],
                setPredictedTiles: mockSetPredictedTiles,
            });

            render(<Tiles />);

            const iTile = screen.getByTestId('tile-I');
            const goodTile = screen.getByTestId('tile-Good');

            expect(iTile).toHaveAttribute('data-opacity', '100');
            expect(goodTile).toHaveAttribute('data-opacity', '100');
        });
    });

    // Taco mode tests removed - taco mode functionality has been removed from the component

    // Opacity controls tests removed - opacity controls UI has been removed from the component

    describe('Edge Cases', () => {
        test('handles empty tiles object', () => {
            mockUseTilesProvider.mockReturnValue({
                tiles: {},
                flatList: {},
                customTiles: [],
                triggerRefreshCustomTiles: jest.fn(),
            });

            render(<Tiles />);

            expect(screen.getByTestId(TilesTestIds.mainContainer)).toBeInTheDocument();
        });

        test('handles tiles with no subtiles when navigating', () => {
            render(<Tiles />);

            // Click a tile without subtiles should not cause navigation
            const goodTile = screen.getByTestId('tile-Good');
            fireEvent.click(goodTile);

            // Should still be in root view
            expect(screen.queryByText(BACK_BTN_TEXT)).not.toBeInTheDocument();
        });

        test('handles multiple nested navigation levels', () => {
            const deeplyNestedTiles: TileAssets = {
                level1: {
                    image: '/test/level1.png',
                    text: 'Level1',
                    sound: 'Level1',
                    tileColor: 'blue',
                    subTiles: {
                        level2: {
                            image: '/test/level2.png',
                            text: 'Level2',
                            sound: 'Level2',
                            tileColor: 'green',
                            subTiles: {
                                level3: {
                                    image: '/test/level3.png',
                                    text: 'Level3',
                                    sound: 'Level3',
                                    tileColor: 'red',
                                },
                            },
                        },
                    },
                },
            };

            mockUseTilesProvider.mockReturnValue({
                tiles: deeplyNestedTiles,
                flatList: {},
                customTiles: [],
                triggerRefreshCustomTiles: jest.fn(),
            });

            render(<Tiles />);

            // Navigate to level 2
            const level1Tile = screen.getByTestId('tile-Level1');
            fireEvent.click(level1Tile);

            waitFor(() => {
                const level2Tile = screen.getByTestId('tile-Level2');
                fireEvent.click(level2Tile);
            });

            waitFor(() => {
                expect(screen.getByTestId('tile-Level3')).toBeInTheDocument();
                expect(screen.getByText(BACK_BTN_TEXT)).toBeInTheDocument();
            });
        });

        test('handles predicted tiles with special characters', () => {
            mockUsePredictedTiles.mockReturnValue({
                predictedTiles: ['I', 'You & Me'],
                setPredictedTiles: mockSetPredictedTiles,
            });

            render(<Tiles />);

            const iTile = screen.getByTestId('tile-I');
            expect(iTile).toHaveAttribute('data-opacity', '100');
        });
    });

    describe('Column-Major Layout', () => {
        test('arranges tiles in column-major order for non-root views', () => {
            const manyTiles: TileAssets = {
                tile1: { image: '/test/1.png', text: 'Tile1', sound: '1', tileColor: 'blue' },
                tile2: { image: '/test/2.png', text: 'Tile2', sound: '2', tileColor: 'green' },
                tile3: { image: '/test/3.png', text: 'Tile3', sound: '3', tileColor: 'red' },
                tile4: { image: '/test/4.png', text: 'Tile4', sound: '4', tileColor: 'yellow' },
                tile5: { image: '/test/5.png', text: 'Tile5', sound: '5', tileColor: 'orange' },
                tile6: { image: '/test/6.png', text: 'Tile6', sound: '6', tileColor: 'purple' },
                tile7: { image: '/test/7.png', text: 'Tile7', sound: '7', tileColor: 'blue' },
                tile8: { image: '/test/8.png', text: 'Tile8', sound: '8', tileColor: 'green' },
                tile9: { image: '/test/9.png', text: 'Tile9', sound: '9', tileColor: 'red' },
            };

            mockUseTilesProvider.mockReturnValue({
                tiles: { folder: { image: '/test/folder.png', text: 'Folder', sound: 'Folder', tileColor: 'blue', subTiles: manyTiles } },
                flatList: {},
                customTiles: [],
                triggerRefreshCustomTiles: jest.fn(),
            });

            render(<Tiles />);

            const folderTile = screen.getByTestId('tile-Folder');
            fireEvent.click(folderTile);

            waitFor(() => {
                const tiles = screen.getAllByTestId(/^tile-/);
                // Should have all 9 tiles plus back button
                expect(tiles.length).toBeGreaterThanOrEqual(10); // 9 tiles + back button
            });
        });
    });
});

