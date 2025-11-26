"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface RatingContextType {
    isOpen: boolean;
    actionName: string;
    showRating: (actionName?: string) => void;
    hideRating: () => void;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

export function RatingProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [actionName, setActionName] = useState("");

    const showRating = (name: string = "Action") => {
        setActionName(name);
        setIsOpen(true);
    };

    const hideRating = () => {
        setIsOpen(false);
    };

    return (
        <RatingContext.Provider value={{ isOpen, actionName, showRating, hideRating }}>
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
