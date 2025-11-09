import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-teal-500 mb-4">404</h1>
          <div className="w-32 h-1 bg-teal-500 mx-auto mb-8"></div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button className="bg-teal-500 hover:bg-teal-600 gap-2 min-w-[200px]">
              <Home className="h-5 w-5" />
              Go to Homepage
            </Button>
          </Link>
          <Link href="/properties">
            <Button variant="outline" className="gap-2 min-w-[200px]">
              <Search className="h-5 w-5" />
              Browse Properties
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">Quick Links</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/favorites" className="text-sm hover:text-teal-500 transition-colors">
              Favorites
            </Link>
            <Link href="/bookings" className="text-sm hover:text-teal-500 transition-colors">
              My Bookings
            </Link>
            <Link href="/dashboard" className="text-sm hover:text-teal-500 transition-colors">
              Dashboard
            </Link>
            <Link href="/support" className="text-sm hover:text-teal-500 transition-colors">
              Help & Support
            </Link>
            <Link href="/about" className="text-sm hover:text-teal-500 transition-colors">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}