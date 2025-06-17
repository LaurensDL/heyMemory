import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Shield, Eye, Database, Users, Clock, Brain } from "lucide-react";
import { Link } from "wouter";
import { MainFooter } from "@/components/MainFooter";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
            
            {/* Navigation Links - Mobile Responsive */}
            <div className="flex items-center">
              <Link href="/">
                <Button variant="outline" className="touch-button bg-white text-black font-bold text-sm md:text-lg px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl border-2 border-gray-300 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-gray-400 transition-colors">
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Our Commitment to Your Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                At heyMemory, we understand that privacy is especially important when dealing with 
                personal memories and health-related information. This Privacy Policy explains how 
                Biltsite ("we," "our," or "us") collects, uses, protects, and shares your personal 
                information when you use the heyMemory application.
              </p>
              <p>
                <strong>Company Information:</strong><br />
                Biltsite<br />
                Founder: Laurens De Leeuw<br />
                Address: Donklaan 79 bus 16, 9290 Berlare, Belgium<br />
                Contact: help@heyMemory.app
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Email address (for account creation and communication)</li>
                  <li>First and last name</li>
                  <li>Date of birth (to provide age-appropriate features)</li>
                  <li>Address information (city, state, zip code, country)</li>
                  <li>Caregiver phone number (for emergency contact purposes)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Memory-Related Content</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Photos of faces you upload for memory exercises</li>
                  <li>Names and descriptions associated with photos</li>
                  <li>Memory items and reminders you create</li>
                  <li>Personal notes and descriptions</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Technical Information</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Device information and browser type</li>
                  <li>IP address and general location</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Error logs and performance data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold">Primary Services</h4>
                  <ul className="list-disc list-inside text-muted-foreground ml-4 mt-1">
                    <li>Provide personalized memory support and cognitive exercises</li>
                    <li>Store and organize your photos and memory items</li>
                    <li>Enable face recognition games and memory training</li>
                    <li>Facilitate caregiver access and support features</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">Communication</h4>
                  <ul className="list-disc list-inside text-muted-foreground ml-4 mt-1">
                    <li>Send account verification and security notifications</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Share important updates about the service</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold">Improvement and Analytics</h4>
                  <ul className="list-disc list-inside text-muted-foreground ml-4 mt-1">
                    <li>Analyze usage patterns to improve our services</li>
                    <li>Monitor system performance and identify issues</li>
                    <li>Develop new features based on user needs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Storage and Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Data Storage and Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Hosting:</strong> Your data is securely hosted on Replit's infrastructure, 
                  which provides enterprise-grade security measures including encryption at rest and in transit.
                </p>
                
                <p>
                  <strong>Security Measures:</strong>
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4">
                  <li>Password-protected accounts with secure authentication</li>
                  <li>Encrypted data transmission (HTTPS)</li>
                  <li>Regular security updates and monitoring</li>
                  <li>Limited access controls for our development team</li>
                </ul>
                
                <p>
                  <strong>Data Retention:</strong> We retain your personal information for as long as 
                  your account is active or as needed to provide services. We follow standard legal 
                  requirements for data retention and will securely delete information when no longer needed.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Third-Party Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>We may use trusted third-party services to enhance our application:</p>
                
                <div>
                  <h4 className="font-semibold">Email Services</h4>
                  <p className="text-muted-foreground">
                    For sending account verification emails, security notifications, and customer support communications.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Analytics Tools</h4>
                  <p className="text-muted-foreground">
                    To understand how users interact with our app and identify areas for improvement. 
                    We only collect aggregated, non-personally identifiable usage data.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Payment Processing</h4>
                  <p className="text-muted-foreground">
                    For secure processing of subscription payments. We do not store payment card information on our servers.
                  </p>
                </div>
                
                <p className="text-muted-foreground">
                  All third-party services we use are carefully vetted for security and privacy compliance.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>You have the following rights regarding your personal information:</p>
                
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                  <li><strong>Portability:</strong> Request your data in a portable format</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent for optional data processing</li>
                </ul>
                
                <p>
                  To exercise these rights, contact us at <strong>help@heyMemory.app</strong>. 
                  We will respond to your request within 30 days.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Age Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Age Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p>
                  heyMemory is designed for users who are at least 13 years old. If you are under 13, 
                  please do not use our services or provide any personal information. If we learn that 
                  we have collected personal information from a child under 13, we will delete that 
                  information as quickly as possible.
                </p>
                
                <p className="mt-3">
                  For users between 13-18 years old, we recommend parental guidance when using our services, 
                  especially given the memory and health-related nature of our application.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>When We Share Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>We do <strong>not</strong> sell, rent, or trade your personal information. We may share information only in these limited circumstances:</p>
                
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share specific information</li>
                  <li><strong>Emergency Situations:</strong> To protect your safety or the safety of others</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or legal process</li>
                  <li><strong>Service Providers:</strong> With trusted partners who help us operate our services (under strict confidentiality agreements)</li>
                </ul>
                
                <p>
                  We will always notify you if there are any changes to how we share your information.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our 
                  practices or for legal, operational, or regulatory reasons. We will notify you 
                  of any material changes by email or through the application.
                </p>
                
                <p className="mt-3">
                  Your continued use of heyMemory after any changes indicates your acceptance 
                  of the updated Privacy Policy.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, 
                  please don't hesitate to contact us:
                </p>
                
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>Email:</strong> help@heyMemory.app</p>
                  <p><strong>Mail:</strong></p>
                  <address className="not-italic ml-4">
                    Biltsite<br />
                    Attn: Privacy Officer<br />
                    Donklaan 79 bus 16<br />
                    9290 Berlare, Belgium
                  </address>
                </div>
                
                <p className="mt-4">
                  We are committed to resolving any privacy concerns promptly and transparently.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button variant="outline" asChild>
              <Link href="/cookie-policy">View Cookie Policy</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>

      <MainFooter />
    </div>
  );
}