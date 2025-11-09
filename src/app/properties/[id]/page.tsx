"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { MapPin, Heart, Star, Wifi, UtensilsCrossed, Car, Wind, Phone, MessageCircle, Calendar, Loader2, ChevronLeft, Check, X, ArrowRight, Building2, Users, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";
import Image from "next/image";

interface Property {
  id: number;
  name: string;
  description: string;
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
  latitude: number;
  longitude: number;
  managerName?: string;
  managerPhone?: string;
  cancellationPolicy?: string;
  refundPolicy?: string;
}

interface RoomType {
  id: number;
  propertyId: number;
  type: string;
  pricePerMonth: number;
  availableRooms: number;
  totalRooms: number;
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function PropertyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const [property, setProperty] = useState<Property | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);

  const propertyImages = [
    property?.thumbnailImage || "/placeholder.jpg",
    "/placeholder.jpg",
    "/placeholder.jpg",
    "/placeholder.jpg",
  ];

  useEffect(() => {
    if (params.id) {
      fetchPropertyDetails();
      fetchRoomTypes();
      fetchReviews();
      if (user) {
        checkFavorite();
      }
    }
  }, [params.id, user]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        let amenities: string[] = [];
        try {
          if (typeof data.amenities === 'string') {
            amenities = JSON.parse(data.amenities);
          } else if (Array.isArray(data.amenities)) {
            amenities = data.amenities;
          }
        } catch (e) {
          amenities = [];
        }
        setProperty({ ...data, amenities });
      } else {
        toast.error("Property not found");
        router.push("/properties");
      }
    } catch (error) {
      console.error("Failed to fetch property:", error);
      toast.error("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await fetch(`/api/room-types/property/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setRoomTypes(data);
      }
    } catch (error) {
      console.error("Failed to fetch room types:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/property/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        // API returns { reviews: [...], summary: {...} }
        if (data.reviews && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        } else {
          console.warn("Reviews data is not in expected format:", data);
          setReviews([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews([]);
    }
  };

  const checkFavorite = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/favorites/user/${user.id}/check/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error("Failed to check favorite:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Please login to add favorites");
      router.push("/login");
      return;
    }

    try {
      if (isFavorite) {
        const checkResponse = await fetch(`/api/favorites/user/${user.id}/check/${params.id}`);
        if (checkResponse.ok) {
          const { favoriteId } = await checkResponse.json();
          const response = await fetch(`/api/favorites/${favoriteId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            setIsFavorite(false);
            toast.success("Removed from favorites");
          }
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, propertyId: params.id }),
        });
        if (response.ok) {
          setIsFavorite(true);
          toast.success("Added to favorites");
        }
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorites");
    }
  };

  const handleBooking = (roomTypeId: number) => {
    if (!user) {
      toast.error("Please login to book");
      router.push("/login");
      return;
    }
    router.push(`/booking/${params.id}?roomType=${roomTypeId}`);
  };

  const scrollToRoomTypes = () => {
    const element = document.getElementById('room-types-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCallNow = () => {
    if (!property?.managerPhone) {
      toast.error("Contact number not available");
      return;
    }
    // Copy phone number to clipboard
    navigator.clipboard.writeText(property.managerPhone);
    toast.success(`Phone number copied: ${property.managerPhone}`);
    setShowContactDialog(true);
  };

  const handleChatManager = () => {
    if (!user) {
      toast.error("Please login to chat with manager");
      router.push("/login");
      return;
    }
    setShowChatDialog(true);
  };

  const handleScheduleVisit = () => {
    if (!user) {
      toast.error("Please login to schedule a visit");
      router.push("/login");
      return;
    }
    setShowScheduleDialog(true);
  };

  const amenityIcons: Record<string, any> = {
    WiFi: <Wifi className="h-5 w-5" />,
    Food: <UtensilsCrossed className="h-5 w-5" />,
    Parking: <Car className="h-5 w-5" />,
    AC: <Wind className="h-5 w-5" />,
  };

  const allAmenities = [
    { name: "WiFi", icon: <Wifi className="h-5 w-5" /> },
    { name: "AC", icon: <Wind className="h-5 w-5" /> },
    { name: "Food", icon: <UtensilsCrossed className="h-5 w-5" /> },
    { name: "Parking", icon: <Car className="h-5 w-5" /> },
    { name: "Laundry", icon: <Check className="h-5 w-5" /> },
    { name: "Gym", icon: <Check className="h-5 w-5" /> },
    { name: "Balcony", icon: <Check className="h-5 w-5" /> },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-muted-foreground mb-4">Property not found</p>
        <Button onClick={() => router.push("/properties")}>Go Back</Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Back Button */}
      <div className="border-b bg-card">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Properties
          </Button>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Property Header with Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Main Image - Takes 3 columns */}
          <div className="lg:col-span-3">
            <Carousel className="w-full">
              <CarouselContent>
                {propertyImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[500px] rounded-xl overflow-hidden border">
                      <Image
                        src={image}
                        alt={`${property.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>

          {/* Property Info & CTA - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            {/* Property Title Card */}
            <Card className="border-2">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge className="bg-teal-500 text-white">{property.genderType}</Badge>
                      {property.isAvailable && (
                        <Badge variant="outline" className="border-green-500 text-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Available
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold mb-2">{property.name}</h1>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{property.address}, {property.locality}, {property.city}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFavorite}
                    className="shrink-0"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isFavorite ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 pt-2 border-t">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{property.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {property.totalReviews} {property.totalReviews === 1 ? 'review' : 'reviews'}
                  </span>
                </div>

                {/* Price */}
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-teal-500">
                      ₹{property.startingPrice?.toLocaleString() || '0'}
                    </p>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>

                {/* Primary CTA */}
                <Button 
                  onClick={scrollToRoomTypes}
                  size="lg"
                  className="w-full bg-teal-500 hover:bg-teal-600 text-base h-12"
                >
                  View Available Rooms
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Contact Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={handleCallNow}
                  variant="outline"
                  className="w-full justify-start gap-2"
                  size="sm"
                >
                  <Phone className="h-4 w-4" />
                  Call Property Manager
                </Button>
                <Button 
                  onClick={handleScheduleVisit}
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  size="sm"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule a Visit
                </Button>
                <Button 
                  onClick={handleChatManager}
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  size="sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat with Manager
                </Button>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-teal-500" />
                    <span className="text-xs">Verified Property</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-teal-500" />
                    <span className="text-xs">Instant Booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-teal-500" />
                    <span className="text-xs">Professional Mgmt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-teal-500" />
                    <span className="text-xs">Premium Location</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            {/* ROOM TYPES - FEATURED SECTION */}
            <Card id="room-types-section" className="border-2 border-teal-500 shadow-lg scroll-mt-20">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-1">Available Rooms</CardTitle>
                    <p className="text-sm text-muted-foreground">Choose your preferred room type and book instantly</p>
                  </div>
                  <Building2 className="h-8 w-8 text-teal-500" />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {roomTypes.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No room types available at the moment</p>
                    <p className="text-sm text-muted-foreground mt-1">Please check back later or contact the property manager</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {roomTypes.map((room, index) => (
                      <div
                        key={room.id}
                        className="group relative overflow-hidden rounded-xl border-2 hover:border-teal-500 transition-all bg-card hover:shadow-md"
                      >
                        <div className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Room Info */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center">
                                  <Building2 className="h-6 w-6 text-teal-500" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold">{room.type}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    {room.availableRooms > 0 ? (
                                      <>
                                        <Badge variant="outline" className="border-green-500 text-green-600 text-xs">
                                          <Check className="h-3 w-3 mr-1" />
                                          {room.availableRooms} Available
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                          of {room.totalRooms} total
                                        </span>
                                      </>
                                    ) : (
                                      <Badge variant="outline" className="border-red-500 text-red-600 text-xs">
                                        <X className="h-3 w-3 mr-1" />
                                        Fully Booked
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Pricing */}
                              <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-teal-500">
                                  ₹{room.pricePerMonth.toLocaleString()}
                                </span>
                                <span className="text-muted-foreground">/month</span>
                              </div>

                              {room.availableRooms > 0 && room.availableRooms <= 3 && (
                                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                                  ⚡ Only {room.availableRooms} {room.availableRooms === 1 ? 'room' : 'rooms'} left!
                                </p>
                              )}
                            </div>

                            {/* CTA Button */}
                            <div className="flex items-center lg:flex-col gap-3">
                              <Button
                                onClick={() => handleBooking(room.id)}
                                disabled={room.availableRooms === 0}
                                size="lg"
                                className={`${
                                  room.availableRooms === 0
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-teal-500 hover:bg-teal-600'
                                } h-12 px-8 font-semibold min-w-[160px]`}
                              >
                                {room.availableRooms === 0 ? 'Fully Booked' : 'Book Now'}
                                {room.availableRooms > 0 && <ArrowRight className="ml-2 h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Availability indicator bar */}
                        {room.availableRooms > 0 && (
                          <div className="h-1 bg-muted">
                            <div 
                              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all"
                              style={{ width: `${(room.availableRooms / room.totalRooms) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities & Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allAmenities.map((amenity) => {
                    const hasAmenity = property.amenities.includes(amenity.name);
                    return (
                      <div
                        key={amenity.name}
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                          hasAmenity
                            ? "border-teal-500 bg-teal-50 dark:bg-teal-950/50"
                            : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-40"
                        }`}
                      >
                        <div className={hasAmenity ? "text-teal-500" : "text-gray-400"}>
                          {hasAmenity ? amenity.icon : <X className="h-5 w-5" />}
                        </div>
                        <span className={`font-medium text-sm ${hasAmenity ? "" : "line-through"}`}>
                          {amenity.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Guest Reviews</CardTitle>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{property.rating}</span>
                    <span className="text-sm text-muted-foreground">({reviews.length})</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No reviews yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Be the first to review this property</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{review.userName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/50 px-2 py-1 rounded">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-sm">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Location Map */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative h-48 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden border">
                  {property.latitude && property.longitude ? (
                    <>
                      <iframe
                        src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      <div className="absolute inset-0 pointer-events-none" />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">Map View</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 text-teal-500 shrink-0" />
                  <p className="text-muted-foreground">
                    {property.address}, {property.locality}, {property.city}
                  </p>
                </div>
                {property.latitude && property.longitude && (
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    size="sm"
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`,
                        '_blank'
                      );
                    }}
                  >
                    <MapPin className="h-4 w-4" />
                    Open in Google Maps
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Property Policies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-teal-500" />
                    <h4 className="font-semibold">Cancellation Policy</h4>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-4">
                    {property.cancellationPolicy || "Free cancellation up to 7 days before move-in date. 50% refund within 3 days."}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-teal-500" />
                    <h4 className="font-semibold">Refund Policy</h4>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-4">
                    {property.refundPolicy || "Full refund for cancellation 7+ days before move-in. 50% refund for 3-7 days. No refund within 3 days."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Manager Info */}
            {property.managerName && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm font-medium mb-1">Property Manager</p>
                  <p className="font-semibold text-lg">{property.managerName}</p>
                  {property.managerPhone && (
                    <p className="text-sm text-muted-foreground mt-1">{property.managerPhone}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Property Manager</DialogTitle>
            <DialogDescription>
              You can reach the property manager at:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-semibold">{property?.managerName || "Property Manager"}</p>
                <p className="text-2xl font-bold text-teal-500">{property?.managerPhone || "Not available"}</p>
              </div>
              <Phone className="h-8 w-8 text-teal-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              Phone number has been copied to clipboard. You can now call or message the manager directly.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Visit Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule a Visit</DialogTitle>
            <DialogDescription>
              Choose a convenient time to visit the property
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Time</label>
              <select className="w-full px-3 py-2 border rounded-md bg-background">
                <option>Morning (9 AM - 12 PM)</option>
                <option>Afternoon (12 PM - 3 PM)</option>
                <option>Evening (3 PM - 6 PM)</option>
              </select>
            </div>
            <Button 
              className="w-full bg-teal-500 hover:bg-teal-600"
              onClick={() => {
                toast.success("Visit request sent! Manager will contact you soon.");
                setShowScheduleDialog(false);
              }}
            >
              Confirm Visit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chat with Manager</DialogTitle>
            <DialogDescription>
              {property?.managerName || "Property Manager"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="h-[300px] border rounded-lg p-4 overflow-y-auto bg-muted/20">
              <div className="text-center text-muted-foreground text-sm">
                Start a conversation about {property?.name}
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border rounded-md bg-background"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    toast.info("Chat feature will be available soon!");
                  }
                }}
              />
              <Button 
                className="bg-teal-500 hover:bg-teal-600"
                onClick={() => toast.info("Chat feature will be available soon!")}
              >
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}