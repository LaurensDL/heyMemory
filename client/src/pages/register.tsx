import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterData } from "@shared/schema";
import { useRegister } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Brain, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import VerifyEmailPage from "./verify-email";

export default function Register() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const registerMutation = useRegister();
  const [isSuccess, setIsSuccess] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>("");
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    // Add noindex meta tag to prevent search engine indexing
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    // Add canonical URL
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = window.location.origin + '/register';
    document.head.appendChild(canonicalLink);

    // Add language attribute
    document.documentElement.lang = 'en';

    // Screen reader announcement for page load
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Registration page loaded. Create your heyMemory account to access memory support tools.';
    document.body.appendChild(announcement);

    // Remove announcement after screen readers have time to read it
    const announcementTimer = setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);

    return () => {
      const existingRobots = document.querySelector('meta[name="robots"]');
      if (existingRobots) {
        document.head.removeChild(existingRobots);
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

  // Check if user already exists but unverified
  const checkUserMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/check-verification-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error("Failed to check user status");
      return response.json();
    }
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterData) => {
    // First check if user already exists
    try {
      const userStatus = await checkUserMutation.mutateAsync(data.email);
      
      if (userStatus.exists && userStatus.verified) {
        toast({
          title: "Account Already Exists",
          description: "An account with this email already exists. Please log in instead.",
          variant: "destructive",
        });
        return;
      }
      
      if (userStatus.exists && !userStatus.verified) {
        toast({
          title: "Email Verification Required",
          description: "An account with this email exists but isn't verified. Please complete verification or cancel to start over.",
        });
        setPendingEmail(data.email);
        setShowVerification(true);
        return;
      }
      
      // User doesn't exist, proceed with registration
      await registerMutation.mutateAsync(data);
      setPendingEmail(data.email);
      setShowVerification(true);
      
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again.",
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

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Brain className="text-[var(--button-primary)] w-10 h-10" aria-hidden="true" />
            <span className="text-3xl font-bold">heyMemory</span>
          </div>
          
          <Card className="bg-white border-2 border-gray-300 shadow-lg">
            <CardContent className="p-8">
              <h1 className="text-card-heading mb-6">Check Your Email</h1>
              <p className="text-body mb-8 leading-relaxed">
                We've sent you an email verification link. Please check your email and click the link to verify your account before logging in.
              </p>
              <Link href="/login">
                <Button className="w-full bg-black text-white font-black text-xl py-6 rounded-xl hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors min-h-[64px] border-3 border-black">
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
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
          <p className="text-body">Create your account</p>
        </div>

        <Card className="bg-white border-2 border-gray-300 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-card-heading">Register</CardTitle>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-body font-bold">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className="h-12 text-lg border-2 border-gray-300 focus:border-[var(--button-primary)] rounded-lg"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-lg font-medium">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-black text-white font-black text-xl py-6 rounded-xl hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors min-h-[64px] border-3 border-black"
              >
                {registerMutation.isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-body">
                Already have an account?{" "}
                <Link href="/login">
                  <button className="text-[var(--button-primary)] font-bold hover:underline focus:underline focus:outline-none">
                    Log in here
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