"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchSectionProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setShowFilters: (show: boolean) => void;
    showFilters: boolean;
}

export function SearchSection({ searchQuery, setSearchQuery, setShowFilters, showFilters }: SearchSectionProps) {
    return (
        <section className="relative py-12 px-4 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 dark:from-teal-900/20 dark:to-cyan-900/20" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 blur-[100px]" />

            <div className="container max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 mb-4 tracking-tight">
                        Find Your Perfect Stay
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light">
                        Discover premium PG accommodations with world-class amenities and comfort.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="flex gap-3 p-2 bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 backdrop-blur-xl transition-all hover:shadow-2xl hover:bg-white/90 dark:hover:bg-gray-800/90">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by area, landmark, or property name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 border-none bg-transparent focus-visible:ring-0 text-lg placeholder:text-gray-400"
                            />
                        </div>
                        <Button
                            onClick={() => setShowFilters(!showFilters)}
                            variant={showFilters ? "secondary" : "default"}
                            className="h-12 px-6 rounded-xl gap-2 bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg transition-all"
                        >
                            <Filter className="h-5 w-5" />
                            <span className="hidden sm:inline">Filters</span>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
