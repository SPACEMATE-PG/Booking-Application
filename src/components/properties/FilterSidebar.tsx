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
import { X, Filter } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

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
            <div className="h-full overflow-y-auto p-6 lg:p-0 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                <div className="flex justify-between items-center lg:hidden mb-6">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        <Filter className="h-5 w-5 text-teal-600" />
                        Filters
                    </h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <Card className="p-1 space-y-1 border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900 lg:sticky lg:top-24 rounded-2xl overflow-hidden">
                    <div className="flex justify-between items-center p-4 pb-2">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Filters</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 h-8 px-3 text-xs font-semibold uppercase tracking-wide"
                        >
                            Reset
                        </Button>
                    </div>

                    <Accordion type="multiple" defaultValue={["basic", "price", "amenities"]} className="w-full px-2 pb-2">

                        {/* Basic Filters */}
                        <AccordionItem value="basic" className="border-b-0">
                            <AccordionTrigger className="hover:no-underline px-2 py-3">
                                <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Location & Type</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-2 pb-4 space-y-4">
                                {/* City Filter */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">City</label>
                                    <Select value={cityFilter} onValueChange={setCityFilter}>
                                        <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10 rounded-lg focus:ring-teal-500">
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

                                {/* Gender Filter */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gender</label>
                                    <Select value={genderFilter} onValueChange={setGenderFilter}>
                                        <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10 rounded-lg focus:ring-teal-500">
                                            <SelectValue placeholder="Select gender type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Any Gender</SelectItem>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Unisex">Unisex</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Category/Tier Filter */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</label>
                                    <Select value={tierFilter} onValueChange={setTierFilter}>
                                        <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10 rounded-lg focus:ring-teal-500">
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
                            </AccordionContent>
                        </AccordionItem>

                        {/* Price Range */}
                        <AccordionItem value="price" className="border-b-0">
                            <AccordionTrigger className="hover:no-underline px-2 py-3">
                                <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Price Range</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-2 pb-6 pt-2">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">₹{priceRange[0].toLocaleString()}</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">₹{priceRange[1].toLocaleString()}</span>
                                    </div>
                                    <Slider
                                        min={5000}
                                        max={25000}
                                        step={1000}
                                        value={priceRange}
                                        onValueChange={(val) => setPriceRange(val as number[])}
                                        className="py-4"
                                    />
                                    <div className="text-center">
                                        <Badge variant="secondary" className="font-normal text-xs text-muted-foreground">
                                            Monthly Rent
                                        </Badge>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Amenities Filter */}
                        <AccordionItem value="amenities" className="border-b-0">
                            <AccordionTrigger className="hover:no-underline px-2 py-3">
                                <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Amenities</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-2 pb-4">
                                <div className="flex flex-wrap gap-2">
                                    {amenitiesList.map((amenity) => (
                                        <Badge
                                            key={amenity}
                                            variant={amenitiesFilter.includes(amenity) ? "default" : "outline"}
                                            className={`cursor-pointer transition-all duration-200 py-1.5 px-3 rounded-lg text-sm ${amenitiesFilter.includes(amenity)
                                                ? "bg-teal-500 hover:bg-teal-600 border-teal-500 text-white"
                                                : "hover:border-teal-500 hover:text-teal-600 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200"
                                                }`}
                                            onClick={() => toggleAmenity(amenity)}
                                        >
                                            {amenity}
                                        </Badge>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Sort By */}
                        <AccordionItem value="sort" className="border-none">
                            <AccordionTrigger className="hover:no-underline px-2 py-3">
                                <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Sort By</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-2 pb-4">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10 rounded-lg focus:ring-teal-500">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="popularity">Popularity</SelectItem>
                                        <SelectItem value="rating">Rating</SelectItem>
                                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
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
