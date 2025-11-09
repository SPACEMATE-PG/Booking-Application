"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Heart, Star, Loader2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";
import Image from "next/image";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { MainFeatureSection } from "@/components/MainFeatureSection";
import { TestimonialSection } from "@/components/TestimonialSection";
import { CTASection } from "@/components/CTASection";
import { FooterSection } from "@/components/FooterSection";

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

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    fetchProperties();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties?limit=6");
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
            console.warn(`Failed to parse amenities for property ${property.id}:`, e);
            amenities = [];
          }
          
          if (!Array.isArray(amenities)) {
            amenities = [];
          }
          
          return {
            ...property,
            amenities
          };
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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/properties?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/properties");
    }
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Search Section - Modern Design */}
      <section id="search-section" className="py-16 px-4 bg-gradient-to-br from-primary/5 via-primary/10 to-background">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Where do you want to live?
            </h2>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Input
                  type="text"
                  placeholder="Search by city, area, or locality..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-12 pr-4 h-14 bg-background border-2 text-lg shadow-lg focus-visible:ring-2"
                />
                <Button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Categories */}
            <div className="flex flex-wrap gap-2 justify-center pt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push("/properties?gender_type=Male")}
                className="rounded-full"
              >
                Male PG
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push("/properties?gender_type=Female")}
                className="rounded-full"
              >
                Female PG
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push("/properties?gender_type=Unisex")}
                className="rounded-full"
              >
                Unisex PG
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties - Clean Design */}
      <section className="py-20 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
                Featured Properties
              </h2>
              <p className="text-muted-foreground">
                Handpicked accommodations just for you
              </p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => router.push("/properties")}
              className="group"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No properties found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Card
                  key={property.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
                  onClick={() => router.push(`/properties/${property.id}`)}
                >
                  <div className="relative h-56 bg-muted overflow-hidden">
                    <Image
                      src={property.thumbnailImage}
                      alt={property.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(property.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-background/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-background transition-colors z-10"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          favorites.includes(property.id)
                            ? "fill-red-500 text-red-500"
                            : "text-foreground"
                        }`}
                      />
                    </button>
                    <Badge className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm text-foreground border">
                      {property.genderType}
                    </Badge>
                  </div>
                  <CardContent className="p-5 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {property.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="line-clamp-1">
                          {property.locality}, {property.city}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{property.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({property.totalReviews})
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          ₹{property.startingPrice.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">per month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* View All Button - Mobile */}
          <div className="flex justify-center mt-10">
            <Button 
              size="lg"
              onClick={() => router.push("/properties")}
              className="group"
            >
              Explore All Properties
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Main Feature Section */}
      <MainFeatureSection />

      {/* Testimonials */}
      <TestimonialSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <FooterSection />
    </main>
  );
}