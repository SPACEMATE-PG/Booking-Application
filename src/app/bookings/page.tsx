"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Loader2,
  PackageX,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";

interface Booking {
  id: number;
  propertyId: number;
  roomTypeId: number;
  moveInDate: string;
  duration: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  property: {
    name: string;
    city: string;
    locality: string;
    thumbnailImage: string;
  };
  roomType: {
    roomType: string;
    price: number;
  };
}

export default function BookingsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user) {
      toast.error("Please login to view bookings");
      router.push("/login");
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/bookings/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();

        // Fetch property and room type details for each booking
        const bookingsWithDetails = await Promise.all(
          data.map(async (booking: any) => {
            const [propertyRes, roomTypeRes] = await Promise.all([
              fetch(`/api/properties/${booking.propertyId}`),
              fetch(`/api/room-types/${booking.roomTypeId}`),
            ]);

            const property = propertyRes.ok ? await propertyRes.json() : null;
            const roomType = roomTypeRes.ok ? await roomTypeRes.json() : null;

            return {
              ...booking,
              property: property
                ? {
                    name: property.name,
                    city: property.city,
                    locality: property.locality,
                    thumbnailImage: property.thumbnailImage,
                  }
                : null,
              roomType: roomType
                ? {
                    roomType: roomType.roomType,
                    price: roomType.price,
                  }
                : null,
            };
          })
        );

        setBookings(
          bookingsWithDetails.filter((b) => b.property && b.roomType)
        );
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      pending: { label: "Pending", variant: "secondary" },
      confirmed: { label: "Confirmed", variant: "default" },
      active: { label: "Active", variant: "default" },
      completed: { label: "Completed", variant: "outline" },
      cancelled: { label: "Cancelled", variant: "destructive" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  const filterBookings = (status: string) => {
    if (status === "all") return bookings;
    if (status === "upcoming")
      return bookings.filter((b) => b.status === "confirmed");
    if (status === "active")
      return bookings.filter((b) => b.status === "active");
    if (status === "past")
      return bookings.filter(
        (b) => b.status === "completed" || b.status === "cancelled"
      );
    return bookings;
  };

  const filteredBookings = filterBookings(activeTab);

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
            <Calendar className="h-8 w-8" />
            <h1 className="text-4xl font-bold">My Bookings</h1>
          </div>
          <p className="text-white/90">
            Manage your PG bookings and reservations
          </p>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-20">
                <PackageX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">
                  No bookings found
                </h2>
                <p className="text-muted-foreground mb-6">
                  {activeTab === "all"
                    ? "You haven't made any bookings yet"
                    : `No ${activeTab} bookings available`}
                </p>
                <Button
                  onClick={() => router.push("/properties")}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Browse Properties
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Property Image */}
                        <div className="relative w-full md:w-48 h-48 bg-gray-200 flex-shrink-0">
                          <Image
                            src={booking.property.thumbnailImage}
                            alt={booking.property.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 192px"
                            className="object-cover"
                          />
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1 p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">
                                {booking.property.name}
                              </h3>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  {booking.property.locality},{" "}
                                  {booking.property.city}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(booking.status)}
                              {getStatusBadge(booking.status)}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Room Type
                              </p>
                              <p className="font-medium">
                                {booking.roomType.roomType}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Move-in Date
                              </p>
                              <p className="font-medium">
                                {format(
                                  new Date(booking.moveInDate),
                                  "MMM dd, yyyy"
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Duration
                              </p>
                              <p className="font-medium">
                                {booking.duration} month(s)
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Total Amount
                              </p>
                              <p className="font-medium text-teal-500">
                                ₹{booking.totalAmount.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              onClick={() =>
                                router.push(`/properties/${booking.propertyId}`)
                              }
                            >
                              View Property
                            </Button>
                            {booking.status === "confirmed" && (
                              <Button className="bg-teal-500 hover:bg-teal-600">
                                Contact Manager
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
