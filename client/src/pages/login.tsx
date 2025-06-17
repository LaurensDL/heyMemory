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
    <div className="min-h-screen bg-white flex items-center justify-center px-6" lang="en">
      {/* Invisible breadcrumb navigation for screen readers */}
      <nav aria-label="Breadcrumb navigation" className="sr-only">
        <ol>
          <li><Link href="/" aria-label="Navigate to homepage">Home</Link></li>
          <li aria-current="page">Login</li>
        </ol>
      </nav>

      <main role="main" aria-labelledby="login-heading" className="w-full max-w-md focus:outline-none" tabIndex={-1}>
        {/* Logo */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="text-[var(--button-primary)] w-10 h-10" aria-hidden="true" />
            <h1 id="login-heading" className="text-4xl font-bold text-[var(--heading)] text-[clamp(1.5rem,4vw,4rem)] leading-tight">heyMemory</h1>
          </div>
          <p className="text-[var(--body)] text-[clamp(0.875rem,2.5vw,1rem)]">Sign in to your account</p>
        </header>

        <Card role="region" aria-labelledby="login-form-heading">
          <CardHeader>
            <CardTitle id="login-form-heading" className="text-center text-[clamp(1.125rem,3vw,1.5rem)]">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-describedby="login-instructions">
              <div id="login-instructions" className="sr-only">
                Please enter your email address and password to log in to your heyMemory account. Both fields are required.
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[clamp(0.875rem,2.5vw,1rem)]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-[clamp(0.875rem,2.5vw,1rem)]"
                  autoComplete="email"
                />
                {errors.email && (
                  <div id="email-error" className="flex items-center text-red-600 text-sm" role="alert" aria-live="polite">
                    <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                    {errors.email.message}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[clamp(0.875rem,2.5vw,1rem)]">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-[clamp(0.875rem,2.5vw,1rem)]"
                  autoComplete="current-password"
                />
                {errors.password && (
                  <div id="password-error" className="flex items-center text-red-600 text-sm" role="alert" aria-live="polite">
                    <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                    {errors.password.message}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-[clamp(0.875rem,2.5vw,1rem)]"
                disabled={loginMutation.isPending}
                aria-describedby="submit-status"
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
              
              <div id="submit-status" className="sr-only" aria-live="polite">
                {loginMutation.isPending ? "Processing login request..." : "Ready to sign in"}
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[var(--body)] text-[clamp(0.75rem,2vw,0.875rem)]">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-[var(--button-primary)] hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  aria-label="Navigate to registration page to create a new account"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}