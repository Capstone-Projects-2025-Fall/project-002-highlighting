import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Context for controlling recording and prediction state
 */
interface RecordingControlContextType {
    isActive: boolean;
    setIsActive: (active: boolean) => void;
}

const RecordingControlContext = createContext<RecordingControlContextType | undefined>(undefined);

export const useRecordingControl = () => {
    const context = useContext(RecordingControlContext);
    if (!context) {
        throw new Error('useRecordingControl must be used within a RecordingControlProvider');
    }
    return context;
};

export type RecordingControlProviderProps = { children: ReactNode };

/**
 * Provider component for recording control context
 * Controls whether recording and prediction are active
 * Starts as active by default
 */
export default function RecordingControlProvider({ children }: RecordingControlProviderProps) {
    const [isActive, setIsActive] = useState<boolean>(true); // Start as active

    return (
        <RecordingControlContext.Provider value={{ isActive, setIsActive }}>
            {children}
        </RecordingControlContext.Provider>
    );
}

