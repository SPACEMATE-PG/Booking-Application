"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Heart, Star, Wifi, UtensilsCrossed, Car, Wind, Filter, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";
import Image from "next/image";

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

export default function PropertiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [genderFilter, setGenderFilter] = useState(searchParams.get("gender_type") || "all");
  const [cityFilter, setCityFilter] = useState(searchParams.get("city") || "all");
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([5000, 25000]);
  const [sortBy, setSortBy] = useState("popularity");
  const [amenitiesFilter, setAmenitiesFilter] = useState<string[]>([]);

  const amenitiesList = ["WiFi", "AC", "Food", "Laundry", "Parking", "Gym", "Balcony"];
  const cities = ["All Cities", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad"];

  useEffect(() => {
    fetchProperties();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties?limit=50");
      if (response.ok) {
        const data = await response.json();
        const parsedData = data.map((property: any) => {
          let amenities: string[] = [];
          try {
            if (typeof property.amenities === 'string') {
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

    const isFavorited = favorites.includes(propertyId);

    try {
      if (isFavorited) {
        const checkResponse = await fetch(`/api/favorites/user/${user.id}/check/${propertyId}`);
        if (checkResponse.ok) {
          const { favoriteId } = await checkResponse.json();
          const response = await fetch(`/api/favorites/${favoriteId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            setFavorites(favorites.filter((id) => id !== propertyId));
            toast.success("Removed from favorites");
          }
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, propertyId }),
        });
        if (response.ok) {
          setFavorites([...favorites, propertyId]);
          toast.success("Added to favorites");
        }
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorites");
    }
  };

  const toggleAmenity = (amenity: string) => {
    setAmenitiesFilter(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setGenderFilter("all");
    setCityFilter("all");
    setRoomTypeFilter("all");
    setPriceRange([5000, 25000]);
    setAmenitiesFilter([]);
    setSortBy("popularity");
  };

  const filteredProperties = properties
    .filter(property => {
      // Search filter
      const matchesSearch = searchQuery === "" ||
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase());

      // Gender filter
      const matchesGender = genderFilter === "all" || property.genderType === genderFilter;

      // City filter
      const matchesCity = cityFilter === "all" || property.city === cityFilter;

      // Price filter
      const matchesPrice = property.startingPrice >= priceRange[0] && property.startingPrice <= priceRange[1];

      // Amenities filter
      const matchesAmenities = amenitiesFilter.length === 0 ||
        amenitiesFilter.every(amenity => property.amenities.includes(amenity));

      return matchesSearch && matchesGender && matchesCity && matchesPrice && matchesAmenities;
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

  const amenityIcons: Record<string, any> = {
    WiFi: <Wifi className="h-4 w-4" />,
    Food: <UtensilsCrossed className="h-4 w-4" />,
    Parking: <Car className="h-4 w-4" />,
    AC: <Wind className="h-4 w-4" />,
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Search Bar */}
      <section className="py-6 px-4 border-b bg-gradient-to-r from-teal-500 to-cyan-500">
        <div className="container max-w-6xl mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by area, landmark, or property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white dark:bg-gray-800"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="secondary"
              className="h-12 gap-2"
            >
              <Filter className="h-5 w-5" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className={`lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              {/* Gender Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender Type</label>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger>
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
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger>
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
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                </label>
                <Slider
                  min={5000}
                  max={25000}
                  step={1000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="w-full"
                />
              </div>

              {/* Amenities Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {amenitiesList.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant={amenitiesFilter.includes(amenity) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleAmenity(amenity)}
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
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
          </aside>

          {/* Property Listings */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {filteredProperties.length} Properties Found
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No properties found matching your filters</p>
                <Button onClick={clearFilters} className="mt-4" variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => {
                  const amenitiesArray = Array.isArray(property.amenities) ? property.amenities : [];
                  
                  return (
                    <Card
                      key={property.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => router.push(`/properties/${property.id}`)}
                    >
                      <div className="relative h-48 bg-gray-200">
                        <Image
                          src={property.thumbnailImage}
                          alt={property.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(property.id);
                          }}
                          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              favorites.includes(property.id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-600"
                            }`}
                          />
                        </button>
                        <Badge className="absolute bottom-2 left-2 bg-teal-500">
                          {property.genderType}
                        </Badge>
                      </div>
                      <CardContent className="p-4 space-y-2">
                        <h3 className="font-semibold text-lg line-clamp-1">
                          {property.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">
                            {property.locality}, {property.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{property.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({property.totalReviews} reviews)
                          </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {amenitiesArray.slice(0, 4).map((amenity, index) => (
                            <div
                              key={`${amenity}-${index}`}
                              className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full"
                            >
                              {amenityIcons[amenity] || null}
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <div>
                          <p className="text-2xl font-bold text-teal-500">
                            ₹{property.startingPrice.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">per month</p>
                        </div>
                        <Button
                          className="bg-teal-500 hover:bg-teal-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/properties/${property.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
