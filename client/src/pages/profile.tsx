import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, type UpdateProfileData } from "@shared/schema";
import { useAuth, useUpdateProfile } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Brain, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function Profile() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfile();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        country: user.country || "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileData) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      toast({
        title: "Profile Updated",
        description: data.email !== user?.email 
          ? "Profile updated successfully. Please check your email for verification if you changed your email address."
          : "Profile updated successfully.",
      });
      
      // Reset password fields
      reset({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
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
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white border-b-2 border-gray-200" role="navigation" aria-label="Profile navigation">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <Brain className="text-[var(--button-primary)] w-8 h-8" aria-hidden="true" />
              <span className="text-2xl font-bold">heyMemory</span>
            </div>
            
            {/* Back to Dashboard */}
            <Link href="/dashboard">
              <Button variant="outline" className="bg-white text-black font-bold text-lg px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main role="main" className="py-16">
        <div className="max-w-2xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-hero mb-4">
              Hello {user?.firstName || user?.email?.split('@')[0] || 'there'}!
            </h1>
            <p className="text-body">
              Logged in as: {user?.email}
            </p>
          </div>

          {/* Email Verification Notice */}
          {user && !user.isEmailVerified && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
              <p className="text-body font-bold text-yellow-800 text-center">
                Your email address is not verified. Please check your email for verification instructions.
              </p>
            </div>
          )}

          <Card className="bg-white border-2 border-gray-300 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-card-heading">Update Profile</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <h3 className="text-card-heading">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-body font-bold">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        {...register("firstName")}
                        className="h-12 text-lg border-2 border-gray-300 focus:border-[var(--button-primary)] rounded-lg"
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-600 text-lg font-medium">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-body font-bold">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        {...register("lastName")}
                        className="h-12 text-lg border-2 border-gray-300 focus:border-[var(--button-primary)] rounded-lg"
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-600 text-lg font-medium">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-body font-bold">
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth")}
                      className="h-12 text-lg border-2 border-gray-300 focus:border-[var(--button-primary)] rounded-lg"
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-600 text-lg font-medium">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

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
                </div>

                {/* Address Section */}
                <div className="border-t-2 border-gray-200 pt-8 space-y-6">
                  <h3 className="text-card-heading">Address Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-body font-bold">
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      {...register("address")}
                      className="h-12 text-lg border-2 border-gray-300 focus:border-[var(--button-primary)] rounded-lg"
                      placeholder="Enter your street address"
                    />
                    {errors.address && (
                      <p className="text-red-600 text-lg font-medium">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-body font-bold">
                        City
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        {...register("city")}
                        className="h-12 text-lg border-2 border-gray-300 focus:border-[var(--button-primary)] rounded-lg"
                        placeholder="Enter your city"
                      />
                      {errors.city && (
                        <p className="text-red-600 text-lg font-medium">{errors.city.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-body font-bold">
                        State/Province
                      </Label>
                      <Input
                        id="state"
                        type="text"
                        {...register("state")}
                        className="h-12 text-lg border-2 border-gray-300 focus:border-[var(--button-primary)] rounded-lg"
                        placeholder="Enter your state/province"
                      />
                      {errors.state && (
                        <p className="text-red-600 text-lg font-medium">{errors.state.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-body font-bold">
                        ZIP/Postal Code
                      </Label>
                      <Input
                        id="zipCode"
                        type="text"
                        {...register("zipCode")}
                        className="h-12 text-lg border-2 border-gray-300 focus:border-[var(--button-primary)] rounded-lg"
                        placeholder="Enter your ZIP code"
                      />
                      {errors.zipCode && (
                        <p className="text-red-600 text-lg font-medium">{errors.zipCode.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-body font-bold">
                        Country
                      </Label>
                      <Input
                        id="country"
                        type="text"
                        {...register("country")}
                        className="h-12 text-lg border-2 border-gray-300 focus:border-[var(--button-primary)] rounded-lg"
                        placeholder="Enter your country"
                      />
                      {errors.country && (
                        <p className="text-red-600 text-lg font-medium">{errors.country.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="border-t-2 border-gray-200 pt-8 space-y-6">
                  <h3 className="text-card-heading">Security</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-body font-bold">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...register("currentPassword")}
                      className="h-12 text-lg border-2 border-gray-300 focus:border-[var(--button-primary)] rounded-lg"
                      placeholder="Enter your current password"
                    />
                    {errors.currentPassword && (
                      <p className="text-red-600 text-lg font-medium">{errors.currentPassword.message}</p>
                    )}
                    <p className="text-lg text-gray-600">
                      Required to save any changes to your profile
                    </p>
                  </div>
                </div>

                {/* New Password Section */}
                <div className="border-t-2 border-gray-200 pt-8">
                  <h3 className="text-card-heading mb-6">Change Password (Optional)</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-body font-bold">
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...register("newPassword")}
                        className="h-12 text-lg border-2 border-gray-300 focus:border-[var(--button-primary)] rounded-lg"
                        placeholder="Enter new password (optional)"
                      />
                      {errors.newPassword && (
                        <p className="text-red-600 text-lg font-medium">{errors.newPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword" className="text-body font-bold">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmNewPassword"
                        type="password"
                        {...register("confirmNewPassword")}
                        className="h-12 text-lg border-2 border-gray-300 focus:border-[var(--button-primary)] rounded-lg"
                        placeholder="Confirm new password"
                      />
                      {errors.confirmNewPassword && (
                        <p className="text-red-600 text-lg font-medium">{errors.confirmNewPassword.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full bg-black text-white font-black text-xl py-6 rounded-xl hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors min-h-[64px] border-3 border-black"
                >
                  {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}