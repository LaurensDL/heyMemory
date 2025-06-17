import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, UserPlus, Camera, Brain, Heart, ArrowRight, ArrowDown } from "lucide-react";
import { Link } from "wouter";
import { MainFooter } from "@/components/MainFooter";
import { MainNavigation } from "@/components/MainNavigation";
import { useEffect } from "react";

export default function HowItWorksPage() {
  useEffect(() => {
    // Add meta title
    document.title = 'How to Setup heyMemory - Memory Support App for Alzheimer\'s, Dementia & Brain Injury | heyMemory';

    // Add meta description optimized for target audience
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Step-by-step guide to setup heyMemory for Alzheimer\'s, dementia, autism, brain injury, and cognitive challenges. Easy memory support tools for families and caregivers.';
    document.head.appendChild(metaDescription);

    // Add meta keywords
    const metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = 'memory app setup, Alzheimer\'s app, dementia support, brain injury tools, autism memory aid, cognitive support app, memory training, family caregiver tools, face recognition game, memory care';
    document.head.appendChild(metaKeywords);

    // Add Open Graph meta tags
    const ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.content = 'How to Setup heyMemory - Memory Support for Cognitive Challenges';
    document.head.appendChild(ogTitle);

    const ogDescription = document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.content = 'Simple setup guide for heyMemory - supporting people with Alzheimer\'s, dementia, autism, and brain injuries through memory tools and games.';
    document.head.appendChild(ogDescription);

    const ogType = document.createElement('meta');
    ogType.setAttribute('property', 'og:type');
    ogType.content = 'article';
    document.head.appendChild(ogType);

    const ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    ogUrl.content = window.location.origin + '/how-it-works';
    document.head.appendChild(ogUrl);

    const ogSiteName = document.createElement('meta');
    ogSiteName.setAttribute('property', 'og:site_name');
    ogSiteName.content = 'heyMemory';
    document.head.appendChild(ogSiteName);

    // Add Twitter Card meta tags
    const twitterCard = document.createElement('meta');
    twitterCard.name = 'twitter:card';
    twitterCard.content = 'summary_large_image';
    document.head.appendChild(twitterCard);

    const twitterTitle = document.createElement('meta');
    twitterTitle.name = 'twitter:title';
    twitterTitle.content = 'How to Setup heyMemory - Memory Support for Cognitive Challenges';
    document.head.appendChild(twitterTitle);

    const twitterDescription = document.createElement('meta');
    twitterDescription.name = 'twitter:description';
    twitterDescription.content = 'Simple setup guide for heyMemory - supporting people with Alzheimer\'s, dementia, autism, and brain injuries.';
    document.head.appendChild(twitterDescription);

    // Add canonical URL
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = window.location.origin + '/how-it-works';
    document.head.appendChild(canonicalLink);

    // Add language attribute
    document.documentElement.lang = 'en';

    // Add structured data (JSON-LD schema markup)
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Setup heyMemory for Memory Support",
      "description": "Complete guide to setting up heyMemory app for people with Alzheimer's, dementia, autism, brain injury, and other cognitive challenges",
      "image": {
        "@type": "ImageObject",
        "url": "https://heymemory.app/images/heymemory-setup-guide.png",
        "width": 1200,
        "height": 630,
        "caption": "heyMemory setup guide for people with cognitive challenges"
      },
      "totalTime": "PT15M",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "0"
      },
      "tool": [
        {
          "@type": "SoftwareApplication",
          "name": "heyMemory",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "Web Browser"
        }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "name": "Create Account",
          "text": "Register with your email and create a secure account for your loved one.",
          "url": "https://heymemory.app/register"
        },
        {
          "@type": "HowToStep", 
          "name": "Add Photos & People",
          "text": "Upload photos of family, friends, and caregivers with their names and relationships."
        },
        {
          "@type": "HowToStep",
          "name": "Create Reminders", 
          "text": "Add important information, contacts, and daily reminders using Remember This section."
        },
        {
          "@type": "HowToStep",
          "name": "Practice & Play",
          "text": "Start using the faces recognition game and accessing reminder cards daily for best results."
        }
      ],
      "author": {
        "@type": "Organization",
        "name": "heyMemory",
        "url": "https://heymemory.app"
      },
      "publisher": {
        "@type": "Organization", 
        "name": "heyMemory",
        "url": "https://heymemory.app"
      },
      "datePublished": "2025-01-17",
      "dateModified": "2025-01-17"
    });
    document.head.appendChild(schemaScript);

    // Add breadcrumb schema markup
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://heymemory.app/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "How it works",
          "item": "https://heymemory.app/how-it-works"
        }
      ]
    });
    document.head.appendChild(breadcrumbScript);

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
      // Cleanup all meta tags
      const metaTags = [
        'meta[name="description"]',
        'meta[name="keywords"]', 
        'meta[property="og:title"]',
        'meta[property="og:description"]',
        'meta[property="og:type"]',
        'meta[property="og:url"]',
        'meta[property="og:site_name"]',
        'meta[name="twitter:card"]',
        'meta[name="twitter:title"]',
        'meta[name="twitter:description"]',
        'link[rel="canonical"]',
        'script[type="application/ld+json"]'
      ];
      
      metaTags.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
          document.head.removeChild(element);
        }
      });

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
      description: "Upload photos of family, friends, pets, and caregivers with their names.",
      icon: Camera,
      details: [
        "Go to Caregiver Tools",
        "Add photos of important people and pets",
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
          <h1 id="how-it-works-heading" className="text-4xl md:text-5xl font-bold mb-6 text-[clamp(2rem,4vw,3rem)] leading-tight" tabIndex={0}>
            How heyMemory Works
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-[clamp(1rem,2.5vw,1.25rem)] leading-relaxed" aria-describedby="how-it-works-heading">
            Simple steps to set up memory support tools for your loved one. No technical experience required.
          </p>
        </header>

        {/* Steps */}
        <section aria-labelledby="steps-heading" className="space-y-8 mb-12">
          <h2 id="steps-heading" className="sr-only">Setup steps</h2>
          {steps.map((step, index) => (
            <Card key={step.number} className="overflow-hidden hover:shadow-lg transition-shadow duration-300" role="article" tabIndex={0} aria-labelledby={`step-${step.number}-heading`}>
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Step Number & Icon */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div 
                      className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg"
                      role="img"
                      aria-label={`Step ${step.number}`}
                    >
                      {step.number}
                    </div>
                    <step.icon className="w-8 h-8 text-blue-600" aria-hidden="true" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 
                      id={`step-${step.number}-heading`}
                      className="text-2xl font-bold mb-3 text-[clamp(1.25rem,3vw,1.5rem)]"
                      tabIndex={0}
                    >
                      {step.title}
                    </h3>
                    <p 
                      className="text-gray-600 mb-4 text-[clamp(1rem,2.5vw,1.125rem)] leading-relaxed"
                      aria-describedby={`step-${step.number}-heading`}
                    >
                      {step.description}
                    </p>
                    
                    {/* Details List */}
                    <ul 
                      className="space-y-2" 
                      role="list"
                      aria-label={`${step.title} details`}
                    >
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-3" role="listitem">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="text-gray-700 text-[clamp(0.875rem,2vw,1rem)]">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block flex-shrink-0" aria-hidden="true">
                      <ArrowDown className="w-6 h-6 text-gray-400" aria-label="Next step" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Call to Action */}
        <section className="text-center bg-white rounded-2xl p-8 md:p-12 shadow-sm border" aria-labelledby="get-started-heading" role="complementary">
          <h2 id="get-started-heading" className="text-3xl font-bold mb-4 text-[clamp(1.5rem,3.5vw,2rem)]" tabIndex={0}>
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-8 text-[clamp(1rem,2.5vw,1.125rem)] leading-relaxed max-w-2xl mx-auto" aria-describedby="get-started-heading">
            Join thousands of families using heyMemory to support their loved ones with memory challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" role="group" aria-label="Getting started actions">
            <Link href="/register">
              <Button 
                size="lg" 
                className="touch-button bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors focus:ring-4 focus:ring-blue-300"
                aria-label="Create free heyMemory account to get started"
                tabIndex={0}
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                variant="outline" 
                size="lg" 
                className="touch-button border-2 border-gray-300 hover:bg-gray-50 font-bold px-8 py-4 rounded-xl text-lg transition-colors focus:ring-4 focus:ring-gray-300"
                aria-label="Get help setting up heyMemory"
                tabIndex={0}
              >
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