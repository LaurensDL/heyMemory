import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, UserPlus, Camera, Brain, Heart, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { MainFooter } from "@/components/MainFooter";
import { MainNavigation } from "@/components/MainNavigation";
import { useEffect } from "react";

export default function HowItWorksPage() {
  useEffect(() => {
    // Add meta tags for SEO
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Learn how to set up heyMemory for your loved one with memory challenges. Simple step-by-step guide from registration to using memory games and reminder cards.';
    document.head.appendChild(metaDescription);

    // Add canonical URL
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = window.location.origin + '/how-it-works';
    document.head.appendChild(canonicalLink);

    // Add language attribute
    document.documentElement.lang = 'en';

    // Screen reader announcement for page load
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'How it works page loaded. Learn the simple steps to set up heyMemory for your loved one.';
    document.body.appendChild(announcement);

    // Remove announcement after screen readers have time to read it
    const announcementTimer = setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);

    return () => {
      const existingDescription = document.querySelector('meta[name="description"]');
      if (existingDescription) {
        document.head.removeChild(existingDescription);
      }
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        document.head.removeChild(existingCanonical);
      }
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
      clearTimeout(announcementTimer);
    };
  }, []);

  const steps = [
    {
      number: 1,
      title: "Create Account",
      description: "Register with your email and create a secure account for your loved one.",
      icon: UserPlus,
      details: [
        "Visit the registration page",
        "Enter email and create password",
        "Verify email address",
        "Complete basic profile information"
      ]
    },
    {
      number: 2,
      title: "Add Photos & People",
      description: "Upload photos of family, friends, and caregivers with their names.",
      icon: Camera,
      details: [
        "Go to Caregiver Tools",
        "Add photos of important people",
        "Include names and relationships",
        "Add at least 3 photos for the game"
      ]
    },
    {
      number: 3,
      title: "Create Reminders",
      description: "Add important information, contacts, and daily reminders.",
      icon: Heart,
      details: [
        "Use 'Remember This' section",
        "Add important phone numbers",
        "Include daily routines",
        "Store helpful notes and tips"
      ]
    },
    {
      number: 4,
      title: "Practice & Play",
      description: "Start using the faces game and accessing reminder cards daily.",
      icon: Brain,
      details: [
        "Play the faces recognition game",
        "Review 'Remember This' cards",
        "Practice regularly for best results",
        "Family can update content anytime"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" lang="en">
      <MainNavigation backTo={{ href: "/", label: "Back to Home", shortLabel: "Back" }} />

      {/* Invisible breadcrumb navigation for screen readers */}
      <nav aria-label="Breadcrumb navigation" className="sr-only">
        <ol>
          <li><Link href="/" aria-label="Navigate to homepage">Home</Link></li>
          <li aria-current="page">How it works</li>
        </ol>
      </nav>

      <main role="main" aria-labelledby="how-it-works-heading" className="container mx-auto px-4 py-8 max-w-4xl focus:outline-none" tabIndex={-1}>
        {/* Header */}
        <header className="text-center mb-12">
          <h1 id="how-it-works-heading" className="text-4xl md:text-5xl font-bold mb-6 text-[clamp(2rem,4vw,3rem)] leading-tight">
            How heyMemory Works
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-[clamp(1rem,2.5vw,1.25rem)] leading-relaxed">
            Simple steps to set up memory support tools for your loved one. No technical experience required.
          </p>
        </header>

        {/* Steps */}
        <section aria-labelledby="steps-heading" className="space-y-8 mb-12">
          <h2 id="steps-heading" className="sr-only">Setup steps</h2>
          {steps.map((step, index) => (
            <Card key={step.number} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Step Number & Icon */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                    <step.icon className="w-8 h-8 text-blue-600" aria-hidden="true" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-[clamp(1.25rem,3vw,1.5rem)]">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-[clamp(1rem,2.5vw,1.125rem)] leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Details List */}
                    <ul className="space-y-2" role="list">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="text-gray-700 text-[clamp(0.875rem,2vw,1rem)]">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block flex-shrink-0">
                      <ArrowRight className="w-6 h-6 text-gray-400" aria-hidden="true" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Call to Action */}
        <section className="text-center bg-white rounded-2xl p-8 md:p-12 shadow-sm border" aria-labelledby="get-started-heading">
          <h2 id="get-started-heading" className="text-3xl font-bold mb-4 text-[clamp(1.5rem,3.5vw,2rem)]">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-8 text-[clamp(1rem,2.5vw,1.125rem)] leading-relaxed max-w-2xl mx-auto">
            Join thousands of families using heyMemory to support their loved ones with memory challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="touch-button bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors focus:ring-4 focus:ring-blue-300">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="touch-button border-2 border-gray-300 hover:bg-gray-50 font-bold px-8 py-4 rounded-xl text-lg transition-colors focus:ring-4 focus:ring-gray-300">
                Get Help
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
}