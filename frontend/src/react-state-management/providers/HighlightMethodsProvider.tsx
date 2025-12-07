import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Context for highlight methods state
 */
interface HighlightMethodsContextType {
    activeHighlights: Set<string>;
    toggleHighlightMethod: (method: string) => void;
}

const HighlightMethodsContext = createContext<HighlightMethodsContextType | undefined>(undefined);

export const useHighlightMethods = () => {
    const context = useContext(HighlightMethodsContext);
    if (!context) {
        throw new Error('useHighlightMethods must be used within a HighlightMethodsProvider');
    }
    return context;
};

export type HighlightMethodsProviderProps = { children: ReactNode };

/**
 * Provider component for highlight methods context
 * Allows sharing highlight methods state between components
 */
export default function HighlightMethodsProvider({ children }: HighlightMethodsProviderProps) {
    const [activeHighlights, setActiveHighlights] = useState<Set<string>>(new Set(['opacity']));

    const toggleHighlightMethod = React.useCallback((method: string) => {
        setActiveHighlights((prev) => {
            const updated = new Set(prev);
            if (updated.has(method)) {
                updated.delete(method);
            } else {
                updated.add(method);
            }
            return updated;
        });
    }, []);

    return (
        <HighlightMethodsContext.Provider value={{ activeHighlights, toggleHighlightMethod }}>
            {children}
        </HighlightMethodsContext.Provider>
    );
}

