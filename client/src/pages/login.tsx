import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginData } from "@shared/schema";
import { useLogin } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Brain, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import VerifyEmailPage from "./verify-email";

export default function Login() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useLogin();

  useEffect(() => {
    // Add noindex meta tag to prevent search engine indexing
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    // Add canonical URL
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = window.location.origin + '/login';
    document.head.appendChild(canonicalLink);

    // Add language attribute
    document.documentElement.lang = 'en';

    // Screen reader announcement for page load
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Login page loaded. Sign in to access your heyMemory account and memory support tools.';
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
  const [showVerification, setShowVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // Add canonical URL
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = window.location.origin + '/login';
    document.head.appendChild(canonicalLink);

    // Add language attribute
    document.documentElement.lang = 'en';

    // Screen reader announcement for page load
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Login page loaded. Fill in your email and password to access your heyMemory account.';
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

  const onSubmit = async (data: LoginData) => {
    try {
      await loginMutation.mutateAsync(data);
      toast({
        title: "Login Successful",
        description: "Welcome back to heyMemory!",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      if (error.message && error.message.includes("email not verified")) {
        setPendingEmail(data.email);
        setShowVerification(true);
        return;
      }
      
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  // Show verification page if needed
  if (showVerification && pendingEmail) {
    return (
      <VerifyEmailPage 
        email={pendingEmail}
        onCancel={() => {
          setShowVerification(false);
          setPendingEmail("");
        }}
        onResendSuccess={() => {
          toast({
            title: "Email Sent",
            description: "A new verification email has been sent.",
          });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="text-[var(--button-primary)] w-10 h-10" aria-hidden="true" />
            <span className="text-3xl font-bold">heyMemory</span>
          </div>
          <p className="text-body">Sign in to your account</p>
        </div>

        <Card className="bg-white border-2 border-gray-300 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-card-heading">Login</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-body font-bold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="h-12 text-lg border-2 border-gray-300 focus:border-[var(--button-primary)] rounded-lg"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-600 text-lg font-medium">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-body font-bold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="h-12 text-lg border-2 border-gray-300 focus:border-[var(--button-primary)] rounded-lg"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-600 text-lg font-medium">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-black text-white font-black text-xl py-6 rounded-xl hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors min-h-[64px] border-3 border-black"
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-body">
                Don't have an account?{" "}
                <Link href="/register">
                  <button className="text-[var(--button-primary)] font-bold hover:underline focus:underline focus:outline-none">
                    Sign up here
                  </button>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/">
            <button className="text-body font-bold text-[var(--button-primary)] hover:underline focus:underline focus:outline-none">
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}