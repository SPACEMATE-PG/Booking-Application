"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, MapPin, Star, Wifi, UtensilsCrossed, Car, Wind, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyTierBadge } from "@/components/PropertyTierBadge";
import { GenderIcon } from "@/components/GenderIcon";
import { cn } from "@/lib/utils";

interface Property {
    id: number;
    name: string;
    address: string;
    city: string;
    locality: string;
    genderType: string;
    thumbnailImage: string;
    startingPrice: number;
    amenities: string[];
    rating: number;
    totalReviews: number;
    isAvailable: boolean;
}

interface PropertyCardProps {
    property: Property;
    isFavorite: boolean;
    onToggleFavorite: (id: number) => void;
    onClick: () => void;
}

const amenityIcons: Record<string, any> = {
    WiFi: Wifi,
    Food: UtensilsCrossed,
    Parking: Car,
    AC: Wind,
};

export function PropertyCard({ property, isFavorite, onToggleFavorite, onClick }: PropertyCardProps) {
    const amenitiesArray = Array.isArray(property.amenities) ? property.amenities : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 cursor-pointer"
            onClick={onClick}
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                    src={property.thumbnailImage}
                    alt={property.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <PropertyTierBadge price={property.startingPrice} className="backdrop-blur-md bg-white/90 shadow-sm" />
                </div>

                {/* Favorite Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(property.id);
                    }}
                    className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors border border-white/30 z-10"
                >
                    <Heart
                        className={cn(
                            "h-5 w-5 transition-colors",
                            isFavorite ? "fill-red-500 text-red-500" : "text-white"
                        )}
                    />
                </motion.button>

                {/* Bottom Info on Image */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                        <GenderIcon type={property.genderType} className="text-white" />
                        <span className="text-sm font-medium capitalize">{property.genderType}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-500 text-black px-2 py-1 rounded-lg font-bold text-sm shadow-sm">
                        <Star className="h-3.5 w-3.5 fill-black" />
                        {property.rating}
                    </div>
                </div>
            </div>

            {/* Sold Out Overlay */}
            {!property.isAvailable && (
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
                    <span className="text-white font-bold text-lg uppercase tracking-widest border-2 border-white/80 px-4 py-2 rounded-lg -rotate-12 transform shadow-2xl">
                        Sold Out
                    </span>
                </div>
            )}

            {/* Content Section */}
            <div className={`p-5 space-y-4 ${!property.isAvailable ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-teal-600 transition-colors">
                        {property.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mt-1 text-sm">
                        <MapPin className="h-4 w-4 text-teal-500" />
                        <span className="line-clamp-1">{property.locality}, {property.city}</span>
                    </div>
                </div>

                {/* Amenities */}
                <div className="flex gap-2 flex-wrap h-14 content-start overflow-hidden">
                    {amenitiesArray.slice(0, 4).map((amenity, index) => {
                        const Icon = amenityIcons[amenity];
                        return (
                            <div
                                key={`${amenity}-${index}`}
                                className="flex items-center gap-1.5 text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1.5 rounded-md border border-gray-100 dark:border-gray-700"
                            >
                                {Icon && <Icon className="h-3.5 w-3.5 text-teal-500" />}
                                <span>{amenity}</span>
                            </div>
                        );
                    })}
                    {amenitiesArray.length > 4 && (
                        <div className="text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-500 px-2.5 py-1.5 rounded-md border border-gray-100">
                            +{amenitiesArray.length - 4} more
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 dark:bg-gray-800" />

                {/* Footer */}
                <div className="flex justify-between items-center pt-1">
                    <div className="flex flex-col">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Starts from</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">
                                ₹{property.startingPrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500 font-medium">/mo</span>
                        </div>
                    </div>

                    <Button
                        className={`rounded-xl px-6 transition-all duration-300 shadow-sm ${!property.isAvailable
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-600"
                                : "bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-teal-600 dark:hover:bg-teal-400 hover:text-white hover:shadow-teal-500/25"
                            }`}
                        size="default"
                        disabled={!property.isAvailable}
                    >
                        {!property.isAvailable ? "Sold Out" : "View Details"}
                        {property.isAvailable && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
