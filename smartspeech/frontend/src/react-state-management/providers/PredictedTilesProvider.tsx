import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Context for predicted tiles from the AI model
 */
interface PredictedTilesContextType {
    predictedTiles: string[];
    setPredictedTiles: (tiles: string[]) => void;
}

const PredictedTilesContext = createContext<PredictedTilesContextType | undefined>(undefined);

export const usePredictedTiles = () => {
    const context = useContext(PredictedTilesContext);
    if (!context) {
        throw new Error('usePredictedTiles must be used within a PredictedTilesProvider');
    }
    return context;
};

export type PredictedTilesProviderProps = { children: ReactNode };

/**
 * Provider component for predicted tiles context
 * Allows sharing predicted tiles state between components
 */
export default function PredictedTilesProvider({ children }: PredictedTilesProviderProps) {
    const [predictedTiles, setPredictedTiles] = useState<string[]>([]);

    return (
        <PredictedTilesContext.Provider value={{ predictedTiles, setPredictedTiles }}>
            {children}
        </PredictedTilesContext.Provider>
    );
}

