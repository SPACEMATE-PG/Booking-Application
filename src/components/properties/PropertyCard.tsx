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
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={property.thumbnailImage}
                    alt={property.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

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
                    <div className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                        <GenderIcon type={property.genderType} className="text-white" />
                        <span className="text-sm font-medium capitalize">{property.genderType}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-500/90 backdrop-blur-sm px-2 py-1 rounded-lg text-black font-bold text-sm">
                        <Star className="h-3.5 w-3.5 fill-black" />
                        {property.rating}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 space-y-4">
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
                <div className="flex gap-2 flex-wrap">
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
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Starts from</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-teal-600">
                                ₹{property.startingPrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">/mo</span>
                        </div>
                    </div>

                    <Button
                        className="rounded-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-teal-600 dark:hover:bg-teal-400 hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-teal-500/20"
                        size="sm"
                    >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
