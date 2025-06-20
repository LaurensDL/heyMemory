import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users, Lightbulb, Settings, LogOut, Heart, Mail } from "lucide-react";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const logoutMutation = useLogout();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Add canonical URL
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = window.location.origin + '/dashboard';
    document.head.appendChild(canonicalLink);

    // Add language attribute
    document.documentElement.lang = 'en';

    // Screen reader announcement for page load
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Dashboard loaded. Navigate using the menu options to access your memory tools and account settings.';
    document.body.appendChild(announcement);

    // Remove announcement after screen readers have time to read it
    const announcementTimer = setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);

    return () => {
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

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Brain className="text-[var(--button-primary)] w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p className="text-body">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" lang="en">
      {/* Invisible breadcrumb navigation for screen readers */}
      <nav aria-label="Breadcrumb navigation" className="sr-only">
        <ol>
          <li><Link href="/" aria-label="Navigate to homepage">Home</Link></li>
          <li aria-current="page">Dashboard</li>
        </ol>
      </nav>

      {/* Navigation Bar - Mobile Optimized */}
      <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50" role="navigation" aria-label="Dashboard navigation">
        <div className="max-w-6xl mx-auto px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <Link href="/" aria-label="Return to heyMemory homepage">
              <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">
                <Brain className="text-[var(--button-primary)] w-6 h-6 md:w-8 md:h-8" aria-hidden="true" />
                <span className="text-xl md:text-2xl font-bold text-[clamp(1.125rem,3vw,1.5rem)]">heyMemory</span>
              </div>
            </Link>
            
            {/* Mobile Actions - Stacked menu for small screens */}
            <div className="flex items-center space-x-2 md:hidden">
              <Link href="/profile">
                <Button variant="outline" className="touch-button bg-white text-black font-bold text-sm px-3 py-2 rounded-lg border-2 border-gray-300 hover:bg-gray-100 focus:bg-gray-100">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link href="/caregiver">
                <Button variant="outline" className="touch-button bg-pink-100 text-pink-800 font-bold text-sm px-3 py-2 rounded-lg border-2 border-pink-300 hover:bg-pink-200 focus:bg-pink-200">
                  <Heart className="w-4 h-4" />
                </Button>
              </Link>

              {user?.isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" className="touch-button bg-purple-100 text-purple-800 font-bold text-sm px-3 py-2 rounded-lg border-2 border-purple-300 hover:bg-purple-200 focus:bg-purple-200">
                    <Users className="w-4 h-4" />
                  </Button>
                </Link>
              )}
              
              <Button 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                variant="outline"
                className="touch-button bg-red-100 text-red-800 font-bold text-sm px-3 py-2 rounded-lg border-2 border-red-300 hover:bg-red-200 focus:bg-red-200"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Desktop Actions - Full size with text */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="outline" className="bg-white text-black font-bold text-lg px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors">
                  <Settings className="w-5 h-5 mr-2" />
                  Settings
                </Button>
              </Link>
              
              <Link href="/caregiver">
                <Button variant="outline" className="bg-pink-100 text-pink-800 font-bold text-lg px-6 py-3 rounded-xl border-2 border-pink-300 hover:bg-pink-200 focus:bg-pink-200 focus:outline-none focus:ring-4 focus:ring-pink-400 transition-colors">
                  <Heart className="w-5 h-5 mr-2" />
                  Caregiver Tools
                </Button>
              </Link>

              {user?.isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" className="bg-purple-100 text-purple-800 font-bold text-lg px-6 py-3 rounded-xl border-2 border-purple-300 hover:bg-purple-200 focus:bg-purple-200 focus:outline-none focus:ring-4 focus:ring-purple-400 transition-colors">
                    <Users className="w-5 h-5 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              
              <Button 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                variant="outline"
                className="bg-white text-black font-bold text-lg px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                {logoutMutation.isPending ? "Logging Out..." : "Log Out"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main role="main" className="py-8 md:py-16">
        {/* Welcome Section - Mobile Optimized */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 mb-8 md:mb-16">
          <div className="text-center">
            <h1 className="text-hero mb-4 md:mb-6">
              Hello {user?.firstName || user?.email?.split('@')[0] || 'there'}!
            </h1>
            {user && !user.isEmailVerified && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 md:p-6 max-w-2xl mx-auto mb-6 md:mb-8">
                <p className="text-body font-bold text-yellow-800">
                  Please verify your email address to access all features.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section - Mobile Optimized */}
        <section className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-section-heading text-center mb-8 md:mb-16">
            Choose What You'd Like to Do
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-12 max-w-4xl mx-auto">
            {/* Feature Card 1: Faces Game */}
            <Card className="mobile-card bg-white rounded-xl border-2 border-gray-300 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="text-center mb-4 md:mb-8">
                  <Users className="text-[var(--button-primary)] w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" aria-hidden="true" />
                  <h3 className="text-card-heading mb-3 md:mb-6">Faces Game</h3>
                </div>
                <p className="text-body leading-relaxed text-center mb-6 md:mb-8">
                  Practice recognizing and remembering important people in your life with our interactive faces game.
                </p>
                <Link href="/faces-game">
                  <Button 
                    className="w-full touch-button bg-black text-white font-black text-lg md:text-xl py-4 md:py-6 rounded-xl hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors border-3 border-black"
                    disabled={user && !user.isEmailVerified}
                  >
                    {user && !user.isEmailVerified ? "Verify Email First" : "Start Faces Game"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Feature Card 2: Remember This */}
            <Card className="mobile-card bg-white rounded-xl border-2 border-gray-300 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="text-center mb-4 md:mb-8">
                  <Lightbulb className="text-[var(--button-primary)] w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" aria-hidden="true" />
                  <h3 className="text-card-heading mb-3 md:mb-6">Remember This</h3>
                </div>
                <p className="text-body leading-relaxed text-center mb-6 md:mb-8">
                  Store important facts, locations, and memories in an easy-to-access format.
                </p>
                <Link href="/remember">
                  <Button 
                    className="w-full touch-button bg-black text-white font-black text-lg md:text-xl py-4 md:py-6 rounded-xl hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors border-3 border-black"
                    disabled={user && !user.isEmailVerified}
                  >
                    {user && !user.isEmailVerified ? "Verify Email First" : "Start Remembering"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}