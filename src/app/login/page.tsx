"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Phone, Lock } from "lucide-react";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    // Simulate OTP sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setStep("otp");
    toast.success("OTP sent successfully! Use 123456 to login");
  };

  const handleVerifyOTP = async () => {
    if (otp !== "123456") {
      toast.error("Invalid OTP. Please use 123456 for demo");
      return;
    }

    setLoading(true);

    try {
      // Check if user exists
      const response = await fetch(`/api/users/phone/${phone}`);

      if (response.ok) {
        // User exists, log them in
        const userData = await response.json();
        setUser(userData);
        toast.success(`Welcome back, ${userData.name}!`);
        router.push("/");
      } else if (response.status === 404) {
        // New user, redirect to profile setup
        router.push(`/profile-setup?phone=${phone}`);
      } else {
        toast.error("Something went wrong. Please try again");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to verify OTP. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-teal-500 rounded-full">
              <Home className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to PGStay</CardTitle>
          <CardDescription>
            {step === "phone"
              ? "Enter your mobile number to get started"
              : "Enter the OTP sent to your mobile"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "phone" ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="pl-10"
                    maxLength={10}
                  />
                </div>
              </div>
              <Button
                onClick={handleSendOTP}
                disabled={loading || phone.length < 10}
                className="w-full bg-teal-500 hover:bg-teal-600"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter OTP</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="pl-10"
                    maxLength={6}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  OTP sent to +91 {phone.slice(0, 5)}*****
                </p>
              </div>
              <Button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length < 6}
                className="w-full bg-teal-500 hover:bg-teal-600"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                }}
                className="w-full"
              >
                Change Mobile Number
              </Button>
            </>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>Demo: Use OTP <strong>123456</strong> to login</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
