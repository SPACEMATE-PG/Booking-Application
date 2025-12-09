import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "What is PG Booking App?",
    answer: "Modern PG finder. Book rooms in seconds with ease.",
  },
  {
    question: "How does payment work?",
    answer: "No more cash hassles. Pay rent online, every time.",
  },
  {
    question: "Is the app easy to use?",
    answer: "Yes, discover and book PGs in just a few taps.",
  },
  {
    question: "Can I track my bookings?",
    answer: "Track rent due dates and payment status instantly.",
  },
  {
    question: "Who is this app for?",
    answer: "Perfect for students, professionals, and migrants.",
  },
  {
    question: "How do I get started?",
    answer: "Sign up with OTP and book your room in minutes.",
  },
];

const FaqSection = () => {
  return (
    <section className="py-32 w-full bg-[url('https://salient.tailwindui.com/_next/static/media/background-faqs.55d2e36a.jpg')] bg-cover bg-no-repeat">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center">
          <Badge className="text-xs font-medium">FAQ</Badge>
          <h1 className="mt-4 text-4xl font-semibold">
            Frequently Asked About PG Booking
          </h1>
          <p className="mt-6 font-medium text-muted-foreground">
            Fast bookings. No hassle payments. Find PGs, stress-free.
          </p>
        </div>
        <div className="mx-auto mt-14 grid gap-8 md:grid-cols-2 md:gap-12">
          {faqs.map((faq, index) => (
            <div key={index} className="flex gap-4">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-secondary font-mono text-xs text-primary">
                {index + 1}
              </span>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">{faq.question}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { FaqSection };