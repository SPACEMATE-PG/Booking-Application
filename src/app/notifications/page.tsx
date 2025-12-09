"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Trash2, Calendar, DollarSign, Wrench, Tag, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";

interface Notification {
  id: number;
  type: "rent" | "booking" | "maintenance" | "offer" | "alert";
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "rent",
    title: "Rent Due Soon",
    message: "Your rent of ₹12,000 for Comfort PG is due on 5th Dec 2024. Pay now to avoid late fees.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    actionUrl: "/dashboard"
  },
  {
    id: 2,
    type: "booking",
    title: "Booking Confirmed",
    message: "Your booking at Green Valley PG has been confirmed. Move-in date: 10th Dec 2024.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    actionUrl: "/bookings"
  },
  {
    id: 3,
    type: "maintenance",
    title: "Maintenance Request Updated",
    message: "Your WiFi issue maintenance request has been resolved. Thank you for your patience.",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: "/dashboard"
  },
  {
    id: 4,
    type: "offer",
    title: "Special Offer: 10% Off",
    message: "Get 10% off on your next booking! Use code: WELCOME10. Valid till 31st Dec 2024.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: "/properties"
  },
  {
    id: 5,
    type: "alert",
    title: "Property Update",
    message: "New amenities added at Comfort PG: Gym and Swimming Pool now available!",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: "/properties/1"
  }
];

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchNotifications();
  }, [user, router]);

  const fetchNotifications = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setNotifications(mockNotifications);
    setLoading(false);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    toast.success("Marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success("Notification deleted");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "rent": return <DollarSign className="h-5 w-5" />;
      case "booking": return <Calendar className="h-5 w-5" />;
      case "maintenance": return <Wrench className="h-5 w-5" />;
      case "offer": return <Tag className="h-5 w-5" />;
      case "alert": return <AlertCircle className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "rent": return "bg-red-500/10 text-red-500";
      case "booking": return "bg-green-500/10 text-green-500";
      case "maintenance": return "bg-blue-500/10 text-blue-500";
      case "offer": return "bg-purple-500/10 text-purple-500";
      case "alert": return "bg-yellow-500/10 text-yellow-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Notifications</h1>
              <p className="text-white/90">
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : "You're all caught up!"}
              </p>
            </div>
            <div className="relative">
              <Bell className="h-12 w-12" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            </TabsList>
          </Tabs>

          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              className="gap-2 w-full sm:w-auto"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                {filter === "unread" ? "No unread notifications" : "No notifications yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {filter === "unread" 
                  ? "You're all caught up! Check back later for updates."
                  : "We'll notify you when there's something new."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`hover:shadow-md transition-shadow ${!notification.isRead ? "border-l-4 border-l-teal-500" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-full ${getTypeColor(notification.type)} shrink-0`}>
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {!notification.isRead && (
                          <Badge variant="secondary" className="bg-teal-500 text-white shrink-0">New</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mb-3">{formatDate(notification.createdAt)}</p>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        {notification.actionUrl && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => router.push(notification.actionUrl!)}
                          >
                            View Details
                          </Button>
                        )}
                        {!notification.isRead && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCheck className="h-4 w-4 mr-1" />
                            Mark as Read
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}