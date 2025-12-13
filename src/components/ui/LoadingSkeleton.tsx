"use client";

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
    className?: string;
    variant?: "card" | "text" | "circle" | "rectangle";
    count?: number;
}

export function LoadingSkeleton({
    className,
    variant = "rectangle",
    count = 1
}: LoadingSkeletonProps) {
    const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:200%_100%]";

    const variantClasses = {
        card: "rounded-2xl h-80 w-full",
        text: "rounded h-4 w-full",
        circle: "rounded-full h-12 w-12",
        rectangle: "rounded-lg h-48 w-full"
    };

    const skeletons = Array.from({ length: count }, (_, i) => (
        <div
            key={i}
            className={cn(
                baseClasses,
                variantClasses[variant],
                className
            )}
            style={{
                animation: "shimmer 2s infinite linear",
            }}
        />
    ));

    return count > 1 ? <>{skeletons}</> : skeletons[0];
}

// Property Card Skeleton
export function PropertyCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <LoadingSkeleton variant="rectangle" className="h-64" />
            <div className="p-5 space-y-4">
                <div className="space-y-2">
                    <LoadingSkeleton variant="text" className="h-6 w-3/4" />
                    <LoadingSkeleton variant="text" className="h-4 w-1/2" />
                </div>
                <div className="flex gap-2">
                    <LoadingSkeleton variant="rectangle" className="h-8 w-20" />
                    <LoadingSkeleton variant="rectangle" className="h-8 w-20" />
                    <LoadingSkeleton variant="rectangle" className="h-8 w-20" />
                </div>
                <div className="h-px bg-gray-100 dark:bg-gray-800" />
                <div className="flex justify-between items-center">
                    <LoadingSkeleton variant="text" className="h-8 w-24" />
                    <LoadingSkeleton variant="rectangle" className="h-10 w-32 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

// Add shimmer animation to globals.css
