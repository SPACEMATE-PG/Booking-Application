"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Camera } from "lucide-react";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";

function ProfileSetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    age: "",
    occupation: "Student",
    profilePhoto: "https://i.pravatar.cc/150?img=1",
  });

  const phone = searchParams.get("phone");

  useEffect(() => {
    if (!phone) {
      router.push("/login");
    }
  }, [phone, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.age) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          name: formData.name,
          gender: formData.gender,
          age: parseInt(formData.age),
          occupation: formData.occupation,
          profilePhoto: formData.profilePhoto,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        toast.success("Profile created successfully!");
        router.push("/");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create profile");
      }
    } catch (error) {
      console.error("Profile setup error:", error);
      toast.error("Failed to create profile. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>Tell us a bit about yourself to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-teal-500"
                  onClick={() => {
                    const randomImg = Math.floor(Math.random() * 70) + 1;
                    setFormData({ ...formData, profilePhoto: `https://i.pravatar.cc/150?img=${randomImg}` });
                    toast.success("Profile photo updated!");
                  }}
                >
                  <Camera className="h-4 w-4 text-teal-500" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Click camera to change photo</p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender *</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male" className="font-normal cursor-pointer">
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female" className="font-normal cursor-pointer">
                    Female
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Other" id="other" />
                  <Label htmlFor="other" className="font-normal cursor-pointer">
                    Other
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                min="18"
                max="100"
                required
              />
            </div>

            {/* Occupation */}
            <div className="space-y-2">
              <Label>Occupation *</Label>
              <RadioGroup
                value={formData.occupation}
                onValueChange={(value) => setFormData({ ...formData, occupation: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Student" id="student" />
                  <Label htmlFor="student" className="font-normal cursor-pointer">
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Professional" id="professional" />
                  <Label htmlFor="professional" className="font-normal cursor-pointer">
                    Professional
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600"
            >
              {loading ? "Creating Profile..." : "Complete Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfileSetupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileSetupForm />
    </Suspense>
  );
}
