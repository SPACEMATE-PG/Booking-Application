"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface RatingMetadata {
    propertyId?: number;
    bookingId?: number;
}

interface RatingContextType {
    isOpen: boolean;
    actionName: string;
    metadata: RatingMetadata;
    showRating: (name: string, metadata?: RatingMetadata) => void;
    hideRating: () => void;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

export function RatingProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [actionName, setActionName] = useState("");
    const [metadata, setMetadata] = useState<RatingMetadata>({});

    const showRating = (name: string = "Action", meta: RatingMetadata = {}) => {
        setActionName(name);
        setMetadata(meta);
        setIsOpen(true);
    };

    const hideRating = () => {
        setIsOpen(false);
        setMetadata({});
    };

    return (
        <RatingContext.Provider value={{ isOpen, actionName, metadata, showRating, hideRating }}>
            {children}
        </RatingContext.Provider>
    );
}

export function useRating() {
    const context = useContext(RatingContext);
    if (context === undefined) {
        throw new Error("useRating must be used within a RatingProvider");
    }
    return context;
}
