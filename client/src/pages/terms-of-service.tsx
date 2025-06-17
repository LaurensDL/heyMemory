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

    return () => {
      // Cleanup on component unmount
      const existingMeta = document.querySelector('meta[name="robots"]');
      if (existingMeta) {
        document.head.removeChild(existingMeta);
      }
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainNavigation backTo={{ href: "/", label: "Back to Home", shortLabel: "Back" }} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last updated: June 17, 2025
          </p>
        </div>

        <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Important Medical Disclaimer
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  heyMemory is a digital tool designed to support memory and cognitive wellness. 
                  It is not a substitute for professional medical advice, diagnosis, or treatment. 
                  Always consult with qualified healthcare professionals regarding your health concerns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Section 1: Acceptance of Terms */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Scale className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
            </div>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                By accessing and using heyMemory ("the Service", "the App"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                These Terms of Service ("Terms") govern your use of our memory support application and related services operated by heyMemory ("we", "us", or "our").
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 2: Description of Service */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. Description of Service</h2>
            </div>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                heyMemory is an intelligent memory support application designed to empower users with cognitive challenges through adaptive, user-friendly digital tools. Our services include:
              </p>
              <ul>
                <li><strong>Memory Games:</strong> Interactive cognitive exercises including face recognition games</li>
                <li><strong>Remember Items:</strong> Personal memory aids for important information and reminders</li>
                <li><strong>Caregiver Tools:</strong> Features designed to assist caregivers in supporting their loved ones</li>
                <li><strong>Profile Management:</strong> Secure user accounts with personalized settings</li>
              </ul>
            </div>
          </section>

          <Separator />

          {/* Section 3: Medical Disclaimer */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. Medical Disclaimer</h2>
            </div>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  NOT A MEDICAL DEVICE OR TREATMENT
                </p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  heyMemory is not intended to diagnose, treat, cure, or prevent any medical condition or disease. 
                  The app is designed as a supportive tool for cognitive wellness and memory exercises.
                </p>
              </div>
              <p>
                <strong>Professional Medical Advice:</strong> Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or experienced through heyMemory.
              </p>
              <p>
                <strong>Emergency Situations:</strong> If you think you may have a medical emergency, call your doctor or emergency services immediately. heyMemory is not designed for emergency situations.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 4: User Responsibilities */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. User Responsibilities</h2>
            </div>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>By using heyMemory, you agree to:</p>
              <ul>
                <li>Provide accurate and complete information when creating your account</li>
                <li>Maintain the security of your password and accept responsibility for all activities under your account</li>
                <li>Use the service only for lawful purposes and in accordance with these Terms</li>
                <li>Not attempt to gain unauthorized access to any portion of the service</li>
                <li>Not use the service to transmit viruses, malware, or other harmful code</li>
                <li>Respect the privacy and rights of other users</li>
                <li>Not reverse engineer, decompile, or disassemble any part of the service</li>
              </ul>
            </div>
          </section>

          <Separator />

          {/* Section 5: Privacy and Data Protection */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">5. Privacy and Data Protection</h2>
            </div>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed by our{" "}
                <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Privacy Policy
                </Link>, which is incorporated into these Terms by reference.
              </p>
              <p>
                <strong>Sensitive Health Information:</strong> We understand that memory and cognitive data is particularly sensitive. We implement appropriate technical and organizational measures to protect your personal information.
              </p>
              <p>
                <strong>Data Retention:</strong> We retain your personal data only as long as necessary for the purposes outlined in our Privacy Policy or as required by law.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 6: Intellectual Property */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Scale className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">6. Intellectual Property</h2>
            </div>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                The heyMemory service and its original content, features, and functionality are and will remain the exclusive property of heyMemory and its licensors. The service is protected by copyright, trademark, and other laws.
              </p>
              <p>
                <strong>User Content:</strong> You retain ownership of any content you create or upload to the service. By using the service, you grant us a limited license to use, store, and process your content solely for the purpose of providing the service to you.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 7: Limitation of Liability */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">7. Limitation of Liability</h2>
            </div>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  IMPORTANT LIABILITY LIMITATIONS
                </p>
                <p className="text-red-700 dark:text-red-300">
                  Please read this section carefully as it limits our liability to you.
                </p>
              </div>
              <p>
                <strong>Service Provided "As Is":</strong> The service is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
              <p>
                <strong>No Medical Warranties:</strong> We do not warrant that the use of heyMemory will improve your memory, cognitive function, or health condition in any way.
              </p>
              <p>
                <strong>Limitation of Damages:</strong> In no event shall heyMemory be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 8: Service Availability */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">8. Service Availability</h2>
            </div>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We strive to maintain the availability of heyMemory, but we cannot guarantee uninterrupted access. The service may be unavailable due to:
              </p>
              <ul>
                <li>Scheduled maintenance and updates</li>
                <li>Technical difficulties or system failures</li>
                <li>Internet connectivity issues</li>
                <li>Force majeure events beyond our control</li>
              </ul>
              <p>
                We will make reasonable efforts to provide advance notice of scheduled maintenance when possible.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 9: Account Termination */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">9. Account Termination</h2>
            </div>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                <strong>Termination by You:</strong> You may terminate your account at any time by contacting us or using the account deletion feature in your profile settings.
              </p>
              <p>
                <strong>Termination by Us:</strong> We may terminate or suspend your account immediately, without prior notice, if you breach these Terms or engage in conduct that we determine to be harmful to other users or the service.
              </p>
              <p>
                <strong>Effect of Termination:</strong> Upon termination, your right to use the service will cease immediately. We may delete your account data in accordance with our data retention policies.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 10: Changes to Terms */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Scale className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">10. Changes to Terms</h2>
            </div>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p>
                Your continued use of the service after any such changes constitutes your acceptance of the new Terms. If you do not agree to the new Terms, you must stop using the service.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 11: Governing Law */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Scale className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">11. Governing Law</h2>
            </div>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which heyMemory operates, without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these Terms or your use of the service will be resolved through binding arbitration in accordance with the rules of the relevant arbitration association.
              </p>
            </div>
          </section>

          <Separator />

          {/* Section 12: Contact Information */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Smartphone className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">12. Contact Information</h2>
            </div>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul>
                <li>
                  Through our{" "}
                  <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                    contact form
                  </Link>
                </li>
                <li>By email: help@heyMemory.app</li>
              </ul>
            </div>
          </section>

          {/* Acknowledgment */}
          <Card className="mt-8 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Acknowledgment
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                By using heyMemory, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
                You also acknowledge that you have read and understood our Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <MainFooter />
    </div>
  );
}