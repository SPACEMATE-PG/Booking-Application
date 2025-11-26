import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { UserProvider } from "@/lib/user-context";
import { Toaster } from "@/components/ui/sonner";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { RatingProvider } from "@/lib/rating-context";
import { ActionRatingPopup } from "@/components/ActionRatingPopup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PGStay - Find Your Perfect PG Accommodation",
  description: "Discover and book amazing PG accommodations nearby",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Add explicit favicon reference to avoid Next trying to process invalid ico */}
        <link rel="icon" href="/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <RatingProvider>
            <Navbar />
            {children}
            <FeedbackWidget />
            <ActionRatingPopup />
            <Toaster />
          </RatingProvider>
        </UserProvider>
      </body>
    </html>
  );
}