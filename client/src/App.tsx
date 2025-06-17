import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { setupConsentListener } from "@/lib/cookieUtils";
import Home from "@/pages/home";
import HowItWorks from "@/pages/how-it-works";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import Admin from "@/pages/admin";
import Caregiver from "@/pages/caregiver";
import FacesGame from "@/pages/faces-game";
import Remember from "@/pages/remember";
import Contact from "@/pages/contact";
import CookiePolicy from "@/pages/cookie-policy";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [location] = useLocation();

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--button-primary)] mx-auto mb-4"></div>
          <p className="text-body">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={isAuthenticated ? Dashboard : Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={isAuthenticated ? Dashboard : Login} />
      <Route path="/profile" component={isAuthenticated ? Profile : Login} />
      <Route path="/admin" component={isAuthenticated && user?.isAdmin ? Admin : Login} />
      <Route path="/caregiver" component={isAuthenticated ? Caregiver : Login} />
      <Route path="/faces-game" component={isAuthenticated ? FacesGame : Login} />
      <Route path="/remember" component={isAuthenticated ? Remember : Login} />
      <Route path="/contact" component={Contact} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    setupConsentListener();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <CookieBanner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
