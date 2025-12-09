import React from "react";
import { FaMale, FaFemale } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface GenderIconProps {
    type: string;
    className?: string;
}

export const GenderIcon = ({ type, className }: GenderIconProps) => {
    const normalizedType = type?.toLowerCase() || "unisex";

    if (normalizedType === "male") {
        return <FaMale className={cn("w-5 h-5", className)} />;
    }

    if (normalizedType === "female") {
        return <FaFemale className={cn("w-5 h-5", className)} />;
    }

    if (normalizedType === "unisex") {
        return (
            <div className={cn("flex items-center justify-center gap-0.5", className)}>
                <FaMale className="w-4 h-4" />
                <span className="text-xs font-bold">|</span>
                <FaFemale className="w-4 h-4" />
            </div>
        );
    }

    return null;
};
