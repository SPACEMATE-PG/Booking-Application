"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Calendar, Briefcase, Camera, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, refreshUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    age: "",
    occupation: "",
  });

  useEffect(() => {
    if (!user) {
      toast.error("Please login to view profile");
      router.push("/login");
      return;
    }
    
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      gender: user.gender || "",
      age: user.age?.toString() || "",
      occupation: user.occupation || "",
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          gender: formData.gender,
          age: parseInt(formData.age),
          occupation: formData.occupation,
        }),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
        await refreshUser();
        setEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) {
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
            <User className="h-8 w-8" />
            <h1 className="text-4xl font-bold">My Profile</h1>
          </div>
          <p className="text-white/90">Manage your account information</p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="h-32 w-32 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <button className="absolute bottom-0 right-0 h-10 w-10 bg-teal-500 rounded-full flex items-center justify-center text-white hover:bg-teal-600 transition-colors">
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  {!editing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            name: user.name || "",
                            phone: user.phone || "",
                            gender: user.gender || "",
                            age: user.age?.toString() || "",
                            occupation: user.occupation || "",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-600"
                        onClick={handleSave}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </label>
                  {editing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="p-2 bg-muted rounded-md">{user.name || "-"}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </label>
                  <p className="p-2 bg-muted rounded-md">{user.phone}</p>
                  <p className="text-xs text-muted-foreground">
                    Phone number cannot be changed
                  </p>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Gender
                  </label>
                  {editing ? (
                    <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="p-2 bg-muted rounded-md">{user.gender || "-"}</p>
                  )}
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Age
                  </label>
                  {editing ? (
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="Enter your age"
                      min="18"
                      max="100"
                    />
                  ) : (
                    <p className="p-2 bg-muted rounded-md">{user.age || "-"}</p>
                  )}
                </div>

                {/* Occupation */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Occupation
                  </label>
                  {editing ? (
                    <Select value={formData.occupation} onValueChange={(value) => setFormData({ ...formData, occupation: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="p-2 bg-muted rounded-md">{user.occupation || "-"}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Help & Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Terms & Conditions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Privacy Policy
                </Button>
                <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
