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
import { Mail, Phone, MapPin, Clock, ArrowLeft, Brain } from "lucide-react";
import { Link } from "wouter";

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
      <div className="min-h-screen bg-white p-8">
        {/* Navigation Bar */}
        <nav className="bg-white border-b-4 border-gray-300 mb-12" role="navigation">
          <div className="max-w-4xl mx-auto py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Brain className="text-[var(--button-primary)] w-10 h-10" />
                <span className="text-3xl font-bold text-black">heyMemory</span>
              </div>
              
              <div className="flex items-center space-x-6">
                <Link href="/">
                  <Button className="bg-white text-black font-bold text-xl px-8 py-4 rounded-xl border-4 border-gray-400 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-500 transition-colors">
                    <ArrowLeft className="w-6 h-6 mr-3" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-8">
            <Mail className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-black mb-6">Thank You!</h1>
          <p className="text-2xl text-gray-700 mb-12 leading-relaxed">
            Your message has been sent successfully. We'll get back to you as soon as possible.
          </p>
          <Button 
            onClick={() => setIsSubmitted(false)}
            className="bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white font-bold text-2xl px-12 py-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-colors"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Navigation Bar */}
      <nav className="bg-white border-b-4 border-gray-300 mb-12" role="navigation">
        <div className="max-w-4xl mx-auto py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="text-[var(--button-primary)] w-10 h-10" />
              <span className="text-3xl font-bold text-black">heyMemory</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/">
                <Button className="bg-white text-black font-bold text-xl px-8 py-4 rounded-xl border-4 border-gray-400 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-500 transition-colors">
                  <ArrowLeft className="w-6 h-6 mr-3" />
                  Back to Home
                </Button>
              </Link>
              
              <Link href="/dashboard">
                <Button className="bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white font-bold text-xl px-8 py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-colors">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-black mb-8">Contact Us</h1>
          <p className="text-2xl text-gray-700 leading-relaxed">
            We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-4 border-gray-300 rounded-xl p-12 mb-16">
            <h2 className="text-4xl font-bold text-black mb-12">Send Us a Message</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-bold text-black mb-4 block">Your Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter your full name"
                          className="text-2xl p-6 rounded-xl border-4 border-gray-300 focus:border-[var(--button-primary)] focus:outline-none focus:ring-4 focus:ring-blue-200 bg-white"
                        />
                      </FormControl>
                      <FormMessage className="text-xl text-red-600 mt-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-bold text-black mb-4 block">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          placeholder="your.email@example.com"
                          className="text-2xl p-6 rounded-xl border-4 border-gray-300 focus:border-[var(--button-primary)] focus:outline-none focus:ring-4 focus:ring-blue-200 bg-white"
                        />
                      </FormControl>
                      <FormMessage className="text-xl text-red-600 mt-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-bold text-black mb-4 block">Subject</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="What's this about?"
                          className="text-2xl p-6 rounded-xl border-4 border-gray-300 focus:border-[var(--button-primary)] focus:outline-none focus:ring-4 focus:ring-blue-200 bg-white"
                        />
                      </FormControl>
                      <FormMessage className="text-xl text-red-600 mt-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-bold text-black mb-4 block">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Tell us how we can help you..."
                          className="text-2xl p-6 rounded-xl border-4 border-gray-300 focus:border-[var(--button-primary)] focus:outline-none focus:ring-4 focus:ring-blue-200 bg-white min-h-48"
                          rows={6}
                        />
                      </FormControl>
                      <FormMessage className="text-xl text-red-600 mt-2" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={contactMutation.isPending}
                  className="w-full bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white font-bold text-2xl py-8 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-colors"
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Contact Information */}
          <div className="bg-white border-4 border-gray-300 rounded-xl p-12">
            <h2 className="text-4xl font-bold text-black mb-12">Get in Touch</h2>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="bg-blue-100 p-4 rounded-xl">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-black mb-2">Email</h3>
                  <p className="text-xl text-gray-700 mb-2">help@heymemory.app</p>
                  <p className="text-lg text-gray-600">We respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="bg-green-100 p-4 rounded-xl">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-black mb-2">Support Hours</h3>
                  <p className="text-xl text-gray-700">Monday - Friday: 9 AM - 6 PM</p>
                  <p className="text-xl text-gray-700">Weekend: 10 AM - 4 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - Same as homepage */}
      <footer className="bg-gray-50 border-t-2 border-gray-200 py-12" role="contentinfo">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Brain className="text-[var(--button-primary)] w-8 h-8" aria-hidden="true" />
              <span className="text-2xl font-bold">heyMemory</span>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
              <button className="text-body font-bold hover:text-[var(--button-primary)] focus:text-[var(--button-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] focus:ring-offset-2 rounded px-4 py-2">
                Privacy Policy
              </button>
              <button className="text-body font-bold hover:text-[var(--button-primary)] focus:text-[var(--button-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] focus:ring-offset-2 rounded px-4 py-2">
                Accessibility
              </button>
              <Link href="/contact">
                <button className="text-body font-bold hover:text-[var(--button-primary)] focus:text-[var(--button-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] focus:ring-offset-2 rounded px-4 py-2">
                  Contact Us
                </button>
              </Link>
            </div>
            
            <p className="text-body">© 2025 heyMemory. Designed with care for memory support.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}