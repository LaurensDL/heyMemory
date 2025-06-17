import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Link } from "wouter";
import { MainFooter } from "@/components/MainFooter";
import { MainNavigation } from "@/components/MainNavigation";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long")
});

type ContactData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactData) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We'll get back to you soon.",
        variant: "default"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Send Message",
        description: "Please try again later or contact us directly.",
        variant: "destructive"
      });
      console.error("Contact form error:", error);
    }
  });

  const onSubmit = (data: ContactData) => {
    contactMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white text-black">
        <MainNavigation />

        <div className="max-w-2xl mx-auto px-4 py-8 md:px-8 md:py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-8">
            <Mail className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-black mb-4 md:mb-6">Thank You!</h1>
          <p className="text-lg md:text-2xl text-gray-700 mb-8 md:mb-12 leading-relaxed px-2">
            Your message has been sent successfully. We'll get back to you as soon as possible.
          </p>
          <Button 
            onClick={() => setIsSubmitted(false)}
            className="w-full sm:w-auto touch-button bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white font-bold text-lg md:text-2xl px-8 md:px-12 py-4 md:py-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-colors min-h-[56px] md:min-h-[64px]"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <MainNavigation backTo={{ href: "/", label: "Back to Home", shortLabel: "Back" }} />
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-3xl md:text-6xl font-bold text-black mb-4 md:mb-8">Contact Us</h1>
          <p className="text-lg md:text-2xl text-gray-700 leading-relaxed px-2">
            We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-2 md:border-4 border-gray-300 rounded-xl p-6 md:p-12 mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-black mb-6 md:mb-12">Send Us a Message</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg md:text-2xl font-bold text-black mb-2 md:mb-4 block">Your Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Full name"
                          className="text-lg md:text-2xl p-4 md:p-6 rounded-xl border-2 md:border-4 border-gray-300 focus:border-[var(--button-primary)] focus:outline-none focus:ring-4 focus:ring-blue-200 bg-white min-h-[56px] touch-manipulation"
                        />
                      </FormControl>
                      <FormMessage className="text-base md:text-xl text-red-600 mt-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg md:text-2xl font-bold text-black mb-2 md:mb-4 block">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          placeholder="your.email@example.com"
                          className="text-lg md:text-2xl p-4 md:p-6 rounded-xl border-2 md:border-4 border-gray-300 focus:border-[var(--button-primary)] focus:outline-none focus:ring-4 focus:ring-blue-200 bg-white min-h-[56px] touch-manipulation"
                        />
                      </FormControl>
                      <FormMessage className="text-base md:text-xl text-red-600 mt-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg md:text-2xl font-bold text-black mb-2 md:mb-4 block">Subject</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="What's this about?"
                          className="text-lg md:text-2xl p-4 md:p-6 rounded-xl border-2 md:border-4 border-gray-300 focus:border-[var(--button-primary)] focus:outline-none focus:ring-4 focus:ring-blue-200 bg-white min-h-[56px] touch-manipulation"
                        />
                      </FormControl>
                      <FormMessage className="text-base md:text-xl text-red-600 mt-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg md:text-2xl font-bold text-black mb-2 md:mb-4 block">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Tell us how we can help..."
                          className="text-lg md:text-2xl p-4 md:p-6 rounded-xl border-2 md:border-4 border-gray-300 focus:border-[var(--button-primary)] focus:outline-none focus:ring-4 focus:ring-blue-200 bg-white min-h-[120px] md:min-h-48 touch-manipulation"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage className="text-base md:text-xl text-red-600 mt-2" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={contactMutation.isPending}
                  className="w-full touch-button bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white font-bold text-lg md:text-2xl py-4 md:py-8 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-colors min-h-[56px] md:min-h-[64px]"
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Contact Information */}
          <div className="bg-white border-2 md:border-4 border-gray-300 rounded-xl p-6 md:p-12">
            <h2 className="text-2xl md:text-4xl font-bold text-black mb-6 md:mb-12">Get in Touch</h2>
            
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-start space-x-4 md:space-x-6">
                <div className="bg-blue-100 p-3 md:p-4 rounded-xl flex-shrink-0">
                  <Mail className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg md:text-2xl font-bold text-black mb-1 md:mb-2">Email</h3>
                  <p className="text-base md:text-xl text-gray-700 mb-1 md:mb-2 break-words">help@heymemory.app</p>
                  <p className="text-sm md:text-lg text-gray-600">We try to respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 md:space-x-6">
                <div className="bg-green-100 p-3 md:p-4 rounded-xl flex-shrink-0">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg md:text-2xl font-bold text-black mb-1 md:mb-2">Support Hours</h3>
                  <p className="text-base md:text-xl text-gray-700">Monday - Friday: 10 AM - 5 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <MainFooter />
    </div>
  );
}