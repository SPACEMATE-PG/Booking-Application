"use client";

import { useState } from "react";
import { HelpCircle, MessageCircle, Mail, Phone, ChevronDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { useUser } from "@/lib/user-context";

const faqs = [
  {
    question: "How do I book a PG?",
    answer: "To book a PG, browse through available properties, select your preferred room type, choose your move-in date and duration, and proceed to payment. You can pay the full amount or just a booking amount upfront."
  },
  {
    question: "What documents do I need for booking?",
    answer: "You need a valid government ID (Aadhar, Passport, or Driver's License), a recent passport-size photograph, and contact details. Some properties may require additional documents like proof of employment or college ID."
  },
  {
    question: "What is the cancellation policy?",
    answer: "Free cancellation is available up to 7 days before your move-in date with a full refund. Cancellations within 3-7 days will receive a 50% refund. No refund for cancellations within 3 days of move-in."
  },
  {
    question: "How do I pay rent?",
    answer: "Rent can be paid through our app using UPI, credit/debit cards, or net banking. You'll receive reminders 5 days before your rent is due, and can view your payment history in the dashboard."
  },
  {
    question: "Can I schedule a property visit?",
    answer: "Yes! Click 'Schedule Visit' on any property page, choose your preferred date and time, and our team will confirm your appointment. Virtual tours are also available for select properties."
  },
  {
    question: "What amenities are included?",
    answer: "Amenities vary by property but typically include WiFi, meals, laundry, housekeeping, and common areas. Check the property details page for specific amenities offered at each location."
  },
  {
    question: "How do I raise a maintenance request?",
    answer: "Go to your Dashboard, click 'Add Maintenance Request', describe the issue, and submit. You'll receive updates on the status, and most requests are resolved within 24-48 hours."
  },
  {
    question: "Can I extend my stay?",
    answer: "Yes, you can extend your stay by contacting the property manager or through the app. Extensions are subject to room availability and require advance notice of at least 15 days."
  },
  {
    question: "Is my security deposit refundable?",
    answer: "Yes, security deposits are fully refundable after you check out, subject to deduction for any damages or unpaid dues. Refunds are processed within 7-10 business days."
  },
  {
    question: "How can I contact property management?",
    answer: "You can call, chat, or schedule a visit with the property manager directly from the property details page. In-app messaging is available 24/7 for quick queries."
  }
];

export default function SupportPage() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: "",
    phone: user?.phone || "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      toast.success("Support request submitted! We'll get back to you within 24 hours.");
      setFormData({
        name: user?.name || "",
        email: "",
        phone: user?.phone || "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error('Error submitting support request:', error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
        <div className="container max-w-4xl mx-auto text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
          <p className="text-xl text-white/90">
            We're here to help! Find answers or get in touch with us
          </p>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Contact Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Phone className="h-12 w-12 mx-auto mb-2 text-teal-500" />
                <CardTitle>Call Us</CardTitle>
                <CardDescription>Mon-Sat, 9 AM - 9 PM</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-semibold text-lg">+91 1800-123-4567</p>
                <Button variant="outline" className="mt-4 w-full">
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 text-teal-500" />
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>Available 24/7</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-semibold text-lg">Instant Support</p>
                <Button variant="outline" className="mt-4 w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Mail className="h-12 w-12 mx-auto mb-2 text-teal-500" />
                <CardTitle>Email Us</CardTitle>
                <CardDescription>Response in 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-semibold text-lg">support@pgstay.com</p>
                <Button variant="outline" className="mt-4 w-full">
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
                <CardDescription>Find quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>We'll respond within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Name *</label>
                    <Input
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email *</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Phone</label>
                    <Input
                      type="tel"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Subject *</label>
                    <Input
                      placeholder="What can we help you with?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Message *</label>
                    <Textarea
                      placeholder="Describe your issue or question..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-600"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>Submitting...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}