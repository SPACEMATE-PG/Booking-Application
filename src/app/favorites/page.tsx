"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, MapPin, Star, Wifi, UtensilsCrossed, Car, Wind, Loader2, HeartOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
}

interface Favorite {
  id: number;
  propertyId: number;
  property: Property;
}

export default function FavoritesPage() {
  const router = useRouter();
  const { user } = useUser();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to view favorites");
      router.push("/login");
      return;
    }
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/favorites/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        
        // Fetch full property details for each favorite
        const favoritesWithProperties = await Promise.all(
          data.map(async (fav: any) => {
            const propResponse = await fetch(`/api/properties/${fav.propertyId}`);
            if (propResponse.ok) {
              const property = await propResponse.json();
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
              return {
                id: fav.id,
                propertyId: fav.propertyId,
                property: { ...property, amenities }
              };
            }
            return null;
          })
        );
        
        setFavorites(favoritesWithProperties.filter(f => f !== null) as Favorite[]);
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: number, propertyName: string) => {
    try {
      const response = await fetch(`/api/favorites/${favoriteId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.id !== favoriteId));
        toast.success(`Removed ${propertyName} from favorites`);
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      toast.error("Failed to remove from favorites");
    }
  };

  const amenityIcons: Record<string, any> = {
    WiFi: <Wifi className="h-4 w-4" />,
    Food: <UtensilsCrossed className="h-4 w-4" />,
    Parking: <Car className="h-4 w-4" />,
    AC: <Wind className="h-4 w-4" />,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8" />
            <h1 className="text-4xl font-bold">My Favorites</h1>
          </div>
          <p className="text-white/90">Your saved PG properties</p>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <HeartOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring and save your favorite PG properties
            </p>
            <Button
              onClick={() => router.push("/properties")}
              className="bg-teal-500 hover:bg-teal-600"
            >
              Browse Properties
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {favorites.length} {favorites.length === 1 ? "Property" : "Properties"} Saved
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => {
                const property = favorite.property;
                const amenitiesArray = Array.isArray(property.amenities) ? property.amenities : [];
                
                return (
                  <Card
                    key={favorite.id}
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
                          removeFavorite(favorite.id, property.name);
                        }}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                      >
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
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
          </>
        )}
      </div>
    </main>
  );
}
