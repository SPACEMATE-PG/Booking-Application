import React from "react";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyTierBadgeProps {
    price?: number;
    className?: string;
}

export const getTier = (price?: number) => {
    if (!price) return "Basic";
    if (price >= 15000) return "Premium";
    if (price >= 8000) return "Standard";
    return "Basic";
};

export const PropertyTierBadge = ({ price, className }: PropertyTierBadgeProps) => {
    const tier = getTier(price);

    if (tier === "Premium") {
        return (
            <Badge
                variant="secondary"
                className={cn("bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 gap-1", className)}
            >
                <Crown className="w-3 h-3 fill-amber-700" />
                Premium
            </Badge>
        );
    }

    if (tier === "Standard") {
        return (
            <Badge
                variant="secondary"
                className={cn("bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 gap-1", className)}
            >
                <Star className="w-3 h-3 fill-blue-700" />
                Standard
            </Badge>
        );
    }

    return (
        <Badge
            variant="secondary"
            className={cn("bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100 gap-1", className)}
        >
            <Shield className="w-3 h-3 fill-gray-700" />
            Basic
        </Badge>
    );
};
