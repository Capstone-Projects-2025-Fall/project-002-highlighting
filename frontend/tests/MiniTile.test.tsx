import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MiniTile from 'frontend/src/components/AAC/MiniTile';

// Mock Next.js Image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt, ...props }: any) => (
        <img src={src} alt={alt} {...props} />
    ),
}));

describe('MiniTile Component', () => {
    describe('Rendering', () => {
        test('renders mini tile with image and text', () => {
            render(
                <MiniTile
                    image="/test/image.png"
                    text="Mini Tile"
                />
            );

            expect(screen.getByTestId('mini-tile-container-Mini Tile')).toBeInTheDocument();
            expect(screen.getByTestId('mini-tile-text')).toHaveTextContent('Mini Tile');
            expect(screen.getByTestId('mini-tile-image')).toHaveAttribute('src', '/test/image.png');
            expect(screen.getByTestId('mini-tile-image')).toHaveAttribute('alt', 'Mini Tile');
        });

        test('renders with different text', () => {
            render(
                <MiniTile
                    image="/test/another.png"
                    text="Another Tile"
                />
            );

            expect(screen.getByTestId('mini-tile-container-Another Tile')).toBeInTheDocument();
            expect(screen.getByTestId('mini-tile-text')).toHaveTextContent('Another Tile');
        });

        test('renders with different image', () => {
            render(
                <MiniTile
                    image="/test/different.png"
                    text="Test"
                />
            );

            expect(screen.getByTestId('mini-tile-image')).toHaveAttribute('src', '/test/different.png');
        });

        test('has correct CSS classes', () => {
            const { container } = render(
                <MiniTile
                    image="/test.png"
                    text="Test"
                />
            );

            const miniTile = container.firstChild as HTMLElement;
            expect(miniTile).toHaveClass('bg-white', 'flex', 'flex-col', 'justify-center', 'items-center');
        });

        test('image has correct styling classes', () => {
            render(
                <MiniTile
                    image="/test.png"
                    text="Test"
                />
            );

            const image = screen.getByTestId('mini-tile-image');
            expect(image).toHaveClass('w-auto', 'h-10', 'object-cover');
        });

        test('text has correct styling classes', () => {
            render(
                <MiniTile
                    image="/test.png"
                    text="Test"
                />
            );

            const text = screen.getByTestId('mini-tile-text');
            expect(text).toHaveClass('font-bold', 'text-base');
        });
    });

    describe('Accessibility', () => {
        test('image has alt text matching tile text', () => {
            render(
                <MiniTile
                    image="/test.png"
                    text="Accessible Tile"
                />
            );

            expect(screen.getByTestId('mini-tile-image')).toHaveAttribute('alt', 'Accessible Tile');
        });
    });
});


