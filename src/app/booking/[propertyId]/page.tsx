"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ChevronLeft, Calendar as CalendarIcon, Loader2, CreditCard, Wallet, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";

interface Property {
  id: number;
  name: string;
  address: string;
  city: string;
  thumbnailImage: string;
}

interface RoomType {
  id: number;
  roomType: string;
  price: number;
  availableRooms: number;
}

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [property, setProperty] = useState<Property | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Booking details
  const [selectedRoomType, setSelectedRoomType] = useState<string>(searchParams.get("roomType") || "");
  const [duration, setDuration] = useState<string>("1");
  const [moveInDate, setMoveInDate] = useState<Date>();
  const [paymentMethod, setPaymentMethod] = useState<string>("full");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to book");
      router.push("/login");
      return;
    }
    fetchPropertyAndRooms();
  }, [user]);

  const fetchPropertyAndRooms = async () => {
    try {
      const [propertyRes, roomsRes] = await Promise.all([
        fetch(`/api/properties/${params.propertyId}`),
        fetch(`/api/room-types/property/${params.propertyId}`)
      ]);

      if (propertyRes.ok) {
        const propertyData = await propertyRes.json();
        setProperty(propertyData);
      }

      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        setRoomTypes(roomsData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const getSelectedRoom = () => {
    return roomTypes.find(room => room.id.toString() === selectedRoomType);
  };

  const calculateTotal = () => {
    const room = getSelectedRoom();
    if (!room) return { monthlyRent: 0, securityDeposit: 0, bookingAmount: 0, totalRent: 0, total: 0, months: 0, remainingAmount: 0 };

    const monthlyRent = room.price;
    const months = parseInt(duration);
    const totalRent = monthlyRent * months;
    const securityDeposit = monthlyRent; // 1 month deposit
    const bookingAmount = Math.round(monthlyRent * 0.2); // 20% booking amount
    const total = paymentMethod === "full" ? totalRent + securityDeposit : bookingAmount;
    const remainingAmount = (totalRent + securityDeposit) - bookingAmount;

    return { monthlyRent, securityDeposit, bookingAmount, totalRent, total, months, remainingAmount };
  };

  const handleBooking = async () => {
    if (!selectedRoomType) {
      toast.error("Please select a room type");
      return;
    }
    if (!moveInDate) {
      toast.error("Please select move-in date");
      return;
    }
    if (!duration) {
      toast.error("Please select stay duration");
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmBooking = async () => {
    setProcessing(true);
    setShowConfirmDialog(false);

    try {
      const room = getSelectedRoom();
      const calculations = calculateTotal();

      // Create booking
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          propertyId: params.propertyId,
          roomTypeId: selectedRoomType,
          moveInDate: moveInDate?.toISOString(),
          duration: parseInt(duration),
          totalAmount: calculations.totalRent + calculations.securityDeposit,
          status: "confirmed",
        }),
      });

      if (!bookingResponse.ok) {
        throw new Error("Failed to create booking");
      }

      const booking = await bookingResponse.json();

      // Create payment record
      const paymentResponse = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          userId: user?.id,
          amount: calculations.total,
          paymentMethod: paymentMethod === "full" ? "online" : "booking",
          paymentStatus: "completed",
          transactionId: `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Failed to process payment");
      }

      setBookingSuccess(true);
      toast.success("🎉 Booking confirmed successfully!");
      
      // Redirect to bookings page after showing success
      setTimeout(() => {
        router.push("/bookings");
      }, 2000);
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Failed to complete booking. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <p className="text-muted-foreground">Property not found</p>
        <Button onClick={() => router.push("/properties")} className="bg-teal-500 hover:bg-teal-600">
          Browse Properties
        </Button>
      </div>
    );
  }

  const calculations = calculateTotal();
  const selectedRoom = getSelectedRoom();

  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-900">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Property
          </Button>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground">Review your details and confirm your booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    <Image
                      src={property.thumbnailImage || "/placeholder.jpg"}
                      alt={property.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{property.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {property.address}, {property.city}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 1: Room Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  Select Room Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose your preferred room configuration" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((room) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span className="font-medium">{room.roomType}</span>
                          <span className="text-teal-600 font-semibold">₹{room.price.toLocaleString()}/month</span>
                          <span className="text-xs text-muted-foreground">({room.availableRooms} available)</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedRoom && (
                  <Alert className="border-teal-200 bg-teal-50 dark:bg-teal-950">
                    <Info className="h-4 w-4 text-teal-600" />
                    <AlertDescription className="text-sm">
                      <strong>{selectedRoom.availableRooms}</strong> {selectedRoom.roomType} room(s) available at <strong>₹{selectedRoom.price.toLocaleString()}</strong> per month
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Duration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  Choose Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select booking duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="2">2 Months</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months (Popular)</SelectItem>
                    <SelectItem value="12">12 Months (Best Value)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Step 3: Move-in Date */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  Pick Move-in Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-12"
                    >
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {moveInDate ? format(moveInDate, "PPP") : "Select your move-in date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={moveInDate}
                      onSelect={setMoveInDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {moveInDate && (
                  <p className="text-sm text-muted-foreground mt-2">
                    You can move in on <strong>{format(moveInDate, "EEEE, MMMM d, yyyy")}</strong>
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Step 4: Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  Choose Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div
                  className={`p-5 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "full" 
                      ? "border-teal-500 bg-teal-50 dark:bg-teal-950 shadow-md" 
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => setPaymentMethod("full")}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0">
                      {paymentMethod === "full" && (
                        <div className="h-3 w-3 rounded-full bg-teal-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-5 w-5 text-teal-600" />
                        <h4 className="font-semibold text-lg">Pay Full Amount</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Pay total rent (monthly rent × duration) + security deposit now
                      </p>
                      <div className="flex items-center gap-2 text-xs text-teal-600 font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        Complete everything in one payment • Move in without additional payment
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-5 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "booking" 
                      ? "border-teal-500 bg-teal-50 dark:bg-teal-950 shadow-md" 
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => setPaymentMethod("booking")}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0">
                      {paymentMethod === "booking" && (
                        <div className="h-3 w-3 rounded-full bg-teal-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Wallet className="h-5 w-5 text-teal-600" />
                        <h4 className="font-semibold text-lg">Pay Booking Amount</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Pay 20% booking amount now to secure the property
                      </p>
                      <div className="flex items-center gap-2 text-xs text-teal-600 font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        Pay remaining amount on move-in day • Flexible payment option
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Breakdown Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                <CardTitle>Price Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {selectedRoom ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm pb-2 border-b">
                        <span className="text-muted-foreground">Monthly Rent</span>
                        <span className="font-semibold text-lg">₹{calculations.monthlyRent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pb-2 border-b">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-semibold">{calculations.months} month(s)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pb-2 border-b">
                        <span className="text-muted-foreground">Total Rent</span>
                        <span className="font-semibold">₹{calculations.totalRent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pb-2 border-b">
                        <span className="text-muted-foreground">Security Deposit</span>
                        <span className="font-semibold">₹{calculations.securityDeposit.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-muted-foreground italic">
                        Security deposit is refundable
                      </div>
                      {paymentMethod === "booking" && (
                        <>
                          <div className="flex justify-between items-center text-sm pb-2 border-b bg-amber-50 dark:bg-amber-950 -mx-4 px-4 py-2">
                            <span className="text-muted-foreground">Booking Amount (20%)</span>
                            <span className="font-semibold text-amber-600">₹{calculations.bookingAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Remaining Amount</span>
                            <span className="font-medium">₹{calculations.remainingAmount.toLocaleString()}</span>
                          </div>
                          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950">
                            <Info className="h-4 w-4 text-amber-600" />
                            <AlertDescription className="text-xs">
                              Pay remaining <strong>₹{calculations.remainingAmount.toLocaleString()}</strong> on move-in day
                            </AlertDescription>
                          </Alert>
                        </>
                      )}
                    </div>
                    <div className="border-t-2 pt-4 -mx-4 px-4 bg-gray-50 dark:bg-gray-900">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-lg">Total Payable Now</span>
                        <span className="text-3xl font-bold text-teal-500">
                          ₹{calculations.total.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white h-12 text-lg font-semibold"
                        size="lg"
                        onClick={handleBooking}
                        disabled={!selectedRoomType || !moveInDate || !duration || processing}
                      >
                        {processing ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-3">
                        🔒 Secure payment • By booking, you agree to our terms
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-3 flex items-center justify-center">
                      <Info className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Select room type to see price breakdown
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Your Booking</DialogTitle>
            <DialogDescription>
              Please review your booking details before confirming payment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Property</span>
                <span className="font-medium text-right">{property.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Room Type</span>
                <span className="font-medium">{selectedRoom?.roomType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Move-in Date</span>
                <span className="font-medium">
                  {moveInDate ? format(moveInDate, "MMM d, yyyy") : "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{duration} month(s)</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">
                  {paymentMethod === "full" ? "Full Amount" : "Booking Amount (20%)"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-bold">Amount to Pay</span>
                <span className="text-2xl font-bold text-teal-500">₹{calculations.total.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11"
                onClick={() => setShowConfirmDialog(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 h-11 text-white font-semibold"
                onClick={confirmBooking}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm & Pay"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={bookingSuccess} onOpenChange={setBookingSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4">
              <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-2xl text-center">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-center">
              Your payment has been processed successfully
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg space-y-2">
              <p className="text-sm text-center">
                <strong className="text-green-700 dark:text-green-400">Transaction ID:</strong> TXN{Date.now()}
              </p>
              <p className="text-sm text-center text-muted-foreground">
                Booking status: <strong className="text-green-600">Confirmed</strong>
              </p>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Redirecting to your bookings page...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}