import { Link } from "wouter";
import { Brain, Shield, AlertTriangle, Users, Smartphone, Clock, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MainFooter } from "@/components/MainFooter";
import { MainNavigation } from "@/components/MainNavigation";
import { useEffect } from "react";

export default function TermsOfServicePage() {
  useEffect(() => {
    // Add noindex meta tag to prevent search engine indexing
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    // Add canonical URL
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = window.location.origin + '/terms-of-service';
    document.head.appendChild(canonicalLink);

    // Add language attribute to html element
    document.documentElement.lang = 'en';

    // Screen reader announcement for page load
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Terms of Service page loaded. Use headings navigation to browse content.';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" lang="en">
      <MainNavigation backTo={{ href: "/", label: "Back to Home", shortLabel: "Back" }} />

      {/* Invisible breadcrumb navigation for screen readers */}
      <nav aria-label="Breadcrumb navigation" className="sr-only">
        <ol>
          <li><Link href="/" aria-label="Navigate to homepage">Home</Link></li>
          <li aria-current="page">Terms of Service</li>
        </ol>
      </nav>

      {/* Main Content */}
      <main role="main" aria-labelledby="terms-heading" className="max-w-4xl mx-auto px-4 py-8 focus:outline-none" tabIndex={-1}>
        <header className="mb-8">
          <h1 id="terms-heading" className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-[clamp(1.5rem,4vw,4rem)] leading-tight">Terms of Service</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-[clamp(0.875rem,2.5vw,1.125rem)]" aria-live="polite">
            Last updated: <time dateTime="2025-06-17">June 17, 2025</time>
          </p>
        </header>

        <section className="space-y-6" aria-label="Terms of service content">
          <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" role="region" aria-labelledby="important-notice-heading">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" aria-hidden="true" />
                <div>
                  <h2 id="important-notice-heading" className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 text-[clamp(1rem,2.5vw,1.125rem)]">
                    Important Notice for Cognitive Health Users
                  </h2>
                  <p className="text-blue-800 dark:text-blue-200 text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
                    heyMemory is designed to support individuals with cognitive challenges. These terms have been written in clear, 
                    simple language. If you need assistance understanding any part of these terms, please contact us or ask a 
                    caregiver to help explain them to you.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acceptance */}
          <Card role="region" aria-labelledby="acceptance-heading">
            <CardContent className="p-6">
              <h2 id="acceptance-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center text-[clamp(1.125rem,3vw,1.25rem)]">
                <Scale className="w-5 h-5 mr-2" aria-hidden="true" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
                By using heyMemory, you agree to follow these rules. If you don't agree with these terms, please don't use our app.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
                These terms apply to everyone who uses heyMemory, including users with cognitive challenges and their caregivers.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card role="region" aria-labelledby="service-description-heading">
            <CardContent className="p-6">
              <h2 id="service-description-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center text-[clamp(1.125rem,3vw,1.25rem)]">
                <Brain className="w-5 h-5 mr-2" aria-hidden="true" />
                2. What heyMemory Does
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
                heyMemory helps you practice remembering faces and important information. Our app includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 text-[clamp(0.875rem,2.5vw,1rem)]" aria-labelledby="service-description-heading">
                <li>A faces game to help you recognize family and friends</li>
                <li>A place to store important reminders and notes</li>
                <li>Tools to help caregivers support you</li>
                <li>Secure storage of your personal information</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card role="region" aria-labelledby="user-responsibilities-heading">
            <CardContent className="p-6">
              <h2 id="user-responsibilities-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center text-[clamp(1.125rem,3vw,1.25rem)]">
                <Users className="w-5 h-5 mr-2" aria-hidden="true" />
                3. Your Responsibilities
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
                When you use heyMemory, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 text-[clamp(0.875rem,2.5vw,1rem)]" aria-labelledby="user-responsibilities-heading">
                <li>Provide true and accurate information</li>
                <li>Keep your password safe and don't share it with others</li>
                <li>Use the app only for its intended purpose</li>
                <li>Be respectful to our support team</li>
                <li>Not try to break or damage the app</li>
                <li>Follow all applicable laws</li>
              </ul>
            </CardContent>
          </Card>

          {/* Privacy and Data */}
          <Card role="region" aria-labelledby="privacy-data-heading">
            <CardContent className="p-6">
              <h2 id="privacy-data-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center text-[clamp(1.125rem,3vw,1.25rem)]">
                <Shield className="w-5 h-5 mr-2" aria-hidden="true" />
                4. Your Privacy and Data
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
                We take your privacy seriously. Here's what you should know:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 text-[clamp(0.875rem,2.5vw,1rem)]" aria-labelledby="privacy-data-heading">
                <li>Your photos and memories are stored securely</li>
                <li>We don't sell your personal information</li>
                <li>You can delete your account and data at any time</li>
                <li>Caregivers you authorize can access your information to help you</li>
                <li>Read our <Link href="/privacy-policy" 
                    className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label="Navigate to Privacy Policy page">Privacy Policy</Link> for complete details</li>
              </ul>
            </CardContent>
          </Card>

          {/* Medical Disclaimer */}
          <Card role="region" aria-labelledby="medical-disclaimer-heading">
            <CardContent className="p-6">
              <h2 id="medical-disclaimer-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center text-[clamp(1.125rem,3vw,1.25rem)]">
                <Smartphone className="w-5 h-5 mr-2" aria-hidden="true" />
                5. Important Medical Information
              </h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
                  ⚠️ heyMemory is NOT a medical device or treatment. It's a memory support tool.
                </p>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 text-[clamp(0.875rem,2.5vw,1rem)]" aria-labelledby="medical-disclaimer-heading">
                <li>Always follow your doctor's advice</li>
                <li>Don't use heyMemory instead of medical care</li>
                <li>If you have medical emergencies, call emergency services</li>
                <li>We are not responsible for medical decisions based on our app</li>
              </ul>
            </CardContent>
          </Card>

          {/* Limitations */}
          <Card role="region" aria-labelledby="limitations-heading">
            <CardContent className="p-6">
              <h2 id="limitations-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center text-[clamp(1.125rem,3vw,1.25rem)]">
                <AlertTriangle className="w-5 h-5 mr-2" aria-hidden="true" />
                6. What We're Not Responsible For
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
                While we work hard to make heyMemory helpful and reliable, we can't guarantee everything will always work perfectly:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 text-[clamp(0.875rem,2.5vw,1rem)]" aria-labelledby="limitations-heading">
                <li>Technical problems or app downtime</li>
                <li>Lost data (though we try our best to prevent this)</li>
                <li>How well the memory exercises work for you</li>
                <li>Problems caused by your device or internet connection</li>
              </ul>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card role="region" aria-labelledby="termination-heading">
            <CardContent className="p-6">
              <h2 id="termination-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center text-[clamp(1.125rem,3vw,1.25rem)]">
                <Clock className="w-5 h-5 mr-2" aria-hidden="true" />
                7. Ending Your Account
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
                You can stop using heyMemory anytime:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 text-[clamp(0.875rem,2.5vw,1rem)]" aria-labelledby="termination-heading">
                <li>You can delete your account in your profile settings</li>
                <li>We may close accounts that break these rules</li>
                <li>If we close your account, we'll try to tell you why</li>
                <li>Your data will be deleted according to our Privacy Policy</li>
              </ul>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card role="region" aria-labelledby="changes-heading">
            <CardContent className="p-6">
              <h2 id="changes-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-[clamp(1.125rem,3vw,1.25rem)]">
                8. Changes to These Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
                Sometimes we need to update these terms. When we do, we'll let you know by email and show the changes 
                in the app. If you keep using heyMemory after we make changes, it means you agree to the new terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card role="region" aria-labelledby="contact-info-heading">
            <CardContent className="p-6">
              <h2 id="contact-info-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-[clamp(1.125rem,3vw,1.25rem)]">
                9. Questions or Problems?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
                If you have questions about these terms or need help with heyMemory, please contact us:
              </p>
              <div className="space-y-2 text-[clamp(0.875rem,2.5vw,1rem)]">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> <Link href="mailto:help@heyMemory.app" 
                    className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label="Send email to heyMemory support">help@heyMemory.app</Link>
                </p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Company:</strong> Biltsite</p>
                <address className="text-gray-700 dark:text-gray-300 not-italic">
                  <strong>Address:</strong><br />
                  Donklaan 79 bus 16<br />
                  9290 Berlare, Belgium
                </address>
              </div>
            </CardContent>
          </Card>

          {/* Acknowledgment */}
          <Card className="mt-8 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" role="region" aria-labelledby="acknowledgment-heading">
            <CardContent className="p-6">
              <h2 id="acknowledgment-heading" className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-[clamp(1rem,2.5vw,1.125rem)]">
                Acknowledgment
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
                By using heyMemory, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
                You also acknowledge that you have read and understood our Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <MainFooter />
    </div>
  );
}