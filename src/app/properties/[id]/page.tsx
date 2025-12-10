"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { MapPin, Heart, Star, Wifi, UtensilsCrossed, Car, Wind, Phone, MessageCircle, Calendar, Loader2, ChevronLeft, Check, X, ArrowRight, Building2, Users, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";
import Image from "next/image";
import { PropertyTierBadge, getTier } from "@/components/PropertyTierBadge";
import { GenderIcon } from "@/components/GenderIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FooterSection } from "@/components/FooterSection";

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
  images?: string[];
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
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");

  const propertyImages = property?.images && property.images.length > 0
    ? property.images
    : [property?.thumbnailImage || "/placeholder.svg"];

  // If we only have one image and it's the thumbnail, we might want to show placeholders if that's the design intent,
  // but usually showing available images is better. The original code had placeholders.
  // Let's stick to what we have or fallback to placeholders if needed.
  // The original code had a hardcoded array with placeholders. Let's try to be more dynamic but robust.

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

        // Parse amenities
        let amenities: string[] = [];
        try {
          if (typeof data.amenities === "string") {
            amenities = JSON.parse(data.amenities);
          } else if (Array.isArray(data.amenities)) {
            amenities = data.amenities;
          }
        } catch {
          amenities = [];
        }

        // Parse images
        let images: string[] = [];
        try {
          if (typeof data.images === "string") {
            images = JSON.parse(data.images);
          } else if (Array.isArray(data.images)) {
            images = data.images;
          }
        } catch {
          images = [];
        }

        // Ensure thumbnail is included in images if not present
        if (data.thumbnailImage && !images.includes(data.thumbnailImage)) {
          images.unshift(data.thumbnailImage);
        }

        // If no images, use placeholders
        if (images.length === 0) {
          images = ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"];
        }

        setProperty({ ...data, amenities, images });
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
        if (data.reviews && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        } else {
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

      <div className="container max-w-7xl mx-auto px-4 py-4 min-h-[calc(100vh-80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header with Image Gallery */}
            <Carousel className="w-full">
              <CarouselContent>
                {property.images?.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] rounded-xl overflow-hidden border">
                      <Image
                        src={image}
                        alt={`${property.name} - Image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px"
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>

            {/* Description - Accordion */}
            <Card className="shadow-none">
              <Accordion type="single" collapsible defaultValue="about">
                <AccordionItem value="about" className="border-none px-4">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline py-3">
                    About This Property
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed text-sm pt-0 text-justify pb-2">
                      {property.description}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* ROOM TYPES - FEATURED SECTION */}
            <Card id="room-types-section" className="border-2 border-teal-500/20 shadow-lg scroll-mt-20 overflow-hidden">
              <CardHeader className="bg-teal-50/50 dark:bg-teal-950/20 border-b py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-teal-600" />
                      Available Rooms
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Select a room to book instantly</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {roomTypes.length === 0 ? (
                  <div className="text-center py-10">
                    <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                    <p className="text-muted-foreground text-sm">No rooms available currently</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roomTypes.map((room) => (
                      <div
                        key={room.id}
                        className="group relative flex flex-col justify-between rounded-xl border bg-card p-4 hover:border-teal-500 hover:shadow-md transition-all duration-300"
                      >
                        {/* Top: Icon & Basic Info */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center shrink-0 text-teal-600 group-hover:scale-105 transition-transform">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <h3 className="font-semibold text-base truncate" title={room.type}>
                              {room.type}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant={room.availableRooms > 0 ? "outline" : "secondary"}
                                className={`text-[10px] h-4 px-1.5 ${room.availableRooms > 0
                                  ? "border-green-500/50 text-green-600 bg-green-50 dark:bg-green-950/20"
                                  : ""
                                  }`}
                              >
                                {room.availableRooms > 0 ? (
                                  <span className="flex items-center gap-1">
                                    <Check className="h-2 w-2" />
                                    {room.availableRooms} Left
                                  </span>
                                ) : (
                                  "Sold Out"
                                )}
                              </Badge>
                              {room.availableRooms > 0 && room.availableRooms <= 3 && (
                                <span className="text-[10px] text-orange-600 font-medium animate-pulse">
                                  Fast Filling
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Bottom: Price & Action */}
                        <div className="mt-auto pt-3 border-t border-dashed">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Starting at</span>
                              <div className="flex items-baseline gap-0.5">
                                <span className="text-xl font-bold text-teal-600">
                                  ₹{room.pricePerMonth.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-muted-foreground">/mo</span>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleBooking(room.id)}
                              disabled={room.availableRooms === 0}
                              size="sm"
                              className={`font-medium h-9 px-4 ${room.availableRooms === 0
                                ? "bg-muted text-muted-foreground"
                                : "bg-teal-600 hover:bg-teal-700 shadow-sm hover:shadow-teal-500/20"
                                }`}
                            >
                              {room.availableRooms === 0 ? "Notify" : "Book"}
                              {room.availableRooms > 0 && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
                            </Button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {room.availableRooms > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted rounded-b-xl overflow-hidden">
                            <div
                              className="h-full bg-teal-500/50"
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
            <Card className="shadow-none">
              <CardHeader className="py-3 px-4 pb-2">
                <CardTitle className="text-base font-semibold">Amenities & Facilities</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allAmenities.map((amenity) => {
                    const hasAmenity = property.amenities.includes(amenity.name);
                    return (
                      <div
                        key={amenity.name}
                        className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${hasAmenity
                          ? "bg-teal-50/40 border-teal-100"
                          : "bg-gray-50/50 border-transparent opacity-60"
                          }`}
                      >
                        <div
                          className={`flex items-center justify-center h-8 w-8 rounded-full shrink-0 ${hasAmenity
                            ? "bg-teal-100 text-teal-600"
                            : "bg-gray-200 text-gray-400"
                            }`}
                        >
                          <div className="h-4 w-4">
                            {hasAmenity ? amenity.icon : <X className="h-4 w-4" />}
                          </div>
                        </div>
                        <span
                          className={`text-xs font-medium truncate ${hasAmenity
                            ? "text-foreground"
                            : "text-muted-foreground line-through"
                            }`}
                        >
                          {amenity.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="shadow-none">
              <CardHeader className="py-4 px-6 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Guest Reviews</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg">{property.rating}</span>
                      <span className="text-sm text-muted-foreground">({reviews.length})</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast.info("Review submission coming soon!")}>
                      Write a Review
                    </Button>
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
          <div className="space-y-4 h-fit sticky top-24">
            {/* Property Title Card */}
            <Card className="border shadow-none">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <PropertyTierBadge price={property.startingPrice || 0} />
                      <div className="flex items-center gap-1 bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200 text-[10px] font-medium uppercase tracking-wider">
                        <GenderIcon type={property.genderType} className="w-3 h-3" />
                        <span>{property.genderType}</span>
                      </div>
                      {property.isAvailable && (
                        <Badge variant="outline" className="border-green-500 text-green-600 h-5 px-1.5 text-[10px]">
                          <Check className="h-2.5 w-2.5 mr-1" />
                          Available
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-xl lg:text-2xl font-bold mb-1 leading-tight">{property.name}</h1>
                    <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
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
                      className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""
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
                <div className="sticky bottom-4 z-10 lg:static">
                  <Button
                    onClick={scrollToRoomTypes}
                    size="lg"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-lg font-bold h-14 shadow-xl shadow-teal-500/20 hover:scale-[1.02] transition-all"
                  >
                    View Available Rooms
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Actions */}
            <Card className="shadow-none">
              <CardHeader className="py-3 px-4 pb-0">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleCallNow}
                    variant="outline"
                    className="justify-start gap-2 h-9 text-xs"
                    size="sm"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </Button>
                  <Button
                    onClick={handleChatManager}
                    variant="outline"
                    className="justify-start gap-2 h-9 text-xs"
                    size="sm"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Chat
                  </Button>
                </div>
                <Button
                  onClick={handleScheduleVisit}
                  variant="outline"
                  className="w-full justify-start gap-2 h-9 text-xs"
                  size="sm"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Schedule Visit
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

            {/* Location Map - Accordion */}
            <Card>
              <Accordion type="single" collapsible defaultValue="location">
                <AccordionItem value="location" className="border-none px-0">
                  <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                    Location
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-3">
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Time</label>
              <select
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="">Select a time slot</option>
                <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</option>
                <option value="Evening (3 PM - 6 PM)">Evening (3 PM - 6 PM)</option>
              </select>
            </div>
            <Button
              className="w-full bg-teal-500 hover:bg-teal-600"
              onClick={async () => {
                if (!user) {
                  toast.error("Please login to schedule a visit");
                  return;
                }
                if (!visitDate || !visitTime) {
                  toast.error("Please select both date and time");
                  return;
                }

                try {
                  const response = await fetch('/api/visits', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      propertyId: property.id,
                      userId: user.id,
                      date: visitDate,
                      timeSlot: visitTime,
                    }),
                  });

                  if (!response.ok) {
                    throw new Error('Failed to schedule visit');
                  }

                  toast.success("Visit request sent! Manager will contact you soon.");
                  setShowScheduleDialog(false);
                  setVisitDate("");
                  setVisitTime("");
                } catch (error) {
                  console.error('Error scheduling visit:', error);
                  toast.error("Failed to schedule visit. Please try again.");
                }
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
      <div className="mt-12">
        <FooterSection />
      </div>
    </main>
  );
}