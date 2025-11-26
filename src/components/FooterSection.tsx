import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Send,
  MapPin,
  Mail,
  Heart,
  ShieldCheck,
  Zap
} from "lucide-react"
import Link from "next/link"

const FooterSection = () => {
  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300 overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:px-6 lg:px-8 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">PGStay</span>
            </div>
            <p className="max-w-md text-lg text-muted-foreground">
              Experience the future of shared living. We connect you with verified, premium PG accommodations that feel like home, but better.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={Facebook} label="Facebook" />
              <SocialLink href="#" icon={Twitter} label="Twitter" />
              <SocialLink href="#" icon={Instagram} label="Instagram" />
              <SocialLink href="#" icon={Linkedin} label="LinkedIn" />
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                Discover
              </h3>
              <nav className="flex flex-col gap-3 text-muted-foreground">
                <FooterLink href="/properties">Find PGs</FooterLink>
                <FooterLink href="/favorites">Favorites</FooterLink>
                <FooterLink href="/bookings">My Bookings</FooterLink>
                <FooterLink href="/dashboard">Dashboard</FooterLink>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                Company
              </h3>
              <nav className="flex flex-col gap-3 text-muted-foreground">
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/support">Help & Support</FooterLink>
                <FooterLink href="/careers">Careers</FooterLink>
                <FooterLink href="/blog">Blog</FooterLink>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                Legal
              </h3>
              <nav className="flex flex-col gap-3 text-muted-foreground">
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
                <FooterLink href="/cookies">Cookie Policy</FooterLink>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-12 border-t pt-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-semibold tracking-tight">
              Subscribe to our newsletter
            </h3>
            <p className="text-muted-foreground">
              Get the latest updates on new properties, exclusive offers, and smart living tips directly to your inbox.
            </p>
            <form className="flex w-full max-w-sm items-center space-x-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20 focus-visible:ring-primary/50"
                />
              </div>
              <Button type="submit" size="icon" className="shadow-lg shadow-primary/25">
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <FeatureItem
              icon={ShieldCheck}
              title="Verified Listings"
              description="Every property is physically verified by our team."
            />
            <FeatureItem
              icon={Zap}
              title="Instant Booking"
              description="Book your stay in minutes with our seamless process."
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center text-sm text-muted-foreground md:flex-row md:text-left">
          <p>© 2024 PGStay. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-4 w-4 fill-red-500 text-red-500 animate-pulse" />
            <span>for students & professionals</span>
          </div>
        </div>
      </div>

      {/* Decorative gradient background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="absolute left-0 top-0 -z-10 h-full w-full bg-gradient-to-b from-background to-background/80"></div>
    </footer>
  )
}

const SocialLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: any
  label: string
}) => (
  <Link
    href={href}
    className="group flex h-10 w-10 items-center justify-center rounded-full border bg-background transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
    aria-label={label}
  >
    <Icon className="h-5 w-5 transition-transform group-hover:rotate-12" />
  </Link>
)

const FooterLink = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => (
  <Link
    href={href}
    className="group flex items-center gap-2 transition-colors hover:text-primary"
  >
    <span className="h-1 w-1 rounded-full bg-primary opacity-0 transition-all group-hover:opacity-100" />
    <span className="relative">
      {children}
      <span className="absolute -bottom-px left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
    </span>
  </Link>
)

const FeatureItem = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any
  title: string
  description: string
}) => (
  <div className="flex items-start gap-3 group">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h4 className="font-semibold group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
)

export { FooterSection }