import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users, Lightbulb, Phone, Mail } from "lucide-react";
import { Link } from "wouter";
import heroImage from "../../../server/uploads/images/Senior Man Using heyMemory on Smartphone - heyMemory The Alzheimer App.png";

export default function Home() {

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.focus();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation Bar - Mobile Optimized */}
      <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50" role="navigation" aria-label="Main navigation">
        <div className="max-w-6xl mx-auto px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <Link href="/">
              <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer">
                <Brain className="text-[var(--button-primary)] w-6 h-6 md:w-8 md:h-8" aria-hidden="true" />
                <span className="text-xl md:text-2xl font-bold">heyMemory</span>
              </div>
            </Link>
            
            {/* Mobile Navigation - Always visible CTA */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/dashboard" className="md:hidden">
                <Button className="touch-button bg-blue-600 text-white font-bold text-base px-4 py-2 rounded-lg hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors">
                  Dashboard
                </Button>
              </Link>
              
              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard">
                  <button className="text-body font-bold hover:text-[var(--button-primary)] focus:text-[var(--button-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] focus:ring-offset-2 rounded px-4 py-2">
                    Dashboard
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="text-body font-bold hover:text-[var(--button-primary)] focus:text-[var(--button-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] focus:ring-offset-2 rounded px-4 py-2">
                    Contact
                  </button>
                </Link>
                
                {/* Accessibility Indicator - Desktop only */}
                <div className="flex items-center bg-green-100 border-2 border-green-200 rounded-lg px-3 py-2">
                  <span className="text-xl font-black text-green-700 mr-2">A+</span>
                  <span className="text-base font-bold text-green-700">Accessible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main role="main">
        {/* Hero Section - Mobile Optimized */}
        <section className="bg-blue-50 py-8 md:py-16 lg:py-24" aria-labelledby="hero-heading">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="text-center lg:text-left order-2 lg:order-1">
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
                
                {/* CTA Buttons - Mobile First */}
                <div className="flex flex-col gap-4 md:gap-6 justify-center lg:justify-start items-center">
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button 
                      className="w-full sm:w-auto touch-button bg-black text-white font-black text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 rounded-xl hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors min-h-[56px] md:min-h-[64px] border-3 border-black"
                    >
                      <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Log In
                    </Button>
                  </Link>
                  
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button 
                      variant="outline"
                      className="w-full sm:w-auto touch-button bg-white text-black font-black text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 rounded-xl border-3 md:border-4 border-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors min-h-[56px] md:min-h-[64px]"
                    >
                      <svg className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                      Register
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Right Column - Hero Image */}
              <div className="flex justify-center lg:justify-end order-1 lg:order-2 mb-6 lg:mb-0">
                <img 
                  src={heroImage}
                  alt="Senior man using heyMemory app on smartphone, demonstrating accessibility features"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-lg"
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
            
            <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-12 max-w-4xl mx-auto">
              {/* Feature Card 1: Faces Game */}
              <Card className="mobile-card bg-white rounded-xl border-2 border-gray-300 shadow-lg">
                <CardContent className="p-0">
                  <div className="text-center mb-4 md:mb-8">
                    <Users className="text-[var(--button-primary)] w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" aria-hidden="true" />
                    <h3 className="text-card-heading mb-3 md:mb-6">Faces Game</h3>
                  </div>
                  <p className="text-body leading-relaxed text-center">
                    Help you remember faces of people you love. 
                    Safe, private, and easy to use.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature Card 2: Remember This */}
              <Card className="mobile-card bg-white rounded-xl border-2 border-gray-300 shadow-lg">
                <CardContent className="p-0">
                  <div className="text-center mb-4 md:mb-8">
                    <Lightbulb className="text-[var(--button-primary)] w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" aria-hidden="true" />
                    <h3 className="text-card-heading mb-3 md:mb-6">Remember This</h3>
                  </div>
                  <p className="text-body leading-relaxed text-center">
                    Keep notes to help you remember names, places, and things. 
                    Easy to use when you need to remember something.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-green-50 py-16 md:py-24" aria-labelledby="how-it-works-heading">
          <div className="max-w-6xl mx-auto px-6">
            <h2 id="how-it-works-heading" className="text-section-heading text-center mb-16">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {/* Step 1 */}
              <Card className="bg-white p-8 rounded-xl border-2 border-gray-300 shadow-lg text-center">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-[var(--button-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-card-heading mb-4">Family Sets Up</h3>
                  <p className="text-body leading-relaxed">
                    A caregiver, family member, or friend creates a profile and adds photos and information 
                    to help support their loved one's memory.
                  </p>
                </CardContent>
              </Card>
              
              {/* Step 2 */}
              <Card className="bg-white p-8 rounded-xl border-2 border-gray-300 shadow-lg text-center">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-[var(--button-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-card-heading mb-4">Daily Practice</h3>
                  <p className="text-body leading-relaxed">
                    The user enjoys a simple, fun Faces Game each day that help exercise memory 
                    and keep important information about loved ones fresh in mind.
                  </p>
                </CardContent>
              </Card>
              
              {/* Step 3 */}
              <Card className="bg-white p-8 rounded-xl border-2 border-gray-300 shadow-lg text-center">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-[var(--button-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-card-heading mb-4">Find & Remember</h3>
                  <p className="text-body leading-relaxed">
                    Quick answers to important personal questions, like "Where do I live?" or "Where are my pills?" 
                    Caregivers can add helpful notes, photos, or directions so everything is easy to find when needed.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <p className="text-body text-xl leading-relaxed max-w-3xl mx-auto">
                heyMemory brings families together to support memory wellness with dignity, 
                understanding, and care.
              </p>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="bg-blue-50 py-16 md:py-24" aria-labelledby="support-heading">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 id="support-heading" className="text-section-heading mb-8">
              We're Here to Help
            </h2>
            <p className="text-body mb-12 leading-relaxed">
              heyMemory was created with care and understanding. If you need assistance or have questions, 
              our support team is ready to help you every step of the way.
            </p>
            <Card className="bg-[var(--background-light)] p-10 rounded-xl border-2 border-gray-300">
              <CardContent className="p-0">
                <div className="flex justify-center items-center">
                  <div className="text-center">
                    <Mail className="text-[var(--button-primary)] w-12 h-12 mx-auto mb-4" aria-hidden="true" />
                    <p className="text-body font-bold mb-2">Email Support</p>
                    <p className="text-body">help@heymemory.app</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      {/* Footer */}
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
