"use client";

import React, { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
    Shield,
    Lock,
    Eye,
    FileText,
    Cookie,
    Server,
    Bell,
    Mail,
    ChevronRight,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const sections = [
    {
        id: "introduction",
        title: "Introduction",
        icon: FileText,
        content: "Welcome to PGStay. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us."
    },
    {
        id: "collection",
        title: "Information We Collect",
        icon: Eye,
        content: "We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us."
    },
    {
        id: "usage",
        title: "How We Use Your Information",
        icon: Server,
        content: "We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations."
    },
    {
        id: "security",
        title: "Data Security",
        icon: Lock,
        content: "We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure."
    },
    {
        id: "cookies",
        title: "Cookies and Tracking",
        icon: Cookie,
        content: "We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice."
    },
    {
        id: "rights",
        title: "Your Privacy Rights",
        icon: Shield,
        content: "In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information."
    },
    {
        id: "contact",
        title: "Contact Us",
        icon: Mail,
        content: "If you have questions or comments about this policy, you may email us or contact us by post at our corporate address."
    }
];

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState("introduction");
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveSection(id);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
                style={{ scaleX }}
            />

            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge variant="outline" className="mb-4 px-4 py-1 text-base border-primary/20 bg-primary/5 text-primary">
                            Last Updated: November 26, 2025
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Privacy Policy
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            We care about your data. Here's a clear and transparent overview of how we handle your information.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 pb-20">
                <div className="grid lg:grid-cols-[300px_1fr] gap-10">
                    {/* Sidebar Navigation */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-2">
                            <Card className="border-none shadow-lg bg-background/50 backdrop-blur-xl">
                                <CardContent className="p-4">
                                    <nav className="space-y-1">
                                        {sections.map((section) => (
                                            <button
                                                key={section.id}
                                                onClick={() => scrollToSection(section.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${activeSection === section.id
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    }`}
                                            >
                                                <section.icon className={`h-4 w-4 ${activeSection === section.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                                    }`} />
                                                {section.title}
                                                {activeSection === section.id && (
                                                    <motion.div
                                                        layoutId="activeIndicator"
                                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </nav>
                                </CardContent>
                            </Card>

                            <Card className="mt-6 bg-primary text-primary-foreground border-none shadow-xl overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-600 opacity-90" />
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

                                <CardContent className="p-6 relative z-10">
                                    <Shield className="h-8 w-8 mb-4 text-white/80" />
                                    <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                                    <p className="text-primary-foreground/80 text-sm mb-4">
                                        Have questions about your data privacy? Our team is here to help.
                                    </p>
                                    <Button variant="secondary" className="w-full shadow-lg hover:shadow-xl transition-all">
                                        Contact Support
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="space-y-8">
                        {sections.map((section, index) => (
                            <motion.div
                                key={section.id}
                                id={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onViewportEnter={() => setActiveSection(section.id)}
                            >
                                <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <section.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-2xl">{section.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <p className="text-muted-foreground leading-relaxed text-lg">
                                            {section.content}
                                        </p>

                                        {/* Example detailed content for specific sections */}
                                        {section.id === "collection" && (
                                            <div className="mt-6 grid sm:grid-cols-2 gap-4">
                                                {[
                                                    "Name and Contact Data",
                                                    "Credentials",
                                                    "Payment Data",
                                                    "Social Media Login Data"
                                                ].map((item) => (
                                                    <div key={item} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                                                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                                        <span className="font-medium text-sm">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}

                        {/* Bottom CTA */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-muted to-background border border-border/50 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                                    We're committed to being transparent about our privacy practices.
                                    If you need more details, don't hesitate to reach out.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Button size="lg" className="rounded-full px-8">
                                        Email Privacy Team
                                    </Button>
                                    <Button size="lg" variant="outline" className="rounded-full px-8">
                                        View Terms of Service
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
}
