"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Users,
  Target,
  Heart,
  Shield,
  Award,
  TrendingUp,
  ArrowRight,
  Globe,
  Sparkles,
  Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// --- Data ---
const stats = [
  { label: "Happy Residents", value: "10k+", icon: Users, color: "text-blue-500" },
  { label: "Properties Listed", value: "500+", icon: Target, color: "text-purple-500" },
  { label: "Cities Covered", value: "25+", icon: Globe, color: "text-green-500" },
  { label: "Partner PGs", value: "200+", icon: Award, color: "text-orange-500" },
];

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "Verified properties and regular inspections are our non-negotiable standard for your peace of mind.",
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: Heart,
    title: "Customer First",
    description: "We don't just provide support; we build relationships. Your comfort is our obsession.",
    gradient: "from-pink-500/20 to-rose-500/20"
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Premium amenities and top-tier service. We partner only with the best to give you the best.",
    gradient: "from-amber-500/20 to-orange-500/20"
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Leveraging AI and smart tech to make your booking experience seamless and futuristic.",
    gradient: "from-violet-500/20 to-purple-500/20"
  }
];

const team = [
  {
    name: "Rajesh Kumar",
    role: "Founder & CEO",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    bio: "Visionary leader with 15+ years in real estate tech."
  },
  {
    name: "Priya Sharma",
    role: "Head of Operations",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    bio: "Ensuring smooth sailing for thousands of residents daily."
  },
  {
    name: "Amit Patel",
    role: "Tech Lead",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
    bio: "Architecting the future of shared living platforms."
  },
  {
    name: "Sneha Reddy",
    role: "Customer Success",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
    bio: "Dedicated to delivering happiness, one stay at a time."
  }
];

// --- Components ---

const StatCard = ({ stat, index }: { stat: typeof stats[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="border-none bg-background/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
        <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${stat.color.replace('text-', 'bg-')}`} />
        <CardContent className="p-6 flex flex-col items-center text-center relative z-10">
          <div className={`p-4 rounded-full bg-muted mb-4 group-hover:scale-110 transition-transform duration-300 ${stat.color} bg-opacity-10`}>
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
          <h3 className="text-4xl font-bold tracking-tight mb-1">{stat.value}</h3>
          <p className="text-muted-foreground font-medium">{stat.label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ValueCard = ({ value, index }: { value: typeof values[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className="h-full border-none bg-background/40 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <CardContent className="p-8 relative z-10 h-full flex flex-col">
          <div className="mb-6 inline-block p-3 rounded-2xl bg-background shadow-sm group-hover:shadow-md transition-all">
            <value.icon className="h-8 w-8 text-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{value.title}</h3>
          <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
            {value.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main ref={containerRef} className="min-h-screen bg-background overflow-hidden">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="container px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm backdrop-blur-md border border-primary/20 bg-primary/5 text-primary">
              <Sparkles className="w-3 h-3 mr-2 inline-block" />
              Redefining Shared Living
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
              More Than Just <br /> A Place to Stay
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
              We are building the future of accommodation. Seamless, smart, and social.
              Join the revolution of modern living.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                Explore Properties <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" size="lg" className="rounded-full px-8 h-12 text-base hover:bg-primary/5">
                Read Our Story
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating Abstract Elements */}
        <motion.div style={{ y }} className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/3 left-[10%] w-20 h-20 border border-primary/20 rounded-2xl rotate-12" />
          <div className="absolute bottom-1/3 right-[10%] w-32 h-32 border border-purple-500/20 rounded-full" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Story Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                  alt="Team collaboration"
                  width={800}
                  height={600}
                  className="object-cover w-full h-[500px] hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-8 left-8 z-20 text-white">
                  <p className="text-sm font-medium uppercase tracking-wider mb-2 text-primary">Established 2020</p>
                  <h3 className="text-3xl font-bold">From a simple idea to <br /> a nationwide movement.</h3>
                </div>
              </div>
              {/* Decorative background element */}
              <div className="absolute -bottom-10 -left-10 w-full h-full bg-primary/5 rounded-3xl -z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Our Mission</h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Finding a home shouldn't be a struggle. It should be an exciting new chapter.
                  Yet, for millions, it's a maze of brokers, unclear terms, and subpar living conditions.
                </p>
                <p>
                  <span className="text-foreground font-semibold">PGStay</span> was built to shatter this status quo.
                  We combine technology with human-centric design to create a platform that is transparent,
                  reliable, and incredibly easy to use.
                </p>
                <p>
                  We are not just listing properties; we are curating lifestyles. Whether you're a student
                  chasing dreams or a professional building a career, we ensure you have the perfect base to launch from.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Core Values</h2>
            <p className="text-xl text-muted-foreground">
              The DNA of our company. These principles guide every decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <ValueCard key={index} value={value} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">The Minds Behind PGStay</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A diverse team of dreamers and doers united by a single purpose.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="group relative">
                  <div className="relative overflow-hidden rounded-2xl aspect-square mb-4 bg-muted">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
                      <p className="text-white text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        "{member.bio}"
                      </p>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center group-hover:text-primary transition-colors">{member.name}</h3>
                  <p className="text-sm text-muted-foreground text-center">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground px-6 py-20 text-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Ready to find your new home?
              </h2>
              <p className="text-xl text-primary-foreground/80">
                Join thousands of happy residents who found their perfect match on PGStay.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary" className="rounded-full h-14 px-8 text-lg shadow-xl hover:scale-105 transition-transform">
                  Start Searching Now
                </Button>
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}