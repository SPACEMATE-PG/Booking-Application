"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { FilterSidebar } from "@/components/properties/FilterSidebar";
import { SearchSection } from "@/components/properties/SearchSection";
import { getTier } from "@/components/PropertyTierBadge";
import { motion, AnimatePresence } from "framer-motion";
import { PropertyCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";

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

const ITEMS_PER_PAGE = 6;

export default function PropertiesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-teal-500" /></div>}>
            <PropertiesContent />
        </Suspense>
    );
}

function PropertiesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUser();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(
        searchParams.get("search") || ""
    );
    const [favorites, setFavorites] = useState<number[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [genderFilter, setGenderFilter] = useState(
        searchParams.get("gender_type") || "all"
    );
    const [cityFilter, setCityFilter] = useState(
        searchParams.get("city") || "all"
    );
    const [tierFilter, setTierFilter] = useState("all");
    const [roomTypeFilter, setRoomTypeFilter] = useState("all");
    const [priceRange, setPriceRange] = useState([5000, 25000]);
    const [sortBy, setSortBy] = useState("popularity");
    const [amenitiesFilter, setAmenitiesFilter] = useState<string[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    const amenitiesList = [
        "WiFi",
        "AC",
        "Food",
        "Laundry",
        "Parking",
        "Gym",
        "Balcony",
    ];

    useEffect(() => {
        fetchProperties();
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, genderFilter, cityFilter, tierFilter, amenitiesFilter, priceRange, sortBy]);

    const fetchProperties = async () => {
        try {
            const response = await fetch("/api/properties?limit=100"); // Fetch more to allow client-side pagination
            if (response.ok) {
                const data = await response.json();
                const parsedData = data.map((property: any) => {
                    let amenities: string[] = [];
                    try {
                        if (typeof property.amenities === "string") {
                            amenities = JSON.parse(property.amenities);
                        } else if (Array.isArray(property.amenities)) {
                            amenities = property.amenities;
                        }
                    } catch (e) {
                        amenities = [];
                    }
                    if (!Array.isArray(amenities)) {
                        amenities = [];
                    }
                    return { ...property, amenities };
                });
                setProperties(parsedData);
            }
        } catch (error) {
            console.error("Failed to fetch properties:", error);
            toast.error("Failed to load properties");
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        if (!user) return;
        try {
            const response = await fetch(`/api/favorites/user/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setFavorites(data.map((fav: any) => fav.propertyId));
            }
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
        }
    };

    const toggleFavorite = async (propertyId: number) => {
        if (!user) {
            toast.error("Please login to add favorites");
            router.push("/login");
            return;
        }

        const isFavorite = favorites.includes(propertyId);
        try {
            const method = isFavorite ? "DELETE" : "POST";
            const url = isFavorite
                ? `/api/favorites/${propertyId}`
                : `/api/favorites`;
            const body = isFavorite ? null : JSON.stringify({ propertyId, userId: user.id });

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            });

            if (response.ok) {
                if (isFavorite) {
                    setFavorites(favorites.filter((id) => id !== propertyId));
                    toast.success("Removed from favorites");
                } else {
                    setFavorites([...favorites, propertyId]);
                    toast.success("Added to favorites");
                }
            } else {
                toast.error("Failed to update favorites");
            }
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
            toast.error("Failed to update favorites");
        }
    };

    const toggleAmenity = (amenity: string) => {
        setAmenitiesFilter((prev) =>
            prev.includes(amenity)
                ? prev.filter((a) => a !== amenity)
                : [...prev, amenity]
        );
    };

    const clearFilters = () => {
        setGenderFilter("all");
        setCityFilter("all");
        setRoomTypeFilter("all");
        setPriceRange([5000, 25000]);
        setAmenitiesFilter([]);
        setTierFilter("all");
        setSortBy("popularity");
        setSearchQuery("");
    };

    const filteredProperties = properties
        .filter((property) => {
            // Search filter
            const matchesSearch =
                searchQuery === "" ||
                property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.city.toLowerCase().includes(searchQuery.toLowerCase());

            // Gender filter
            const matchesGender =
                genderFilter === "all" || property.genderType === genderFilter;

            // City filter
            const matchesCity = cityFilter === "all" || property.city === cityFilter;

            // Price filter
            const matchesPrice =
                property.startingPrice >= priceRange[0] &&
                property.startingPrice <= priceRange[1];

            // Amenities filter
            const matchesAmenities =
                amenitiesFilter.length === 0 ||
                amenitiesFilter.every((amenity) =>
                    property.amenities.includes(amenity)
                );

            // Tier filter
            const matchesTier =
                tierFilter === "all" || getTier(property.startingPrice) === tierFilter;

            return (
                matchesSearch &&
                matchesGender &&
                matchesCity &&
                matchesPrice &&
                matchesAmenities &&
                matchesTier
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return a.startingPrice - b.startingPrice;
                case "price-high":
                    return b.startingPrice - a.startingPrice;
                case "rating":
                    return b.rating - a.rating;
                default:
                    return b.totalReviews - a.totalReviews; // popularity
            }
        });

    // Pagination Logic
    const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
    const paginatedProperties = filteredProperties.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black">
            <SearchSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setShowFilters={setShowFilters}
                showFilters={showFilters}
            />

            <div className="container max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <FilterSidebar
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        clearFilters={clearFilters}
                        tierFilter={tierFilter}
                        setTierFilter={setTierFilter}
                        genderFilter={genderFilter}
                        setGenderFilter={setGenderFilter}
                        cityFilter={cityFilter}
                        setCityFilter={setCityFilter}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        amenitiesFilter={amenitiesFilter}
                        toggleAmenity={toggleAmenity}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        amenitiesList={amenitiesList}
                    />

                    {/* Property Listings */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                {filteredProperties.length} Properties Found
                            </h2>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                                <PropertyCardSkeleton />
                                <PropertyCardSkeleton />
                                <PropertyCardSkeleton />
                                <PropertyCardSkeleton />
                            </div>
                        ) : filteredProperties.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <p className="text-muted-foreground text-lg mb-4">
                                    No properties found matching your filters
                                </p>
                                <Button
                                    onClick={clearFilters}
                                    className="bg-teal-600 hover:bg-teal-700 text-white"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            <>
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6"
                                >
                                    <AnimatePresence mode="popLayout">
                                        {paginatedProperties.map((property) => (
                                            <PropertyCard
                                                key={property.id}
                                                property={property}
                                                isFavorite={favorites.includes(property.id)}
                                                onToggleFavorite={toggleFavorite}
                                                onClick={() => router.push(`/properties/${property.id}`)}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center mt-12 gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="h-10 w-10 rounded-full"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "ghost"}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`h-10 w-10 rounded-full font-medium ${currentPage === page
                                                        ? "bg-teal-600 hover:bg-teal-700 text-white"
                                                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                                        }`}
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="h-10 w-10 rounded-full"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <FloatingActionButton />
        </main>
    );
}
