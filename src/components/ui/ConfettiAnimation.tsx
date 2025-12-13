"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiAnimationProps {
    isActive: boolean;
    duration?: number;
}

export function ConfettiAnimation({
    isActive,
    duration = 3000
}: ConfettiAnimationProps) {
    const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);

    useEffect(() => {
        if (isActive) {
            const colors = ["#14b8a6", "#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b"];
            const pieces = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 0.5,
            }));
            setConfetti(pieces);

            const timer = setTimeout(() => {
                setConfetti([]);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isActive, duration]);

    if (!isActive || confetti.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
            {confetti.map((piece) => (
                <motion.div
                    key={piece.id}
                    initial={{
                        y: -20,
                        x: `${piece.x}vw`,
                        opacity: 1,
                        rotate: 0,
                        scale: 1
                    }}
                    animate={{
                        y: "100vh",
                        rotate: 360,
                        opacity: 0,
                        scale: 0.5
                    }}
                    transition={{
                        duration: 2 + Math.random(),
                        delay: piece.delay,
                        ease: "easeIn"
                    }}
                    style={{
                        position: "absolute",
                        width: "10px",
                        height: "10px",
                        backgroundColor: piece.color,
                        borderRadius: Math.random() > 0.5 ? "50%" : "0%",
                    }}
                />
            ))}
        </div>
    );
}
