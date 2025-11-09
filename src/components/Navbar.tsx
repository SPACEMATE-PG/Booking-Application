"use client";

import { Home, Heart, Calendar, User, Menu, LogOut, Bell, HelpCircle, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/lib/user-context";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { user, logout, isLoading } = useUser();
  const pathname = usePathname();

  // Don't show navbar on auth pages
  if (pathname === "/login" || pathname === "/profile-setup") {
    return null;
  }

  const navItems = [
    { title: "Home", url: "/", icon: <Home className="size-5" /> },
    { title: "Properties", url: "/properties", icon: <Home className="size-5" /> },
    { title: "Favorites", url: "/favorites", icon: <Heart className="size-5" /> },
    { title: "Bookings", url: "/bookings", icon: <Calendar className="size-5" /> },
  ];

  return (
    <section className="py-4 sticky top-0 z-50 bg-background border-b">
      <div className="container max-w-6xl items-center mx-auto">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-teal-500 rounded-lg">
                <Home className="text-white size-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight">PGStay</span>
            </Link>
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.title} href={item.url}>
                  <Button
                    variant={pathname === item.url ? "secondary" : "ghost"}
                    className="gap-2"
                  >
                    {item.icon}
                    {item.title}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {/* Quick Links */}
            <Link href="/about">
              <Button variant="ghost" size="icon" title="About Us">
                <Users className="size-5" />
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="ghost" size="icon" title="Help & Support">
                <HelpCircle className="size-5" />
              </Button>
            </Link>
            {user && (
              <Link href="/notifications">
                <Button variant="ghost" size="icon" title="Notifications">
                  <Bell className="size-5" />
                </Button>
              </Link>
            )}
            
            {isLoading ? (
              <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="size-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notifications">Notifications</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="size-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-teal-500 hover:bg-teal-600">
                <Link href="/login">Login / Sign Up</Link>
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-teal-500 rounded-lg">
                <Home className="text-white size-5" />
              </div>
              <span className="text-lg font-semibold">PGStay</span>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {navItems.map((item) => (
                    <Link key={item.title} href={item.url}>
                      <Button
                        variant={pathname === item.url ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                      >
                        {item.icon}
                        {item.title}
                      </Button>
                    </Link>
                  ))}
                  
                  {/* Additional Links */}
                  <div className="border-t pt-4 mt-4">
                    <Link href="/about">
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Users className="size-5" />
                        About Us
                      </Button>
                    </Link>
                    <Link href="/support">
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <HelpCircle className="size-5" />
                        Help & Support
                      </Button>
                    </Link>
                    {user && (
                      <Link href="/notifications">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <Bell className="size-5" />
                          Notifications
                        </Button>
                      </Link>
                    )}
                  </div>

                  {user ? (
                    <>
                      <div className="border-t pt-4 mt-4">
                        <p className="text-sm font-medium mb-2">Signed in as</p>
                        <p className="text-sm text-muted-foreground">{user.name}</p>
                      </div>
                      <Button asChild variant="outline">
                        <Link href="/profile">Profile Settings</Link>
                      </Button>
                      <Button variant="destructive" onClick={logout} className="gap-2">
                        <LogOut className="size-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button asChild className="bg-teal-500 hover:bg-teal-600">
                      <Link href="/login">Login / Sign Up</Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Navbar };