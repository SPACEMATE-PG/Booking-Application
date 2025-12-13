"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface PhotoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPhotoSelect: (photoDataUrl: string) => void;
}

export function PhotoUploadModal({ isOpen, onClose, onPhotoSelect }: PhotoUploadModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

    // Cleanup camera stream when modal closes or camera view closes
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    useEffect(() => {
        if (!isOpen) {
            stopCamera();
            setShowCamera(false);
            setPreviewImage(null);
            setCameraError(null);
        }
    }, [isOpen]);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const startCamera = async () => {
        setCameraError(null);
        setIsProcessing(true);

        try {
            // Check if running on HTTPS or localhost
            const isSecureContext = window.isSecureContext ||
                window.location.protocol === 'https:' ||
                window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1';

            if (!isSecureContext) {
                throw new Error("Camera requires HTTPS. Please use https:// or localhost");
            }

            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Camera not supported in this browser. Please use Upload option.");
            }

            // Stop any existing stream
            stopCamera();

            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });

            streamRef.current = stream;

            // Attach stream to video element
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }

            setShowCamera(true);
            setIsProcessing(false);
        } catch (error) {
            console.error("Camera access error:", error);
            setIsProcessing(false);

            let errorMessage = "Failed to access camera. ";

            if (error instanceof Error) {
                if (error.message.includes("HTTPS") || error.message.includes("https")) {
                    errorMessage = "⚠️ Camera requires HTTPS. Please use https:// in URL or try Upload option.";
                } else if (error.message.includes("not supported")) {
                    errorMessage = "Camera not supported. Please try Upload option.";
                } else if (error.name === "NotAllowedError") {
                    errorMessage = "Camera permission denied. Please allow camera access.";
                } else if (error.name === "NotFoundError") {
                    errorMessage = "No camera found. Please try Upload option.";
                } else if (error.name === "NotReadableError") {
                    errorMessage = "Camera in use by another app. Please close it first.";
                } else {
                    errorMessage = error.message || "Unknown error. Try Upload option.";
                }
            }

            setCameraError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL
        const photoDataUrl = canvas.toDataURL("image/jpeg", 0.9);

        setPreviewImage(photoDataUrl);
        setShowCamera(false);
        stopCamera();
    };

    const switchCamera = async () => {
        const newFacingMode = facingMode === "user" ? "environment" : "user";
        setFacingMode(newFacingMode);

        if (showCamera) {
            stopCamera();
            // Small delay to ensure cleanup
            setTimeout(() => {
                startCamera();
            }, 100);
        }
    };

    const handleFileSelect = (file: File) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size should be less than 2MB");
            return;
        }

        setIsProcessing(true);
        const reader = new FileReader();

        reader.onloadend = () => {
            const result = reader.result as string;
            setPreviewImage(result);
            setIsProcessing(false);
        };

        reader.onerror = () => {
            toast.error("Failed to read image file");
            setIsProcessing(false);
        };

        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleConfirm = () => {
        if (previewImage) {
            onPhotoSelect(previewImage);
            handleClose();
            toast.success("Profile photo updated!");
        }
    };

    const handleClose = () => {
        stopCamera();
        setPreviewImage(null);
        setShowCamera(false);
        setIsProcessing(false);
        setCameraError(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Profile Photo</DialogTitle>
                    <DialogDescription>
                        {showCamera ? "Position yourself and capture" : "Choose how you'd like to upload your photo"}
                    </DialogDescription>
                </DialogHeader>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInputChange}
                />

                {/* Hidden canvas for photo capture */}
                <canvas ref={canvasRef} className="hidden" />

                <div className="space-y-6 py-4">
                    <AnimatePresence mode="wait">
                        {/* Camera View */}
                        {showCamera && (
                            <motion.div
                                key="camera"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="space-y-4"
                            >
                                <div className="relative mx-auto w-full aspect-video rounded-xl overflow-hidden bg-black">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Camera overlay guide */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-48 h-48 rounded-full border-4 border-white/30" />
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowCamera(false);
                                            stopCamera();
                                        }}
                                        className="gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={switchCamera}
                                        className="gap-2"
                                        title="Switch Camera"
                                    >
                                        <Repeat className="h-4 w-4" />
                                        Flip
                                    </Button>
                                    <Button
                                        onClick={capturePhoto}
                                        className="gap-2 bg-teal-600 hover:bg-teal-700"
                                    >
                                        <Camera className="h-4 w-4" />
                                        Capture
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Preview Section */}
                        {previewImage && !showCamera && (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="space-y-4"
                            >
                                <div className="relative mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-teal-500 shadow-xl">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => setPreviewImage(null)}
                                        className="gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        Change Photo
                                    </Button>
                                    <Button
                                        onClick={handleConfirm}
                                        className="gap-2 bg-teal-600 hover:bg-teal-700"
                                    >
                                        Confirm & Save
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Upload Options */}
                        {!showCamera && !previewImage && (
                            <motion.div
                                key="options"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="space-y-4"
                            >
                                {cameraError && (
                                    <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                                        <p className="text-sm text-red-600 dark:text-red-400">{cameraError}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Camera Option */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={startCamera}
                                        disabled={isProcessing}
                                        className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-300 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-16 w-16 rounded-full bg-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Camera className="h-8 w-8 text-white" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    Camera
                                                </h3>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                    Take a photo
                                                </p>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-teal-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    </motion.button>

                                    {/* Upload Option */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleUploadClick}
                                        disabled={isProcessing}
                                        className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all duration-300 p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-16 w-16 rounded-full bg-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Upload className="h-8 w-8 text-white" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    Upload
                                                </h3>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                    Choose from files
                                                </p>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    </motion.button>
                                </div>

                                {/* Info Text */}
                                <div className="text-center space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Supported formats: JPG, PNG, GIF
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Maximum file size: 2MB
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isProcessing && !showCamera && (
                        <div className="text-center">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-500 border-r-transparent" />
                            <p className="text-sm text-muted-foreground mt-2">
                                {showCamera ? "Starting camera..." : "Processing image..."}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
