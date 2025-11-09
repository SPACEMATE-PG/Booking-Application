import {
  FaAndroid,
  FaApple,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import Link from "next/link";

const sections = [
  {
    title: "Discover",
    links: [
      { name: "Find PGs", href: "/properties" },
      { name: "Favorites", href: "/favorites" },
      { name: "My Bookings", href: "/bookings" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Notifications", href: "/notifications" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Help & Support", href: "/support" },
      { name: "Contact", href: "/support" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "Login / Sign Up", href: "/login" },
      { name: "My Profile", href: "/profile" },
      { name: "Bookings", href: "/bookings" },
    ],
  },
  {
    title: "Connect",
    links: [
      { name: "Twitter", href: "#" },
      { name: "Instagram", href: "#" },
      { name: "LinkedIn", href: "#" },
      { name: "Facebook", href: "#" },
    ],
  },
];

const FooterSection = () => {
  return (
    <section className="py-32 w-full">
      <div className="container  max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 gap-10">
            <div className="grid gap-8 lg:grid-cols-4 lg:flex-row">
              <div className="col-span-3">
                <p className="mb-3 font-bold">Follow us</p>
                <ul className="flex items-center gap-2 text-muted-foreground">
                  <li className="font-medium">
                    <a href="#">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                        <FaFacebook className="size-6" />
                      </span>
                    </a>
                  </li>
                  <li className="font-medium">
                    <a href="#">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                        <FaTwitter className="size-6" />
                      </span>
                    </a>
                  </li>
                  <li className="font-medium">
                    <a href="#">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                        <FaInstagram className="size-6" />
                      </span>
                    </a>
                  </li>
                  <li className="font-medium">
                    <a href="#">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                        <FaLinkedin className="size-6" />
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-3 font-bold">Get the App</p>
                <ul className="flex items-center gap-2 text-muted-foreground">
                  <li className="font-medium">
                    <a href="#">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                        <FaAndroid className="size-6" />
                      </span>
                    </a>
                  </li>
                  <li className="font-medium">
                    <a href="#">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                        <FaApple className="size-6" />
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-24 border-t pt-8">
            <p className="text-center text-sm font-medium text-muted-foreground">
              © 2024 PGStay. All rights reserved. Made with ❤️ for students and professionals.
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { FooterSection };