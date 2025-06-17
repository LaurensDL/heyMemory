import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Mail, Shield, Eye, Database, Users, Clock } from "lucide-react";
import { Link } from "wouter";
import { MainFooter } from "@/components/MainFooter";
import { MainNavigation } from "@/components/MainNavigation";
import { useEffect } from "react";

export default function PrivacyPolicyPage() {
  useEffect(() => {
    // Add noindex meta tag to prevent search engine indexing
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    // Add canonical URL
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = window.location.origin + '/privacy-policy';
    document.head.appendChild(canonicalLink);

    // Add language attribute to html element
    document.documentElement.lang = 'en';

    // Screen reader announcement for page load
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Privacy Policy page loaded. Use headings navigation to browse content.';
    document.body.appendChild(announcement);

    // Remove announcement after screen readers have time to read it
    const announcementTimer = setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);

    return () => {
      // Cleanup on component unmount
      const existingMeta = document.querySelector('meta[name="robots"]');
      if (existingMeta) {
        document.head.removeChild(existingMeta);
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

  return (
    <div className="min-h-screen bg-gray-50" lang="en">
      <MainNavigation backTo={{ href: "/", label: "Back to Home", shortLabel: "Back" }} />

      {/* Invisible breadcrumb navigation for screen readers */}
      <nav aria-label="Breadcrumb navigation" className="sr-only">
        <ol>
          <li><Link href="/" aria-label="Navigate to homepage">Home</Link></li>
          <li aria-current="page">Privacy Policy</li>
        </ol>
      </nav>

      <main role="main" aria-labelledby="privacy-policy-heading" className="container mx-auto px-4 py-8 max-w-4xl focus:outline-none" tabIndex={-1}>
        <header className="mb-6">
          <h1 id="privacy-policy-heading" className="text-3xl font-bold mb-2 text-[clamp(1.5rem,4vw,3rem)] leading-tight">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-[clamp(0.875rem,2.5vw,1rem)]" aria-live="polite">
            Last updated: <time dateTime={new Date().toISOString().split('T')[0]}>{new Date().toLocaleDateString()}</time>
          </p>
        </header>

        <section className="space-y-6" aria-label="Privacy policy content">
          {/* Introduction */}
          <Card role="region" aria-labelledby="commitment-heading">
            <CardHeader>
              <CardTitle id="commitment-heading" className="flex items-center gap-2 text-[clamp(1.125rem,3vw,1.5rem)]">
                <Shield className="h-5 w-5" aria-hidden="true" />
                Our Commitment to Your Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed mb-4">
                At heyMemory, we understand that privacy is especially important when dealing with 
                personal memories and health-related information. This Privacy Policy explains how 
                Biltsite ("we," "our," or "us") collects, uses, protects, and shares your personal 
                information when you use the heyMemory application.
              </p>
              <div className="text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed" aria-label="Company contact information">
                <strong>Company Information:</strong><br />
                Biltsite<br />
                Founder: Laurens De Leeuw<br />
                Address: Donklaan 79 bus 16, 9290 Berlare, Belgium<br />
                Contact: <Link href="mailto:help@heyMemory.app" 
                              className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                              aria-label="Send email to heyMemory support">help@heyMemory.app</Link>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card role="region" aria-labelledby="information-collect-heading">
            <CardHeader>
              <CardTitle id="information-collect-heading" className="flex items-center gap-2 text-[clamp(1.125rem,3vw,1.5rem)]">
                <Database className="h-5 w-5" aria-hidden="true" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 id="personal-info-heading" className="font-semibold mb-2 text-[clamp(1rem,2.5vw,1.25rem)]">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-[clamp(0.875rem,2.5vw,1rem)] text-muted-foreground ml-4" 
                    aria-labelledby="personal-info-heading">
                  <li>Email address (for account creation and communication)</li>
                  <li>First and last name</li>
                  <li>Date of birth (to provide age-appropriate features)</li>
                  <li>Address information (city, state, zip code, country)</li>
                  <li>Caregiver phone number (for emergency contact purposes)</li>
                </ul>
              </div>

              <div>
                <h3 id="memory-data-heading" className="font-semibold mb-2 text-[clamp(1rem,2.5vw,1.25rem)]">Memory and Application Data</h3>
                <ul className="list-disc list-inside space-y-1 text-[clamp(0.875rem,2.5vw,1rem)] text-muted-foreground ml-4"
                    aria-labelledby="memory-data-heading">
                  <li>Photos and images you upload for memory exercises</li>
                  <li>Names and descriptions of people in your photos</li>
                  <li>Remember items (notes, reminders, and important information)</li>
                  <li>Game progress and interaction data</li>
                  <li>Usage patterns and preferences</li>
                </ul>
              </div>

              <div>
                <h3 id="technical-data-heading" className="font-semibold mb-2 text-[clamp(1rem,2.5vw,1.25rem)]">Technical Information</h3>
                <ul className="list-disc list-inside space-y-1 text-[clamp(0.875rem,2.5vw,1rem)] text-muted-foreground ml-4"
                    aria-labelledby="technical-data-heading">
                  <li>Device information (type, operating system, browser)</li>
                  <li>IP address and location data (for security and functionality)</li>
                  <li>Log files and usage analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card role="region" aria-labelledby="how-we-use-heading">
            <CardHeader>
              <CardTitle id="how-we-use-heading" className="flex items-center gap-2 text-[clamp(1.125rem,3vw,1.5rem)]">
                <Eye className="h-5 w-5" aria-hidden="true" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-[clamp(0.875rem,2.5vw,1rem)]" aria-labelledby="how-we-use-heading">
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">•</span>
                  <span><strong>Provide Services:</strong> Deliver memory training exercises, store your data securely, and maintain your account</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">•</span>
                  <span><strong>Improve Experience:</strong> Personalize content, analyze usage patterns, and enhance our features</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">•</span>
                  <span><strong>Communication:</strong> Send important updates, security alerts, and support responses</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">•</span>
                  <span><strong>Safety & Security:</strong> Protect against fraud, ensure data security, and comply with legal requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">•</span>
                  <span><strong>Emergency Contact:</strong> Contact caregivers when necessary for safety purposes</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card role="region" aria-labelledby="data-sharing-heading">
            <CardHeader>
              <CardTitle id="data-sharing-heading" className="flex items-center gap-2 text-[clamp(1.125rem,3vw,1.5rem)]">
                <Users className="h-5 w-5" aria-hidden="true" />
                How We Share Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-[clamp(0.875rem,2.5vw,1rem)] font-medium text-blue-900">
                  We do not sell, rent, or trade your personal information to third parties for commercial purposes.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-[clamp(1rem,2.5vw,1.25rem)]">Limited Sharing Occurs Only For:</h3>
                <ul className="space-y-2 text-[clamp(0.875rem,2.5vw,1rem)]">
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-600">•</span>
                    <span><strong>Service Providers:</strong> Trusted partners who help us operate the service (hosting, analytics, customer support)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-600">•</span>
                    <span><strong>Legal Requirements:</strong> When required by law, court order, or to protect safety</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-600">•</span>
                    <span><strong>Emergency Situations:</strong> Contacting designated caregivers in health or safety emergencies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-600">•</span>
                    <span><strong>Business Transfers:</strong> In the event of a merger or acquisition (with continued privacy protection)</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card role="region" aria-labelledby="data-security-heading">
            <CardHeader>
              <CardTitle id="data-security-heading" className="flex items-center gap-2 text-[clamp(1.125rem,3vw,1.5rem)]">
                <Shield className="h-5 w-5" aria-hidden="true" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed mb-4">
                We implement industry-standard security measures to protect your sensitive information:
              </p>
              <ul className="space-y-2 text-[clamp(0.875rem,2.5vw,1rem)]">
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Encryption of data in transit and at rest</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Secure server infrastructure with regular security updates</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Limited access controls - only authorized personnel can access your data</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Regular security audits and vulnerability assessments</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Secure password storage using industry-standard hashing</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card role="region" aria-labelledby="your-rights-heading">
            <CardHeader>
              <CardTitle id="your-rights-heading" className="flex items-center gap-2 text-[clamp(1.125rem,3vw,1.5rem)]">
                <Eye className="h-5 w-5" aria-hidden="true" />
                Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed mb-4">
                You have several rights regarding your personal information:
              </p>
              <ul className="space-y-2 text-[clamp(0.875rem,2.5vw,1rem)]">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">•</span>
                  <span><strong>Access:</strong> Request a copy of your personal data</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">•</span>
                  <span><strong>Correction:</strong> Update or correct inaccurate information</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">•</span>
                  <span><strong>Deletion:</strong> Request deletion of your account and associated data</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">•</span>
                  <span><strong>Portability:</strong> Export your data in a readable format</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">•</span>
                  <span><strong>Opt-out:</strong> Unsubscribe from marketing communications</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card role="region" aria-labelledby="data-retention-heading">
            <CardHeader>
              <CardTitle id="data-retention-heading" className="flex items-center gap-2 text-[clamp(1.125rem,3vw,1.5rem)]">
                <Clock className="h-5 w-5" aria-hidden="true" />
                Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-[clamp(0.875rem,2.5vw,1rem)]">
                <li className="flex items-start">
                  <span className="mr-2 text-gray-600">•</span>
                  <span><strong>Active Accounts:</strong> We retain your data while your account is active and you're using our services</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-gray-600">•</span>
                  <span><strong>Inactive Accounts:</strong> Data is retained for 2 years after last login, then permanently deleted</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-gray-600">•</span>
                  <span><strong>Deleted Accounts:</strong> When you delete your account, most data is removed within 30 days</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-gray-600">•</span>
                  <span><strong>Legal Requirements:</strong> Some data may be retained longer if required by law</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card role="region" aria-labelledby="contact-info-heading">
            <CardHeader>
              <CardTitle id="contact-info-heading" className="flex items-center gap-2 text-[clamp(1.125rem,3vw,1.5rem)]">
                <Mail className="h-5 w-5" aria-hidden="true" />
                Contact Us About Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed mb-4">
                If you have questions about this Privacy Policy or want to exercise your privacy rights, please contact us:
              </p>
              
              <div className="space-y-2 text-[clamp(0.875rem,2.5vw,1rem)]">
                <p><strong>Email:</strong> <Link href="mailto:help@heyMemory.app" 
                    className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label="Send email to heyMemory support">help@heyMemory.app</Link></p>
                <p><strong>Mail:</strong></p>
                <address className="not-italic ml-4">
                  Biltsite<br />
                  Attn: Privacy Officer<br />
                  Donklaan 79 bus 16<br />
                  9290 Berlare, Belgium
                </address>
              </div>
              
              <p className="mt-4 text-[clamp(0.875rem,2.5vw,1rem)]">
                We are committed to resolving any privacy concerns promptly and transparently.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button variant="outline" asChild 
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Navigate to Cookie Policy page">
              <Link href="/cookie-policy">View Cookie Policy</Link>
            </Button>
            <Button variant="outline" asChild
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Navigate to Contact Us page">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
}