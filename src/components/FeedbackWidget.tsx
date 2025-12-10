"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, X, Send, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { useUser } from "@/lib/user-context";

export function FeedbackWidget() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    rating,
                    userId: user?.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            toast.success("Thank you for your feedback!", {
                description: "We appreciate your input and will use it to improve our services.",
            });

            setFormData({ name: "", email: "", message: "" });
            setRating(0);
            setIsOpen(false);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error("Failed to submit feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75 duration-1000" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-primary/80 to-primary/50 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <MessageSquarePlus className="w-6 h-6 relative z-10" />
                        <span className="sr-only">Open Feedback</span>
                    </motion.button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] border-none bg-background/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            We value your opinion
                        </DialogTitle>
                        <DialogDescription>
                            Help us create the perfect experience for you.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-4 relative z-10">
                        {/* Rating Section */}
                        <div className="flex flex-col items-center gap-2">
                            <Label className="text-muted-foreground">How was your experience?</Label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <motion.button
                                        key={star}
                                        type="button"
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="p-1 focus:outline-none transition-colors"
                                    >
                                        <Star
                                            className={`w-8 h-8 transition-all duration-200 ${star <= (hoverRating || rating)
                                                ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                                                : "text-muted-foreground/30"
                                                }`}
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-background/50 border-primary/10 focus:border-primary/30 transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-background/50 border-primary/10 focus:border-primary/30 transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Tell us what you think..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="min-h-[100px] bg-background/50 border-primary/10 focus:border-primary/30 transition-all resize-none"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/20 transition-all duration-300"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Send Feedback
                                    <Send className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
