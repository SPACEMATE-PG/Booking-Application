"use client";

import AutoScroll from "embla-carousel-auto-scroll";

import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

const LogosSections = () => {
  const logos = [
    {
      id: "logo-1",
      description: "Logo 1",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-wordmark.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-2",
      description: "Logo 2",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-3",
      description: "Logo 3",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-4",
      description: "Logo 4",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-5",
      description: "Logo 5",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-6",
      description: "Logo 6",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg",
      className: "h-5 w-auto",
    },
    {
      id: "logo-7",
      description: "Logo 7",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-8",
      description: "Logo 8",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-7.svg",
      className: "h-7 w-auto",
    },
  ];
  const testimonials = [
    {
      quote:
        "Finding a PG was never this easy! Booked my room in minutes and moved in hassle-free. Highly recommended.",
      name: "Priya Sharma, Software Engineer",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
    },
    {
      quote:
        "The app made my college life so much easier. Great amenities, transparent pricing, and quick support.",
      name: "Rahul Verma, College Student",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-7.svg",
    },
    {
      quote:
        "Best PG booking experience! Clean rooms, verified properties, and the payment system is super secure.",
      name: "Anjali Mehta, Marketing Professional",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg",
    },
  ];
  return (
    <section className="py-32 pt-0">
      <div className="container flex flex-col items-center text-center">
        <h1 className="text-foreground my-6 text-lg font-semibold tracking-tight">
          Trusted by thousands of students and professionals nationwide
        </h1>
      </div>

      <div className="relative mx-auto flex items-center justify-center pt-8 lg:max-w-5xl">
        <Carousel
          opts={{ loop: true }}
          plugins={[AutoScroll({ playOnInit: true })]}
        >
          <CarouselContent className="ml-0">
            {logos.map((logo) => (
              <CarouselItem
                key={logo.id}
                className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
              >
                <div className="flex shrink-0 items-center justify-center lg:mx-10">
                  <div>
                    <img
                      src={logo.image}
                      alt={logo.description}
                      className={logo.className}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-12 to-transparent"></div>
        <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-12 to-transparent"></div>
      </div>
      <Separator className="my-15 mx-auto max-w-5xl" />

      <div>
        <Carousel opts={{ loop: true }} className="mx-auto w-full max-w-6xl">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div
                  className={cn(
                    "relativ border-border w-full border-r px-12 text-center md:px-8 md:text-left",
                    index == 0 && "lg:border-l"
                  )}
                  key={index}
                >
                  <h5 className="text-muted-foreground mb-14 mt-5 line-clamp-3 text-lg tracking-tight md:mb-28">
                    {testimonial.quote}
                  </h5>
                  <div className="mt-auto">
                    <p className="text-foreground text-lg font-semibold tracking-tight">
                      {testimonial.name}
                    </p>
                    <img
                      className="mx-auto my-5 w-40 md:mx-0"
                      alt="Company logo"
                      src={testimonial.image}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export { LogosSections };