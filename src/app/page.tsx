"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Heart, Star, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/lib/user-context";
import { useRating } from "@/lib/rating-context";
import { toast } from "sonner";
import Image from "next/image";
import { PropertyTierBadge, getTier } from "@/components/PropertyTierBadge";
import { GenderIcon } from "@/components/GenderIcon";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { MainFeatureSection } from "@/components/MainFeatureSection";
import { TestimonialSection } from "@/components/TestimonialSection";
import { CTASection } from "@/components/CTASection";
import { FooterSection } from "@/components/FooterSection";
import { PropertyCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { motion } from "framer-motion";

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
  const { showRating } = useRating();
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
            if (typeof property.amenities === "string") {
              amenities = JSON.parse(property.amenities);
            } else if (Array.isArray(property.amenities)) {
              amenities = property.amenities;
            }
          } catch (e) {
            console.warn(
              `Failed to parse amenities for property ${property.id}:`,
              e
            );
            amenities = [];
          }

          if (!Array.isArray(amenities)) {
            amenities = [];
          }

          return {
            ...property,
            amenities,
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
        const checkResponse = await fetch(
          `/api/favorites/user/${user.id}/check/${propertyId}`
        );
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
          // Trigger rating popup for demo purposes
          showRating("Adding to Favorites");
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
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </div>
          ) : filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed"
            >
              <p className="text-muted-foreground text-lg mb-2">
                No properties found
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
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
                        sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
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
                          className={`h-5 w-5 ${favorites.includes(property.id)
                            ? "fill-red-500 text-red-500"
                            : "text-foreground"
                            }`}
                        />
                      </button>
                      <div className="absolute top-3 left-3 z-10">
                        <PropertyTierBadge price={property.startingPrice || 0} />
                      </div>
                      <div className="absolute bottom-3 left-3 bg-background/90 p-2 rounded-full shadow-md backdrop-blur-sm border" title={property.genderType}>
                        <GenderIcon type={property.genderType} className="text-foreground" />
                      </div>
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
                          <p className="text-xs text-muted-foreground">
                            per month
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
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

      {/* Floating Action Button */}
      <FloatingActionButton />
    </main>
  );
}
