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
      {/* Navigation Bar */}
      <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50" role="navigation" aria-label="Main navigation">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <Brain className="text-[var(--button-primary)] w-8 h-8" aria-hidden="true" />
              <span className="text-2xl font-bold">heyMemory</span>
            </div>
            
            {/* Navigation Links - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-body font-bold hover:text-[var(--button-primary)] focus:text-[var(--button-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] focus:ring-offset-2 rounded px-4 py-2"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('support')}
                className="text-body font-bold hover:text-[var(--button-primary)] focus:text-[var(--button-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] focus:ring-offset-2 rounded px-4 py-2"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main role="main">
        {/* Hero Section */}
        <section className="bg-white py-16 md:py-24" aria-labelledby="hero-heading">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="text-center lg:text-left">
                <div className="mb-6">
                  <p className="text-2xl font-medium text-gray-600 mb-4">
                    Gentle tools to help you remember what matters.
                  </p>
                </div>
                
                <h1 id="hero-heading" className="text-hero mb-8 leading-tight">
                  Welcome to heyMemory
                </h1>
                
                <p className="text-body mb-12 leading-relaxed">
                  heyMemory is designed to help you remember important people, places, and facts. 
                  Our simple and clear interface makes it easy to store and recall the memories that matter most to you.
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
                  <Link href="/login">
                    <Button 
                      className="w-full sm:w-auto bg-black text-white font-black text-xl px-12 py-6 rounded-xl hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors min-h-[64px] min-w-[220px] border-3 border-black"
                    >
                      <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Log In
                    </Button>
                  </Link>
                  
                  <Link href="/register">
                    <Button 
                      variant="outline"
                      className="w-full sm:w-auto bg-white text-black font-black text-xl px-12 py-6 rounded-xl border-4 border-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors min-h-[64px] min-w-[220px]"
                    >
                      <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                      Register
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Right Column - Hero Image */}
              <div className="flex justify-center lg:justify-end">
                <img 
                  src={heroImage}
                  alt="Senior man using heyMemory app on smartphone, demonstrating accessibility features"
                  className="w-full max-w-md lg:max-w-lg rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gray-50 py-16 md:py-24" aria-labelledby="features-heading">
          <div className="max-w-6xl mx-auto px-6">
            <h2 id="features-heading" className="text-section-heading text-center mb-16">
              How heyMemory Helps You
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {/* Feature Card 1: Faces Game */}
              <Card className="bg-white p-10 rounded-xl border-2 border-gray-300 shadow-lg">
                <CardContent className="p-0">
                  <div className="text-center mb-8">
                    <Users className="text-[var(--button-primary)] w-16 h-16 mx-auto mb-6" aria-hidden="true" />
                    <h3 className="text-card-heading mb-6">Faces Game</h3>
                  </div>
                  <p className="text-body leading-relaxed text-center">
                    Help you remember faces of people you love. 
                    Safe, private, and easy to use.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature Card 2: Remember This */}
              <Card className="bg-white p-10 rounded-xl border-2 border-gray-300 shadow-lg">
                <CardContent className="p-0">
                  <div className="text-center mb-8">
                    <Lightbulb className="text-[var(--button-primary)] w-16 h-16 mx-auto mb-6" aria-hidden="true" />
                    <h3 className="text-card-heading mb-6">Remember This</h3>
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

        {/* Support Section */}
        <section id="support" className="bg-white py-16 md:py-24" aria-labelledby="support-heading">
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
                    <p className="text-body">help@heymemory.com</p>
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
              <button className="text-body font-bold hover:text-[var(--button-primary)] focus:text-[var(--button-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] focus:ring-offset-2 rounded px-4 py-2">
                Contact Us
              </button>
            </div>
            
            <p className="text-body">
              © 2024 heyMemory. Designed with care for memory support.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
