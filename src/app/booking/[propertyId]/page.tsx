"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  Calendar as CalendarIcon,
  Loader2,
  CreditCard,
  Wallet,
  CheckCircle2,
  Info,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  type: string;
  pricePerMonth: number;
  availableRooms: number;
  totalRooms: number;
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
  const [selectedRoomType, setSelectedRoomType] = useState<string>(
    searchParams.get("roomType") || ""
  );
  const [duration, setDuration] = useState<string>("1");
  const [moveInDate, setMoveInDate] = useState<Date | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("full");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Validation State
  const [touched, setTouched] = useState({
    roomType: false,
    duration: false,
    moveInDate: false,
  });

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
        fetch(`/api/room-types/property/${params.propertyId}`),
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
    return roomTypes.find((room) => room.id.toString() === selectedRoomType);
  };

  const calculateTotal = () => {
    const room = getSelectedRoom();
    if (!room)
      return {
        monthlyRent: 0,
        securityDeposit: 0,
        bookingAmount: 0,
        totalRent: 0,
        total: 0,
        months: 0,
        remainingAmount: 0,
      };

    const monthlyRent = room.pricePerMonth;
    const months = parseInt(duration);
    const totalRent = monthlyRent * months;
    const securityDeposit = monthlyRent; // 1 month deposit
    const bookingAmount = Math.round(monthlyRent * 0.2); // 20% booking amount
    const total =
      paymentMethod === "full" ? totalRent + securityDeposit : bookingAmount;
    const remainingAmount = totalRent + securityDeposit - bookingAmount;

    return {
      monthlyRent,
      securityDeposit,
      bookingAmount,
      totalRent,
      total,
      months,
      remainingAmount,
    };
  };

  // Progress Calculation
  const getProgress = () => {
    let steps = 0;
    if (selectedRoomType) steps++;
    if (duration) steps++;
    if (moveInDate) steps++;
    if (paymentMethod) steps++;
    return (steps / 4) * 100;
  };

  const handleBooking = async () => {
    setTouched({
      roomType: true,
      duration: true,
      moveInDate: true,
    });

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
          transactionId: `TXN${Date.now()}${Math.random()
            .toString(36)
            .substring(2, 9)
            .toUpperCase()}`,
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
        <Button
          onClick={() => router.push("/properties")}
          className="bg-teal-500 hover:bg-teal-600"
        >
          Browse Properties
        </Button>
      </div>
    );
  }

  const calculations = calculateTotal();
  const selectedRoom = getSelectedRoom();
  const progress = getProgress();
  const isFormValid = selectedRoomType && duration && moveInDate;

  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-900 sticky top-0 z-40 shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Property
            </Button>
            <span className="text-sm font-medium text-muted-foreground">
              Step {Math.ceil(progress / 25)} of 4
            </span>
          </div>
          {/* Progress Bar */}
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground">
            Just a few more details to confirm your stay at {property.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-5">
                  <div className="relative h-24 w-24 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden border">
                    <Image
                      src={property.thumbnailImage || "/placeholder.jpg"}
                      alt={property.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="py-1">
                    <h3 className="font-bold text-xl mb-1">{property.name}</h3>
                    <p className="text-muted-foreground">
                      {property.address}, {property.city}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 1: Room Selection */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">1</span>
                Select Room Type
              </h2>
              <Card className={touched.roomType && !selectedRoomType ? "border-red-500" : ""}>
                <CardContent className="p-6 space-y-4">
                  <Select
                    value={selectedRoomType}
                    onValueChange={(val) => {
                      setSelectedRoomType(val);
                      setTouched({ ...touched, roomType: true });
                    }}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select a room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          <div className="flex items-center justify-between w-full gap-4 min-w-[300px]">
                            <span className="font-medium">{room.type}</span>
                            <span className="text-teal-600 font-semibold">
                              ₹{room.pricePerMonth.toLocaleString()}/mo
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {touched.roomType && !selectedRoomType && (
                    <p className="text-sm font-medium text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Please select a room type
                    </p>
                  )}

                  {!selectedRoomType && !touched.roomType && (
                    <p className="text-sm text-muted-foreground">
                      Choose the room configuration that suits you best
                    </p>
                  )}

                  {selectedRoom && (
                    <div className="bg-teal-50 dark:bg-teal-950/30 rounded-lg p-4 border border-teal-100 dark:border-teal-900 flex items-start gap-3">
                      <Info className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-teal-900 dark:text-teal-100">
                          {selectedRoom.type} Selection
                        </p>
                        <p className="text-teal-700 dark:text-teal-300 mt-1">
                          You've selected a {selectedRoom.type}. We have <strong>{selectedRoom.availableRooms}</strong> units available.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Step 2: Duration */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">2</span>
                Stay Duration
              </h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Select
                    value={duration}
                    onValueChange={(val) => {
                      setDuration(val);
                      setTouched({ ...touched, duration: true });
                    }}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="How long will you stay?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="2">2 Months</SelectItem>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months (Popular)</SelectItem>
                      <SelectItem value="12">12 Months (Best Value)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Longer stays might be eligible for future discounts.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Step 3: Move-in Date */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">3</span>
                Move-in Date
              </h2>
              <Card className={touched.moveInDate && !moveInDate ? "border-red-500" : ""}>
                <CardContent className="p-6 space-y-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal h-12 text-base ${!moveInDate && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        {moveInDate ? format(moveInDate, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={moveInDate}
                        onSelect={(date) => {
                          setMoveInDate(date);
                          setTouched({ ...touched, moveInDate: true });
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {touched.moveInDate && !moveInDate && (
                    <p className="text-sm font-medium text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Please select a valid move-in date
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground">
                    Rent billing cycles typically start from your move-in date.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Step 4: Payment Method */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">4</span>
                Payment Method
              </h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "full"
                        ? "border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                      }`}
                    onClick={() => setPaymentMethod("full")}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-6 w-6 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors border-teal-500">
                        {paymentMethod === "full" && (
                          <div className="h-3 w-3 rounded-full bg-teal-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="h-5 w-5 text-teal-600" />
                          <h4 className="font-bold text-base">Pay Full Amount</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Pay total rent + security deposit now. Best for immediate confirmation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "booking"
                        ? "border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                      }`}
                    onClick={() => setPaymentMethod("booking")}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-6 w-6 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors border-teal-500">
                        {paymentMethod === "booking" && (
                          <div className="h-3 w-3 rounded-full bg-teal-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Wallet className="h-5 w-5 text-teal-600" />
                          <h4 className="font-bold text-base">Pay Booking Amount</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Pay small token amount now to block the room. Pay rest on check-in.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Price Breakdown Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="shadow-lg border-t-4 border-t-teal-500">
                <CardHeader>
                  <CardTitle className="text-xl">Price Breakdown</CardTitle>
                  <CardDescription>Summary of your charges</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedRoom ? (
                    <>
                      <Accordion type="single" collapsible defaultValue="breakdown" className="w-full">
                        <AccordionItem value="breakdown" className="border-0">
                          <AccordionTrigger className="hover:no-underline py-2 text-sm font-medium">
                            <span className="flex items-center gap-2">
                              View Itemized Details
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-4 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Monthly Rent</span>
                              <span>₹{calculations.monthlyRent.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Duration</span>
                              <span>{calculations.months} month(s)</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-medium pt-2 border-t">
                              <span>Total Rent</span>
                              <span>₹{calculations.totalRent.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Security Deposit</span>
                              <span>₹{calculations.securityDeposit.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground italic mt-2">
                              * Security deposit is fully refundable upon move-out.
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      {paymentMethod === "booking" && (
                        <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-100 dark:border-amber-900 space-y-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-amber-900 dark:text-amber-100">
                            <span>Booking Token (20%)</span>
                            <span>₹{calculations.bookingAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Remaining due on arrival</span>
                            <span>₹{calculations.remainingAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-dashed">
                        <div className="flex justify-between items-end mb-1">
                          <span className="font-semibold text-lg">Total Payable</span>
                          <span className="text-3xl font-bold text-teal-600">
                            ₹{calculations.total.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground text-right">
                          Includes all taxes and fees
                        </p>
                      </div>

                      <Button
                        className="w-full bg-teal-600 hover:bg-teal-700 h-14 text-lg font-bold shadow-lg shadow-teal-500/20 transition-all mt-4"
                        onClick={handleBooking}
                        disabled={!isFormValid || processing}
                      >
                        {processing ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          "Confirm Booking"
                        )}
                      </Button>

                      {!isFormValid && (
                        <p className="text-xs text-center text-red-500 font-medium animate-pulse">
                          Please complete all steps to proceed
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg bg-gray-50/50">
                      <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        Select a room type to calculate pricing
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground grayscale opacity-60">
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  Secure Payment
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified Property
                </div>
              </div>
            </div>
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
                <span className="font-medium">{selectedRoom?.type}</span>
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
                  {paymentMethod === "full"
                    ? "Full Amount"
                    : "Booking Amount (20%)"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-bold">Amount to Pay</span>
                <span className="text-2xl font-bold text-teal-500">
                  ₹{calculations.total.toLocaleString()}
                </span>
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
            <DialogTitle className="text-2xl text-center">
              Booking Confirmed!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your payment has been processed successfully
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg space-y-2">
              <p className="text-sm text-center">
                <strong className="text-green-700 dark:text-green-400">
                  Transaction ID:
                </strong>{" "}
                TXN{Date.now()}
              </p>
              <p className="text-sm text-center text-muted-foreground">
                Booking status:{" "}
                <strong className="text-green-600">Confirmed</strong>
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
