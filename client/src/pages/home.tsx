import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users, Lightbulb, Phone, Mail, Home as HomeIcon, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { MainFooter } from "@/components/MainFooter";
import { MainNavigation } from "@/components/MainNavigation";
import heroImage from "../../../server/uploads/images/Senior Man Using heyMemory on Smartphone - heyMemory The Alzheimer App.png";
import { useEffect } from "react";

export default function Home() {

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.focus();
      // Announce to screen readers
      const announcement = `Navigated to ${element.getAttribute('aria-label') || element.textContent?.slice(0, 50) || 'section'}`;
      announceToScreenReader(announcement);
    }
  };

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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        // Enhanced tab navigation - ensure visible focus indicators
        const focusedElement = document.activeElement as HTMLElement;
        if (focusedElement) {
          focusedElement.style.outline = '3px solid #2563eb';
          focusedElement.style.outlineOffset = '2px';
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        // Remove manual outline after a short delay to let default focus styles show
        setTimeout(() => {
          const focusedElement = document.activeElement as HTMLElement;
          if (focusedElement) {
            focusedElement.style.outline = '';
            focusedElement.style.outlineOffset = '';
          }
        }, 100);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Invisible Breadcrumb Navigation for Screen Readers */}
      <nav aria-label="Breadcrumb" className="sr-only">
        <ol className="flex items-center space-x-2">
          <li className="flex items-center">
            <HomeIcon size={16} aria-hidden="true" />
            <span className="ml-2">Home</span>
          </li>
        </ol>
      </nav>

      {/* Skip to main content link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        tabIndex={0}
      >
        Skip to main content
      </a>

      <MainNavigation showJoinButton={true} />
      <main role="main" id="main-content" tabIndex={-1}>
        {/* Hero Section - Mobile Optimized */}
        <section className="bg-blue-50 py-8 md:py-16 lg:py-24" aria-labelledby="hero-heading">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="text-center lg:text-left order-1">
                <div className="mb-4 md:mb-6">
                  <p className="text-lg md:text-xl lg:text-2xl font-medium text-gray-600 mb-3 md:mb-4">
                    Gentle tools to help you remember what matters.
                  </p>
                </div>
                
                <h1 id="hero-heading" className="text-hero mb-6 md:mb-8 leading-tight">
                  Welcome to heyMemory
                </h1>
                
                <p className="text-body mb-8 md:mb-12 leading-relaxed">
                  heyMemory is designed to help you remember important people, places, and facts. 
                  Our simple and clear interface makes it easy to store and recall the memories that matter most to you.
                </p>
                
                {/* CTA Buttons - Mobile First, Desktop Horizontal */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center lg:justify-start items-center" role="group" aria-label="Get started with heyMemory">
                  <Link href="/login" className="w-full sm:w-auto md:w-auto">
                    <Button 
                      className="w-full md:w-auto touch-button bg-black text-white font-black text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 rounded-xl hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors min-h-[56px] md:min-h-[64px] border-3 border-black"
                      aria-label="Log in to your existing heyMemory account"
                      tabIndex={0}
                    >
                      <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Log In
                    </Button>
                  </Link>
                  
                  <Link href="/register" className="w-full sm:w-auto md:w-auto">
                    <Button 
                      variant="outline"
                      className="w-full md:w-auto touch-button bg-white text-black font-black text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 rounded-xl border-3 md:border-4 border-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors min-h-[56px] md:min-h-[64px]"
                      aria-label="Create a new heyMemory account to get started"
                      tabIndex={0}
                    >
                      <svg className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Right Column - Hero Image */}
              <div className="flex justify-center lg:justify-end order-2 mb-6 lg:mb-0">
                <img 
                  src={heroImage}
                  alt="Senior man with cognitive challenges using heyMemory app on smartphone, showing large buttons and clear interface designed for people with Alzheimer's, dementia, or brain injury"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-lg"
                  loading="eager"
                  decoding="async"
                  width="400"
                  height="600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Mobile Optimized */}
        <section id="features" className="bg-amber-50 py-8 md:py-16 lg:py-24" aria-labelledby="features-heading">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <h2 id="features-heading" className="text-section-heading text-center mb-8 md:mb-16">
              How heyMemory Helps You
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-12 max-w-4xl mx-auto" role="list" aria-label="Application features">
              {/* Feature Card 1: Faces Game */}
              <Card className="mobile-card bg-white rounded-xl border-2 border-gray-300 shadow-lg" role="listitem" tabIndex={0}>
                <CardContent className="p-6 md:p-8">
                  <div className="text-center mb-4 md:mb-8">
                    <Users className="text-[var(--button-primary)] w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" aria-hidden="true" />
                    <h3 className="text-card-heading mb-3 md:mb-6" id="faces-game-heading">Faces Game</h3>
                  </div>
                  <p className="text-body leading-relaxed text-center" aria-describedby="faces-game-heading">
                    Practice recognizing faces of people you love with our gentle, interactive game. 
                    Completely private and secure, designed to help maintain connections with family and friends.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature Card 2: Remember This */}
              <Card className="mobile-card bg-white rounded-xl border-2 border-gray-300 shadow-lg" role="listitem" tabIndex={0}>
                <CardContent className="p-6 md:p-8">
                  <div className="text-center mb-4 md:mb-8">
                    <Lightbulb className="text-[var(--button-primary)] w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" aria-hidden="true" />
                    <h3 className="text-card-heading mb-3 md:mb-6" id="remember-this-heading">Remember This</h3>
                  </div>
                  <p className="text-body leading-relaxed text-center" aria-describedby="remember-this-heading">
                    Store important information, tasks, and reminders in an easy-to-access format. 
                    Organize your thoughts and memories with simple, clear tools.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <p className="text-body text-xl leading-relaxed max-w-3xl mx-auto">
                This app supports individuals with Neurocognitive Disorders and Neurodevelopmental Disabilities through simple memory training and daily life support.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-green-50 py-16 md:py-24" aria-labelledby="how-it-works-heading">
          <div className="max-w-6xl mx-auto px-6">
            <h2 id="how-it-works-heading" className="text-section-heading text-center mb-16">
              How It Works
            </h2>
            
            <ol className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto" role="list" aria-label="How heyMemory works - 3 simple steps">
              {/* Step 1 */}
              <li>
                <Card className="bg-white p-8 rounded-xl border-2 border-gray-300 shadow-lg text-center" role="listitem" tabIndex={0}>
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-[var(--button-primary)] rounded-full flex items-center justify-center mx-auto mb-6" role="img" aria-label="Step 1">
                      <span className="text-white text-2xl font-bold" aria-hidden="true">1</span>
                    </div>
                    <h3 className="text-card-heading mb-4" id="step1-heading">Family Sets Up</h3>
                    <p className="text-body leading-relaxed" aria-describedby="step1-heading">
                      A caregiver, family member, or friend creates a profile and adds photos and information 
                      to help support their loved one's memory and daily activities.
                    </p>
                  </CardContent>
                </Card>
              </li>
              
              {/* Step 2 */}
              <li>
                <Card className="bg-white p-8 rounded-xl border-2 border-gray-300 shadow-lg text-center" role="listitem" tabIndex={0}>
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-[var(--button-primary)] rounded-full flex items-center justify-center mx-auto mb-6" role="img" aria-label="Step 2">
                      <span className="text-white text-2xl font-bold" aria-hidden="true">2</span>
                    </div>
                    <h3 className="text-card-heading mb-4" id="step2-heading">Daily Practice</h3>
                    <p className="text-body leading-relaxed" aria-describedby="step2-heading">
                      Enjoy gentle, accessible games and exercises designed to support memory function 
                      and help maintain connections with important people and information.
                    </p>
                  </CardContent>
                </Card>
              </li>
              
              {/* Step 3 */}
              <li>
                <Card className="bg-white p-8 rounded-xl border-2 border-gray-300 shadow-lg text-center" role="listitem" tabIndex={0}>
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-[var(--button-primary)] rounded-full flex items-center justify-center mx-auto mb-6" role="img" aria-label="Step 3">
                      <span className="text-white text-2xl font-bold" aria-hidden="true">3</span>
                    </div>
                    <h3 className="text-card-heading mb-4" id="step3-heading">Find & Remember</h3>
                    <p className="text-body leading-relaxed" aria-describedby="step3-heading">
                      Access important reminders and helpful information organized by caregivers, including locations, 
                      instructions, and daily tasks to support independence.
                    </p>
                  </CardContent>
                </Card>
              </li>
            </ol>
            
            <div className="text-center mt-12">
              <p className="text-body text-xl leading-relaxed max-w-3xl mx-auto mb-8">
                heyMemory brings families together to support memory wellness with dignity, 
                understanding, and care.
              </p>
              <Link href="/how-it-works">
                <Button 
                  className="touch-button bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors focus:ring-4 focus:ring-blue-300"
                  aria-label="Learn how to set up and use heyMemory"
                >
                  See How It Works
                  <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="bg-amber-50 py-16 md:py-24" aria-labelledby="support-heading">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 id="support-heading" className="text-section-heading mb-8">
              We're Here to Help
            </h2>
            <p className="text-body mb-12 leading-relaxed">
              heyMemory was created with care and understanding. If you need assistance or have questions, 
              our support team is ready to help you every step of the way.
            </p>
            <Card className="bg-[var(--background-light)] p-10 rounded-xl border-2 border-gray-300" role="complementary" aria-labelledby="support-contact-heading">
              <CardContent className="p-0">
                <div className="flex justify-center items-center">
                  <div className="text-center">
                    <Mail className="text-[var(--button-primary)] w-12 h-12 mx-auto mb-4" aria-hidden="true" />
                    <h3 id="support-contact-heading" className="sr-only">Contact our support team</h3>
                    <Link href="/contact">
                      <Button 
                        className="touch-button bg-[var(--button-primary)] text-white font-bold text-lg px-8 py-4 rounded-xl hover:opacity-90 focus:opacity-90 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all min-h-[56px] border-2 border-[var(--button-primary)]"
                        aria-label="Contact our support team for help with heyMemory"
                        tabIndex={0}
                      >
                        Contact Support
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
}
