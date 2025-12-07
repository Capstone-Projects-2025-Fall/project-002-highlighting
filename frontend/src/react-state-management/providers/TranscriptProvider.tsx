import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Context for transcript text from audio transcription
 */
interface TranscriptContextType {
    transcript: string;
    setTranscript: (transcript: string | ((prev: string) => string)) => void;
}

const TranscriptContext = createContext<TranscriptContextType | undefined>(undefined);

export const useTranscript = () => {
    const context = useContext(TranscriptContext);
    if (!context) {
        throw new Error('useTranscript must be used within a TranscriptProvider');
    }
    return context;
};

export type TranscriptProviderProps = { children: ReactNode };

/**
 * Provider component for transcript context
 * Allows sharing transcript state between components
 */
export default function TranscriptProvider({ children }: TranscriptProviderProps) {
    const [transcript, setTranscriptState] = useState<string>('');

    const setTranscript = React.useCallback((value: string | ((prev: string) => string)) => {
        if (typeof value === 'function') {
            setTranscriptState(value);
        } else {
            setTranscriptState(value);
        }
    }, []);

    return (
        <TranscriptContext.Provider value={{ transcript, setTranscript }}>
            {children}
        </TranscriptContext.Provider>
    );
}

