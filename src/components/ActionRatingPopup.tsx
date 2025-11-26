"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, MessageSquare, ThumbsUp, Sparkles } from "lucide-react";
import { useRating } from "@/lib/rating-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ActionRatingPopup() {
    const { isOpen, hideRating, actionName } = useRating();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [step, setStep] = useState<"rating" | "comment">("rating");

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setRating(0);
            setComment("");
            setStep("rating");
        }
    }, [isOpen]);

    const handleRate = (value: number) => {
        setRating(value);
        setTimeout(() => setStep("comment"), 300);
    };

    const handleSubmit = () => {
        // Here you would typically send the data to your backend
        console.log({ action: actionName, rating, comment });

        toast.success("Thanks for your feedback!", {
            description: "We appreciate your input.",
        });

        hideRating();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={hideRating}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Popup Container */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-zinc-900/90 p-1 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl"
                    >
                        {/* Animated Border/Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-50" />

                        <div className="relative rounded-[20px] bg-zinc-950/80 p-6 sm:p-8">
                            {/* Close Button */}
                            <button
                                onClick={hideRating}
                                className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Content */}
                            <div className="flex flex-col items-center text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: "spring" }}
                                    className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25"
                                >
                                    <Sparkles className="h-8 w-8 text-white" />
                                </motion.div>

                                <h2 className="mb-2 text-2xl font-bold text-white">
                                    {step === "rating" ? "Rate Experience" : "Tell us more"}
                                </h2>
                                <p className="mb-8 text-zinc-400">
                                    {step === "rating"
                                        ? `How was your experience with ${actionName}?`
                                        : "What did you like or dislike?"}
                                </p>

                                <AnimatePresence mode="wait">
                                    {step === "rating" ? (
                                        <motion.div
                                            key="rating-step"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex gap-2"
                                        >
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <motion.button
                                                    key={star}
                                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleRate(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="relative p-1 focus:outline-none"
                                                >
                                                    <Star
                                                        className={`h-10 w-10 transition-all duration-200 ${star <= (hoverRating || rating)
                                                                ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                                                                : "text-zinc-700"
                                                            }`}
                                                    />
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="comment-step"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="w-full space-y-4"
                                        >
                                            <Textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Share your thoughts..."
                                                className="min-h-[100px] resize-none border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                                            />
                                            <div className="flex gap-3">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setStep("rating")}
                                                    className="flex-1 border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    onClick={handleSubmit}
                                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500"
                                                >
                                                    Submit
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
