import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users, Lightbulb, Phone, Mail } from "lucide-react";

export default function Home() {
  const handleLogin = () => {
    // Navigate to login page - to be implemented
    console.log('Login button clicked');
  };

  const handleRegister = () => {
    // Navigate to registration page - to be implemented
    console.log('Register button clicked');
  };

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
              <Brain className="text-[#0066CC] text-3xl w-8 h-8" aria-hidden="true" />
              <span className="text-2xl font-bold text-black">heyMemory</span>
            </div>
            
            {/* Navigation Links - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-body font-semibold text-black hover:text-[#0066CC] focus:text-[#0066CC] focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2 rounded px-2 py-1"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('support')}
                className="text-body font-semibold text-black hover:text-[#0066CC] focus:text-[#0066CC] focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2 rounded px-2 py-1"
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
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 id="hero-heading" className="text-hero font-bold text-black mb-8 leading-tight">
              Welcome to heyMemory
            </h1>
            
            <p className="text-body text-black mb-12 max-w-3xl mx-auto leading-relaxed">
              heyMemory is designed to help you remember important people, places, and facts. 
              Our simple and clear interface makes it easy to store and recall the memories that matter most to you.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                onClick={handleLogin}
                className="w-full sm:w-auto bg-[#0066CC] text-white text-button font-semibold px-12 py-4 rounded-lg hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-colors min-h-[56px] min-w-[200px]"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Log In
              </Button>
              
              <Button 
                onClick={handleRegister}
                variant="outline"
                className="w-full sm:w-auto bg-white text-[#0066CC] text-button font-semibold px-12 py-4 rounded-lg border-2 border-[#0066CC] hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-colors min-h-[56px] min-w-[200px]"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Register
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gray-50 py-16 md:py-24" aria-labelledby="features-heading">
          <div className="max-w-6xl mx-auto px-6">
            <h2 id="features-heading" className="text-4xl font-bold text-black text-center mb-16">
              How heyMemory Helps You
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {/* Feature Card 1: Faces Game */}
              <Card className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                <CardContent className="p-0">
                  <div className="text-center mb-6">
                    <Users className="text-[#0066CC] w-12 h-12 mx-auto mb-4" aria-hidden="true" />
                    <h3 className="text-2xl font-bold text-black mb-4">Faces Game</h3>
                  </div>
                  <p className="text-body text-black leading-relaxed text-center">
                    Practice recognizing and remembering important people in your life with our interactive faces game. 
                    Safe, private, and designed to help strengthen memory connections.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature Card 2: Remember This */}
              <Card className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                <CardContent className="p-0">
                  <div className="text-center mb-6">
                    <Lightbulb className="text-[#0066CC] w-12 h-12 mx-auto mb-4" aria-hidden="true" />
                    <h3 className="text-2xl font-bold text-black mb-4">Remember This</h3>
                  </div>
                  <p className="text-body text-black leading-relaxed text-center">
                    Store important facts, locations, and memories in an easy-to-access format. 
                    Review and practice recalling information whenever you need it.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="bg-white py-16 md:py-24" aria-labelledby="support-heading">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 id="support-heading" className="text-4xl font-bold text-black mb-8">
              We're Here to Help
            </h2>
            <p className="text-body text-black mb-8 leading-relaxed">
              heyMemory was created with care and understanding. If you need assistance or have questions, 
              our support team is ready to help you every step of the way.
            </p>
            <Card className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                  <div className="text-center">
                    <Phone className="text-[#0066CC] w-8 h-8 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-body font-semibold text-black">Call Support</p>
                    <p className="text-body text-black">1-800-MEMORY-1</p>
                  </div>
                  <div className="text-center">
                    <Mail className="text-[#0066CC] w-8 h-8 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-body font-semibold text-black">Email Support</p>
                    <p className="text-body text-black">help@heymemory.com</p>
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
              <Brain className="text-[#0066CC] w-6 h-6" aria-hidden="true" />
              <span className="text-xl font-bold text-black">heyMemory</span>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
              <button className="text-body font-semibold text-black hover:text-[#0066CC] focus:text-[#0066CC] focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2 rounded px-2 py-1">
                Privacy Policy
              </button>
              <button className="text-body font-semibold text-black hover:text-[#0066CC] focus:text-[#0066CC] focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2 rounded px-2 py-1">
                Accessibility
              </button>
              <button className="text-body font-semibold text-black hover:text-[#0066CC] focus:text-[#0066CC] focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2 rounded px-2 py-1">
                Contact Us
              </button>
            </div>
            
            <p className="text-lg text-black">
              © 2024 heyMemory. Designed with care for memory support.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
