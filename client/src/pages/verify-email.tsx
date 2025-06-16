import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Clock, RefreshCw, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";

interface VerifyEmailPageProps {
  email: string;
  onCancel: () => void;
  onResendSuccess?: () => void;
}

export default function VerifyEmailPage({ email, onCancel, onResendSuccess }: VerifyEmailPageProps) {
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => setCooldownSeconds(cooldownSeconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  const resendMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to resend email");
      }
      return response.json();
    },
    onSuccess: () => {
      setCooldownSeconds(60); // 1 minute cooldown
      toast({
        title: "Email Sent",
        description: "Verification email has been sent. Please check your inbox.",
      });
      onResendSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Send Email",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/cancel-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to cancel registration");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Cancelled",
        description: "Your registration has been cancelled. You can start over.",
      });
      onCancel();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel registration.",
        variant: "destructive",
      });
    }
  });

  const handleResend = () => {
    if (cooldownSeconds === 0) {
      resendMutation.mutate();
    }
  };

  const handleCancel = () => {
    cancelMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl bg-white border-4 border-gray-300 shadow-xl">
        <CardContent className="p-12">
          <div className="text-center">
            {/* Email Icon */}
            <div className="w-24 h-24 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-8">
              <Mail className="w-16 h-16 text-[var(--button-primary)]" />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-black mb-6">
              Check Your Email
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              We've sent a verification link to:
            </p>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-8">
              <p className="text-2xl font-bold text-[var(--button-primary)]">{email}</p>
            </div>

            <p className="text-lg text-gray-700 mb-12 leading-relaxed">
              Click the verification link in your email to complete your registration. 
              Check your spam folder if you don't see it in a few minutes.
            </p>

            {/* Action Buttons */}
            <div className="space-y-6">
              {/* Resend Button */}
              <div className="text-center">
                <Button
                  onClick={handleResend}
                  disabled={cooldownSeconds > 0 || resendMutation.isPending}
                  className="bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white font-bold text-xl px-8 py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendMutation.isPending ? (
                    <>
                      <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
                      Sending...
                    </>
                  ) : cooldownSeconds > 0 ? (
                    <>
                      <Clock className="w-6 h-6 mr-3" />
                      Resend in {cooldownSeconds}s
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-6 h-6 mr-3" />
                      Resend Email
                    </>
                  )}
                </Button>
              </div>

              {/* Divider */}
              <div className="flex items-center my-8">
                <hr className="flex-1 border-gray-300" />
                <span className="px-4 text-gray-500 font-bold">OR</span>
                <hr className="flex-1 border-gray-300" />
              </div>

              {/* Cancel and Start Over */}
              <div className="text-center">
                <Button
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                  variant="outline"
                  className="bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 font-bold text-xl px-8 py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-400 transition-colors"
                >
                  {cancelMutation.isPending ? (
                    <>
                      <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-6 h-6 mr-3" />
                      Cancel & Start Over
                    </>
                  )}
                </Button>
              </div>

              {/* Back to Home */}
              <div className="text-center pt-6 border-t border-gray-200">
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-[var(--button-primary)] font-bold text-lg px-6 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}