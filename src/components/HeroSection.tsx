"use client";

import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onSearch?: () => void;
}

const HeroSection = ({ searchQuery, setSearchQuery, onSearch }: HeroSectionProps) => {
  const router = useRouter();

  return (
    <section className="bg-background relative py-32 w-screen pt-8">
      <div className="container mx-auto relative z-20 flex items-center justify-center">
        <div className="bg-background flex w-fit flex-col items-center justify-center gap-4 pb-3 text-center">
          <Button
            variant="secondary"
            className="text-md bg-muted/60 group mt-24 flex w-fit items-center justify-center gap-3 rounded-full px-5 py-1 tracking-tight"
          >
            <span className="bg-foreground size-2 rounded-full" />
            <span>Find your perfect stay in seconds</span>
          </Button>
          <div className="relative flex max-w-4xl items-center justify-center text-center text-5xl font-medium tracking-tight md:text-7xl">
            <h1 className="relative z-10 tracking-tighter">
              <span className="mr-3">
                Discover and book amazing PG
              </span>
              <LineShadowText> Accommodations </LineShadowText>
              <span className=""> nearby </span>
              <span>.</span>
            </h1>
            <div className="z-9 bg-background absolute h-[105%] w-[85%]" />
          </div>
          <p className="bg-background text-muted-foreground/80 mt-5 max-w-xl">
            Your perfect home away from home. Search, compare, and book with ease.
          </p>

          {/* Search Section */}
          <div className="relative w-full max-w-2xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative flex items-center bg-background/90 backdrop-blur-xl border border-primary/10 rounded-full shadow-2xl p-2 transition-all duration-300 hover:border-primary/20 hover:shadow-primary/10 ring-1 ring-white/20">
                <Search className="ml-4 h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search by city, area, or locality..."
                  className="flex-1 bg-transparent border-none focus:outline-none px-4 py-3 text-base placeholder:text-muted-foreground/70 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery?.(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
                />
                <Button
                  onClick={onSearch}
                  size="lg"
                  className="rounded-full px-8 shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <span className="text-sm text-muted-foreground/80 font-medium">Popular:</span>
              {['Male', 'Female', 'Unisex'].map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-all duration-300 px-4 py-1.5 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm hover:scale-105 hover:border-primary/20"
                  onClick={() => router.push(`/properties?gender_type=${type}`)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export { HeroSection };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Illustration1 = (props: any) => {
  return (
    <svg
      {...props}
      width="571"
      height="560"
      viewBox="0 0 571 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke="#cccccc"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.2"
        d="M166.571 320.89L166.337 320.448L166.571 320.89ZM-185.483 414.753L-185.029 414.961L-185.483 414.753ZM-90.798 550.017L-90.541 550.446L-90.541 550.446L-90.798 550.017ZM251.609 358.688L251.447 358.215L251.447 358.215L251.609 358.688ZM569.859 394.354C570.073 394.528 570.388 394.496 570.562 394.281C570.736 394.067 570.703 393.752 570.489 393.578L569.859 394.354ZM166.571 320.89L166.337 320.448C84.8815 363.503 5.15738 369.122 -58.3672 372.888C-90.1101 374.77 -117.856 376.19 -139.709 381.614C-161.58 387.041 -177.656 396.504 -185.937 414.544L-185.483 414.753L-185.029 414.961C-176.926 397.312 -161.193 387.976 -139.469 382.584C-117.727 377.188 -90.0926 375.77 -58.308 373.886C5.22228 370.12 85.1407 364.497 166.804 321.332L166.571 320.89ZM-185.483 414.753L-185.937 414.544C-213.037 473.573 -201.627 514.972 -177.119 537.918C-152.665 560.814 -115.234 565.241 -90.541 550.446L-90.798 550.017L-91.055 549.588C-115.323 564.129 -152.27 559.813 -176.436 537.188C-200.548 514.612 -212 473.711 -185.029 414.961L-185.483 414.753ZM-90.798 550.017L-90.541 550.446C-58.5271 531.264 -27.9166 512.042 1.68716 493.418C31.2925 474.794 59.8897 456.769 87.8844 439.978C143.875 406.396 197.433 377.763 251.771 359.161L251.609 358.688L251.447 358.215C197.009 376.851 143.38 405.527 87.37 439.121C59.3643 455.918 30.7575 473.949 1.15467 492.572C-28.4497 511.196 -59.0516 530.413 -91.055 549.588L-90.798 550.017ZM251.609 358.688L251.771 359.161C376.455 316.476 485.473 325.788 569.859 394.354L570.174 393.966L570.489 393.578C485.756 324.729 376.346 315.457 251.447 358.215L251.609 358.688ZM-3.19002 2.72941L-3.12782 3.22553C104.974 -10.3276 201.201 40.6009 243.453 109.09C264.574 143.326 272.197 181.928 261.119 219.065C250.041 256.203 220.237 291.959 166.337 320.448L166.571 320.89L166.804 321.332C220.873 292.754 250.903 256.812 262.077 219.351C273.252 181.891 265.545 142.995 244.304 108.565C201.832 39.719 105.21 -11.365 -3.25222 2.23329L-3.19002 2.72941Z"
      />
      <motion.path
        initial={{ pathLength: 0, opacity: 0, pathOffset: 0.3 }}
        animate={{
          pathLength: 1,
          pathOffset: 0,
          opacity: 1,
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          opacity: { duration: 0.5 },
        }}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M166.571 320.89L166.337 320.448L166.571 320.89ZM-185.483 414.753L-185.029 414.961L-185.483 414.753ZM-90.798 550.017L-90.541 550.446L-90.541 550.446L-90.798 550.017ZM251.609 358.688L251.447 358.215L251.447 358.215L251.609 358.688ZM569.859 394.354C570.073 394.528 570.388 394.496 570.562 394.281C570.736 394.067 570.703 393.752 570.489 393.578L569.859 394.354ZM166.571 320.89L166.337 320.448C84.8815 363.503 5.15738 369.122 -58.3672 372.888C-90.1101 374.77 -117.856 376.19 -139.709 381.614C-161.58 387.041 -177.656 396.504 -185.937 414.544L-185.483 414.753L-185.029 414.961C-176.926 397.312 -161.193 387.976 -139.469 382.584C-117.727 377.188 -90.0926 375.77 -58.308 373.886C5.22228 370.12 85.1407 364.497 166.804 321.332L166.571 320.89ZM-185.483 414.753L-185.937 414.544C-213.037 473.573 -201.627 514.972 -177.119 537.918C-152.665 560.814 -115.234 565.241 -90.541 550.446L-90.798 550.017L-91.055 549.588C-115.323 564.129 -152.27 559.813 -176.436 537.188C-200.548 514.612 -212 473.711 -185.029 414.961L-185.483 414.753ZM-90.798 550.017L-90.541 550.446C-58.5271 531.264 -27.9166 512.042 1.68716 493.418C31.2925 474.794 59.8897 456.769 87.8844 439.978C143.875 406.396 197.433 377.763 251.771 359.161L251.609 358.688L251.447 358.215C197.009 376.851 143.38 405.527 87.37 439.121C59.3643 455.918 30.7575 473.949 1.15467 492.572C-28.4497 511.196 -59.0516 530.413 -91.055 549.588L-90.798 550.017ZM251.609 358.688L251.771 359.161C376.455 316.476 485.473 325.788 569.859 394.354L570.174 393.966L570.489 393.578C485.756 324.729 376.346 315.457 251.447 358.215L251.609 358.688ZM-3.19002 2.72941L-3.12782 3.22553C104.974 -10.3276 201.201 40.6009 243.453 109.09C264.574 143.326 272.197 181.928 261.119 219.065C250.041 256.203 220.237 291.959 166.337 320.448L166.571 320.89L166.804 321.332C220.873 292.754 250.903 256.812 262.077 219.351C273.252 181.891 265.545 142.995 244.304 108.565C201.832 39.719 105.21 -11.365 -3.25222 2.23329L-3.19002 2.72941Z"
      />
    </svg>
  );
};