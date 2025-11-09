"use client";

import { Users, Target, Heart, Shield, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const stats = [
  { label: "Happy Residents", value: "10,000+", icon: Users },
  { label: "Properties Listed", value: "500+", icon: Target },
  { label: "Cities Covered", value: "25+", icon: TrendingUp },
  { label: "Partner PGs", value: "200+", icon: Award },
];

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "All properties are verified and regularly inspected to ensure quality standards and resident safety."
  },
  {
    icon: Heart,
    title: "Customer First",
    description: "We prioritize your comfort and satisfaction, providing 24/7 support for all your needs."
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "We partner only with the best PG owners who maintain high standards of service and amenities."
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "Continuously improving our platform to make your PG search and stay experience seamless."
  }
];

const team = [
  {
    name: "Rajesh Kumar",
    role: "Founder & CEO",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh"
  },
  {
    name: "Priya Sharma",
    role: "Head of Operations",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
  },
  {
    name: "Amit Patel",
    role: "Tech Lead",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit"
  },
  {
    name: "Sneha Reddy",
    role: "Customer Success",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha"
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
        <div className="container max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-white text-teal-500 hover:bg-white">About PGStay</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Your Trusted Partner in Finding the Perfect PG
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            We're on a mission to make PG accommodation discovery and booking as easy as ordering food online. 
            Simple, transparent, and stress-free.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 border-b">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <stat.icon className="h-10 w-10 mx-auto mb-3 text-teal-500" />
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-teal-500 mx-auto mb-6"></div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Founded in 2020, PGStay was born from a simple observation: finding a good PG accommodation 
              was unnecessarily complicated. Students and working professionals spent weeks searching, 
              visiting multiple properties, and dealing with unclear terms and conditions.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We decided to change that. PGStay brings together verified PG properties, transparent pricing, 
              easy booking, and comprehensive management tools—all in one platform. Our team works tirelessly 
              to ensure every resident finds their perfect home away from home.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, we're proud to serve thousands of residents across major cities in India, helping them 
              find safe, comfortable, and affordable accommodations. But we're just getting started—our vision 
              is to become India's most trusted PG accommodation platform.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <div className="w-20 h-1 bg-teal-500 mx-auto mb-6"></div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at PGStay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-500/10 rounded-lg">
                      <value.icon className="h-6 w-6 text-teal-500" />
                    </div>
                    <CardTitle>{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <div className="w-20 h-1 bg-teal-500 mx-auto mb-6"></div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The passionate people working to make your PG search effortless
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Thousands of Happy Residents
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start your journey to finding the perfect PG today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/properties">
              <button className="px-8 py-3 bg-white text-teal-500 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Browse Properties
              </button>
            </a>
            <a href="/support">
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-teal-500 transition-colors">
                Contact Us
              </button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}