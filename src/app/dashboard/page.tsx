"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Calendar, CreditCard, Wrench, MessageCircle, Loader2, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";
import { format } from "date-fns";

interface CurrentStay {
  booking: {
    id: number;
    propertyId: number;
    moveInDate: string;
    duration: number;
    totalAmount: number;
  };
  property: {
    name: string;
    city: string;
    locality: string;
  };
  roomType: {
    roomType: string;
    price: number;
  };
}

interface Payment {
  id: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  createdAt: string;
}

interface MaintenanceRequest {
  id: number;
  issueType: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const [currentStay, setCurrentStay] = useState<CurrentStay | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [newRequest, setNewRequest] = useState({ issueType: "", description: "" });

  useEffect(() => {
    if (!user) {
      toast.error("Please login to view dashboard");
      router.push("/login");
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      // Fetch active booking
      const bookingsRes = await fetch(`/api/bookings/user/${user.id}/active`);
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        if (bookingsData.length > 0) {
          const booking = bookingsData[0];
          
          // Fetch property and room type details
          const [propertyRes, roomTypeRes] = await Promise.all([
            fetch(`/api/properties/${booking.propertyId}`),
            fetch(`/api/room-types/${booking.roomTypeId}`)
          ]);

          const property = propertyRes.ok ? await propertyRes.json() : null;
          const roomType = roomTypeRes.ok ? await roomTypeRes.json() : null;

          if (property && roomType) {
            setCurrentStay({
              booking,
              property: {
                name: property.name,
                city: property.city,
                locality: property.locality
              },
              roomType: {
                roomType: roomType.roomType,
                price: roomType.price
              }
            });
          }
        }
      }

      // Fetch payments
      const paymentsRes = await fetch(`/api/payments/user/${user.id}`);
      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData);
      }

      // Fetch maintenance requests
      const maintenanceRes = await fetch(`/api/maintenance/user/${user.id}`);
      if (maintenanceRes.ok) {
        const maintenanceData = await maintenanceRes.json();
        setMaintenanceRequests(maintenanceData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const submitMaintenanceRequest = async () => {
    if (!user) return;
    
    if (!newRequest.issueType || !newRequest.description) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          propertyId: currentStay?.booking.propertyId,
          issueType: newRequest.issueType,
          description: newRequest.description,
          status: "pending",
        }),
      });

      if (response.ok) {
        toast.success("Maintenance request submitted");
        setShowMaintenanceDialog(false);
        setNewRequest({ issueType: "", description: "" });
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Failed to submit request:", error);
      toast.error("Failed to submit request");
    }
  };

  const getMaintenanceStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
      pending: { label: "Pending", variant: "secondary" },
      in_progress: { label: "In Progress", variant: "default" },
      resolved: { label: "Resolved", variant: "default" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getMaintenanceIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
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
            <Home className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Resident Dashboard</h1>
          </div>
          <p className="text-white/90">Welcome back, {user?.name}! 👋</p>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Stay */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Current Stay
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentStay ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {currentStay.property.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {currentStay.property.locality}, {currentStay.property.city}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Room Type</p>
                        <p className="font-medium">{currentStay.roomType.roomType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Monthly Rent</p>
                        <p className="font-medium text-teal-500">
                          ₹{currentStay.roomType.price.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Move-in Date</p>
                        <p className="font-medium">
                          {format(new Date(currentStay.booking.moveInDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Rent Due</p>
                        <p className="font-medium text-red-500">5 days remaining</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button className="flex-1 bg-teal-500 hover:bg-teal-600">
                        Pay Rent
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No active booking</p>
                    <Button
                      onClick={() => router.push("/properties")}
                      className="bg-teal-500 hover:bg-teal-600"
                    >
                      Find a PG
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No payment history</p>
                ) : (
                  <div className="space-y-3">
                    {payments.slice(0, 5).map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-teal-500" />
                          </div>
                          <div>
                            <p className="font-medium">Payment #{payment.transactionId}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-teal-500">
                            ₹{payment.amount.toLocaleString()}
                          </p>
                          <Badge variant={payment.paymentStatus === "completed" ? "default" : "secondary"}>
                            {payment.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Maintenance Requests */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Maintenance Requests
                  </CardTitle>
                  <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">Add Request</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New Maintenance Request</DialogTitle>
                        <DialogDescription>
                          Submit a maintenance request for your room
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Issue Type</label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={newRequest.issueType}
                            onChange={(e) => setNewRequest({ ...newRequest, issueType: e.target.value })}
                          >
                            <option value="">Select issue type</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="AC/Heating">AC/Heating</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <Textarea
                            placeholder="Describe the issue..."
                            value={newRequest.description}
                            onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowMaintenanceDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="flex-1 bg-teal-500 hover:bg-teal-600"
                            onClick={submitMaintenanceRequest}
                          >
                            Submit Request
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {maintenanceRequests.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No maintenance requests</p>
                ) : (
                  <div className="space-y-3">
                    {maintenanceRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-start justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          {getMaintenanceIcon(request.status)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{request.issueType}</p>
                              {getMaintenanceStatusBadge(request.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {request.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(request.createdAt), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start gap-2" variant="outline">
                  <CreditCard className="h-4 w-4" />
                  Pay Rent
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <MessageCircle className="h-4 w-4" />
                  Contact Manager
                </Button>
                <Button
                  className="w-full justify-start gap-2"
                  variant="outline"
                  onClick={() => router.push("/bookings")}
                >
                  <Calendar className="h-4 w-4" />
                  View Bookings
                </Button>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Need assistance? Contact our support team
                </p>
                <Button className="w-full bg-teal-500 hover:bg-teal-600">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
