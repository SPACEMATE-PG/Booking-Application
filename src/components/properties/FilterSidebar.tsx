"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface FilterSidebarProps {
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    clearFilters: () => void;
    tierFilter: string;
    setTierFilter: (value: string) => void;
    genderFilter: string;
    setGenderFilter: (value: string) => void;
    cityFilter: string;
    setCityFilter: (value: string) => void;
    priceRange: number[];
    setPriceRange: (value: number[]) => void;
    amenitiesFilter: string[];
    toggleAmenity: (amenity: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    amenitiesList: string[];
}

export function FilterSidebar({
    showFilters,
    setShowFilters,
    clearFilters,
    tierFilter,
    setTierFilter,
    genderFilter,
    setGenderFilter,
    cityFilter,
    setCityFilter,
    priceRange,
    setPriceRange,
    amenitiesFilter,
    toggleAmenity,
    sortBy,
    setSortBy,
    amenitiesList,
}: FilterSidebarProps) {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-none lg:bg-transparent lg:z-0 ${showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
        >
            <div className="h-full overflow-y-auto p-6 lg:p-0">
                <div className="flex justify-between items-center lg:hidden mb-6">
                    <h3 className="font-bold text-xl">Filters</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <Card className="p-6 space-y-6 border-none shadow-sm bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl lg:sticky lg:top-24">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">Filters</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                        >
                            Clear All
                        </Button>
                    </div>

                    {/* Category/Tier Filter */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
                        <Select value={tierFilter} onValueChange={setTierFilter}>
                            <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="Premium">Premium (₹15k+)</SelectItem>
                                <SelectItem value="Standard">Standard (₹8k-15k)</SelectItem>
                                <SelectItem value="Basic">Basic (&lt;₹8k)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Gender Filter */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Gender Type</label>
                        <Select value={genderFilter} onValueChange={setGenderFilter}>
                            <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectValue placeholder="Select gender type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Unisex">Unisex</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* City Filter */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">City</label>
                        <Select value={cityFilter} onValueChange={setCityFilter}>
                            <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Cities</SelectItem>
                                <SelectItem value="Mumbai">Mumbai</SelectItem>
                                <SelectItem value="Delhi">Delhi</SelectItem>
                                <SelectItem value="Bangalore">Bangalore</SelectItem>
                                <SelectItem value="Pune">Pune</SelectItem>
                                <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Price Range</label>
                            <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                                ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                            </span>
                        </div>
                        <Slider
                            min={5000}
                            max={25000}
                            step={1000}
                            value={priceRange}
                            onValueChange={(val) => setPriceRange(val as number[])}
                            className="w-full"
                        />
                    </div>

                    {/* Amenities Filter */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Amenities</label>
                        <div className="flex flex-wrap gap-2">
                            {amenitiesList.map((amenity) => (
                                <Badge
                                    key={amenity}
                                    variant={amenitiesFilter.includes(amenity) ? "default" : "outline"}
                                    className={`cursor-pointer transition-all duration-200 ${amenitiesFilter.includes(amenity)
                                            ? "bg-teal-500 hover:bg-teal-600 border-teal-500"
                                            : "hover:border-teal-500 hover:text-teal-500 bg-white dark:bg-gray-800"
                                        }`}
                                    onClick={() => toggleAmenity(amenity)}
                                >
                                    {amenity}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sort By</label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="popularity">Popularity</SelectItem>
                                <SelectItem value="rating">Rating</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </Card>
            </div>

            {/* Overlay for mobile */}
            {showFilters && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setShowFilters(false)}
                />
            )}
        </aside>
    );
}
