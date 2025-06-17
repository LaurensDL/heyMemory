import { useState, useEffect } from "react";
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
import { Mail, Phone, MapPin, Clock, Home as HomeIcon, ChevronRight } from "lucide-react";
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

  // SEO and Accessibility enhancements
  useEffect(() => {
    // Update document title and meta tags for contact page
    document.title = "Contact Support - heyMemory | Help for Alzheimer's, Dementia & Brain Injury";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Get support for heyMemory app. Contact our team for help with memory support tools for Alzheimer\'s, dementia, brain injury, and cognitive challenges. We\'re here to help you and your family.'
      );
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 
        'contact support, help, customer service, technical support, memory app support'
      );
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Contact Support - heyMemory | Help for Alzheimer\'s, Dementia & Brain Injury');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 
        'Get support for heyMemory app. Contact our team for help with memory support tools for cognitive challenges.'
      );
    }

    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', 'Contact Support - heyMemory | Help for Alzheimer\'s, Dementia & Brain Injury');
    }

    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 
        'Get support for heyMemory app. Contact our team for help with memory support tools for cognitive challenges.'
      );
    }

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', '/contact');
    }

    // Add Contact Page Schema Markup
    const contactSchema = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Support - heyMemory",
      "description": "Get support for heyMemory app. Contact our team for help with memory support tools for cognitive challenges.",
      "url": "/contact",
      "mainEntity": {
        "@type": "Organization",
        "name": "heyMemory",
        "url": "/",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-555-MEMORY",
          "contactType": "Customer Support",
          "email": "help@heymemory.app",
          "availableLanguage": "English",
          "areaServed": "US",
          "hoursAvailable": "Mo-Fr 10:00-17:00"
        }
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Contact",
            "item": "/contact"
          }
        ]
      }
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify(contactSchema);
    document.head.appendChild(schemaScript);

    // Cleanup function to restore homepage meta tags when component unmounts
    return () => {
      document.title = "heyMemory - Memory Support App for Alzheimer's, Dementia & Brain Injury";
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          'Digital memory support tool for people with Alzheimer\'s, dementia, traumatic brain injury, and cognitive challenges. Practice face recognition, store important memories, and maintain independence with gentle, accessible tools designed for cognitive support.'
        );
      }
      if (canonical) {
        canonical.setAttribute('href', '/');
      }
    };
  }, []);

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

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
      announceToScreenReader("Message sent successfully. Thank you for contacting us.");
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
        {/* Invisible Breadcrumb Navigation for Screen Readers */}
        <nav aria-label="Breadcrumb" className="sr-only">
          <ol className="flex items-center space-x-2">
            <li className="flex items-center">
              <HomeIcon size={16} aria-hidden="true" />
              <span className="ml-2">Home</span>
              <ChevronRight size={16} className="mx-2" aria-hidden="true" />
            </li>
            <li className="flex items-center">
              <span>Contact</span>
              <ChevronRight size={16} className="mx-2" aria-hidden="true" />
            </li>
            <li className="flex items-center">
              <span aria-current="page">Message Sent</span>
            </li>
          </ol>
        </nav>

        {/* Skip to main content link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          tabIndex={0}
        >
          Skip to main content
        </a>

        <MainNavigation />

        <main role="main" id="main-content" tabIndex={-1}>
          <div className="max-w-2xl mx-auto px-4 py-8 md:px-8 md:py-16 text-center">
            <div 
              className="w-20 h-20 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-8"
              role="img" 
              aria-label="Success indicator"
            >
              <Mail className="w-12 h-12 text-green-600" aria-hidden="true" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-4 md:mb-6" id="success-heading">
              Thank You!
            </h1>
            <p className="text-lg md:text-2xl text-gray-700 mb-8 md:mb-12 leading-relaxed px-2" aria-describedby="success-heading">
              Your message has been sent successfully. We'll get back to you as soon as possible.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="w-full sm:w-auto touch-button bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white font-bold text-lg md:text-2xl px-8 md:px-12 py-4 md:py-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-colors min-h-[56px] md:min-h-[64px]"
              aria-label="Return to contact form to send another message"
              tabIndex={0}
            >
              Send Another Message
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Invisible Breadcrumb Navigation for Screen Readers */}
      <nav aria-label="Breadcrumb" className="sr-only">
        <ol className="flex items-center space-x-2">
          <li className="flex items-center">
            <HomeIcon size={16} aria-hidden="true" />
            <span className="ml-2">Home</span>
            <ChevronRight size={16} className="mx-2" aria-hidden="true" />
          </li>
          <li className="flex items-center">
            <span aria-current="page">Contact</span>
          </li>
        </ol>
      </nav>

      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        tabIndex={0}
      >
        Skip to main content
      </a>

      <MainNavigation backTo={{ href: "/", label: "Back to Home", shortLabel: "Back" }} />
      <main role="main" id="main-content" tabIndex={-1}>
        <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-16">
          {/* Header */}
          <div className="text-center mb-8 md:mb-16">
            <h1 className="text-3xl md:text-6xl font-bold text-black mb-4 md:mb-8" id="contact-heading">
              Contact Us
            </h1>
            <p className="text-lg md:text-2xl text-gray-700 leading-relaxed px-2" aria-describedby="contact-heading">
              We're here to help. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border-2 md:border-4 border-gray-300 rounded-xl p-6 md:p-12 mb-8 md:mb-16" role="form" aria-labelledby="contact-form-heading">
              <h2 className="text-2xl md:text-4xl font-bold text-black mb-6 md:mb-12" id="contact-form-heading">Send Us a Message</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8" noValidate aria-describedby="contact-form-heading">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg md:text-2xl font-bold text-black mb-2 md:mb-4 block" id="name-label">
                        Your Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Full name"
                          className="text-lg md:text-2xl p-4 md:p-6 rounded-xl border-2 md:border-4 border-gray-300 focus:border-[var(--button-primary)] focus:outline-none focus:ring-4 focus:ring-blue-200 bg-white min-h-[56px] touch-manipulation"
                          aria-labelledby="name-label"
                          aria-required="true"
                          aria-describedby="name-error"
                          tabIndex={0}
                        />
                      </FormControl>
                      <FormMessage className="text-base md:text-xl text-red-600 mt-2" id="name-error" />
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
                  aria-label="Submit contact form message"
                  tabIndex={0}
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
                </form>
              </Form>
            </div>

          {/* Contact Information */}
          <div className="bg-white border-2 md:border-4 border-gray-300 rounded-xl p-6 md:p-12" role="complementary" aria-labelledby="contact-info-heading">
            <h2 className="text-2xl md:text-4xl font-bold text-black mb-6 md:mb-12" id="contact-info-heading">Get in Touch</h2>
            
            <div className="space-y-6 md:space-y-8" role="list" aria-label="Contact information">
              <div className="flex items-start space-x-4 md:space-x-6" role="listitem">
                <div className="bg-blue-100 p-3 md:p-4 rounded-xl flex-shrink-0" role="img" aria-label="Email contact method">
                  <Mail className="w-6 h-6 md:w-8 md:h-8 text-blue-600" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg md:text-2xl font-bold text-black mb-1 md:mb-2" id="email-heading">Email</h3>
                  <p className="text-base md:text-xl text-gray-700 mb-1 md:mb-2 break-words" aria-describedby="email-heading">
                    <a href="mailto:help@heymemory.app" className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded" aria-label="Send email to heyMemory support team">
                      help@heymemory.app
                    </a>
                  </p>
                  <p className="text-sm md:text-lg text-gray-600">We try to respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 md:space-x-6" role="listitem">
                <div className="bg-green-100 p-3 md:p-4 rounded-xl flex-shrink-0" role="img" aria-label="Support hours information">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-green-600" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg md:text-2xl font-bold text-black mb-1 md:mb-2" id="hours-heading">Support Hours</h3>
                  <p className="text-base md:text-xl text-gray-700" aria-describedby="hours-heading">
                    <time dateTime="10:00">10 AM</time> - <time dateTime="17:00">5 PM</time>, Monday - Friday
                  </p>
                  <p className="text-sm md:text-lg text-gray-600">Eastern Time (US)</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>
      
      <MainFooter />
    </div>
  );
}