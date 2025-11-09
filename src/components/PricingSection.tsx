"use client";

import { BadgeCheck } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const PRICING_PLANS = [
  {
    name: "Basic Stay",
    monthlyPrice: "₹8,999",
    yearlyPrice: "₹95,000",
    period: {
      monthly: "Per month",
      yearly: "Per year",
    },
    description: {
      monthly: "Perfect for students & budget stays.",
      yearly: "Perfect for students & budget stays.",
    },
    buttonText: "Book Now",
    highlighted: false,
    features: [
      "Double/Triple sharing",
      "Basic WiFi included",
      "Daily housekeeping",
      "Community kitchen",
      "24/7 security",
    ],
  },
  {
    name: "Premium Stay",
    monthlyPrice: "₹14,999",
    yearlyPrice: "₹1,60,000",
    period: {
      monthly: "Per month",
      yearly: "Per year",
    },
    description: {
      monthly: "Comfort & amenities. Most popular choice.",
      yearly: "Comfort & amenities. Most popular choice.",
    },
    buttonText: "Book Now",
    highlighted: true,
    features: [
      "Single/Double sharing",
      "High-speed WiFi",
      "3 meals daily",
      "Laundry service",
      "Gym & recreation",
    ],
  },
  {
    name: "Luxury Stay",
    monthlyPrice: "₹24,999",
    yearlyPrice: "₹2,75,000",
    period: {
      monthly: "Per month",
      yearly: "Per year",
    },
    description: {
      monthly: "Premium living. Best-in-class experience.",
      yearly: "Premium living. Best-in-class experience.",
    },
    buttonText: "Book Now",
    highlighted: false,
    features: [
      "Private room only",
      "AC & premium WiFi",
      "Chef-made meals",
      "Weekly cleaning",
      "Swimming pool access",
    ],
  },
];

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <section className="bg-gradient-to-t whites to-70% to-background via-white w-full py-32 pt-0">
      <div className="container mx-auto flex flex-col gap-13">
        <h1 className="text-center text-6xl font-bold tracking-tighter text-foreground">
          Choose Your Stay Plan
        </h1>

        <div className="flex justify-center">
          <ToggleGroup
            type="single"
            value={billingCycle}
            onValueChange={(value) => {
              if (value && value !== billingCycle) {
                setBillingCycle(value);
              }
            }}
            className="rounded-lg bg-muted p-1"
          >
            <ToggleGroupItem
              value="monthly"
              className="h-8 w-32 rounded-md data-[state=on]:bg-background"
            >
              Monthly
            </ToggleGroupItem>
            <ToggleGroupItem
              value="yearly"
              className="h-8 w-32 rounded-md data-[state=on]:bg-background"
            >
              Yearly
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-wrap justify-center gap-7">
          {PRICING_PLANS.map((plan, index) => (
            <Card
              key={index}
              className={`max-w-sm  rounded-3xl ${
                plan.highlighted ? "" : ""
              } shadow-lg`}
            >
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <div className="text-5xl font-semibold tracking-tight text-muted-foreground">
                    {billingCycle === "monthly"
                      ? plan.monthlyPrice
                      : plan.yearlyPrice}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {billingCycle === "monthly"
                      ? plan.period.monthly
                      : plan.period.yearly}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-7 pt-6">
                <p className="text-sm text-muted-foreground">
                  {billingCycle === "monthly"
                    ? plan.description.monthly
                    : plan.description.yearly}
                </p>

                <Button className="mt-6 w-full">{plan.buttonText}</Button>

                <div className="relative mt-12 mb-4 flex items-center justify-center overflow-hidden">
                  <Separator />
                  <span className="px-3 text-xs text-muted-foreground opacity-50">
                    FEATURES
                  </span>
                  <Separator />
                </div>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <BadgeCheck className="size-5 text-muted-foreground" />
                      <span className="ml-3 text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { PricingSection };