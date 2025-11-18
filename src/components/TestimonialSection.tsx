"use client";

import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    content: "Found my perfect PG in Bangalore! Booking was super smooth.",
  },
  {
    name: "Rahul Kumar",
    role: "MBA Student",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
    content: "Amazing amenities & zero hassle. Best PG app ever!",
  },
  {
    name: "Anjali Patel",
    role: "Marketing Manager",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    content: "Quick bookings in minutes. My rent payments are on time!",
  },
  {
    name: "Arjun Mehta",
    role: "Graphic Designer",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
    content: "Love the dashboard! Managing my stay has never been easier.",
  },
  {
    name: "Sneha Reddy",
    role: "Digital Marketer",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
    content: "No more PG hunting stress. Everything I need is here!",
  },
  {
    name: "Karan Singh",
    role: "Data Analyst",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp",
    content: "Fast setup, great filters. Found my ideal room instantly.",
  },
  {
    name: "Divya Gupta",
    role: "Content Writer",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-7.webp",
    content: "Safe, verified PGs with transparent pricing. Super easy!",
  },
  {
    name: "Vikram Joshi",
    role: "Web Developer",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-8.webp",
    content: "This app saves me hours every month. Highly efficient!",
  },
];

const TestimonialSection = () => {
  const [mounted, setMounted] = useState(false);

  // Ensures Masonry runs only on client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-32 w-full">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex flex-col items-center gap-6">
          <Badge variant="outline">Testimonials</Badge>
          <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
            Why residents love our PG app
          </h2>
          <p className="text-muted-foreground lg:text-lg">
            Easy bookings. Secure stays. Happy residents.
          </p>
        </div>

        <div className="relative mt-14 w-full after:absolute after:inset-x-0 after:-bottom-2 after:h-96 after:bg-linear-to-t after:from-background">
          
          {/* Prevent server rendering Masonry */}
          {mounted ? (
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 1, 768: 2, 1024: 3 }}
            >
              <Masonry gutter="20px" columnsCount={3}>
                {testimonials.map((t, idx) => (
                  <Card
                    key={idx}
                    className={cn(
                      "p-5 shadow-md rounded-2xl w-full",
                      idx > 3 && idx <= 5 && "hidden md:block",
                      idx > 5 && "hidden lg:block"
                    )}
                  >
                    <div className="flex gap-4 leading-5">
                      <Avatar className="size-9 rounded-full ring-1 ring-input">
                        <AvatarImage src={t.avatar} alt={t.name} />
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{t.name}</p>
                        <p className="text-muted-foreground">{t.role}</p>
                      </div>
                    </div>

                    <div className="mt-8 leading-7 text-foreground/70">
                      <q>{t.content}</q>
                    </div>
                  </Card>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          ) : (
            // Simple SSR fallback (no layout shift)
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((t, idx) => (
                <Card
                  key={idx}
                  className="p-5 shadow-md rounded-2xl w-full"
                >
                  <div className="flex gap-4 leading-5">
                    <Avatar className="size-9 rounded-full ring-1 ring-input">
                      <AvatarImage src={t.avatar} alt={t.name} />
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">{t.name}</p>
                      <p className="text-muted-foreground">{t.role}</p>
                    </div>
                  </div>

                  <div className="mt-8 leading-7 text-foreground/70">
                    <q>{t.content}</q>
                  </div>
                </Card>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export { TestimonialSection };
