import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Shield, BarChart3, Target, User, ArrowLeft, Settings, Brain } from "lucide-react";
import { useCookies, CookieCategories } from "@/hooks/useCookies";
import { useState } from "react";
import { Link } from "wouter";
import { MainFooter } from "@/components/MainFooter";
import { MainNavigation } from "@/components/MainNavigation";

export default function CookiePolicyPage() {
  const { consent, updateConsent, resetConsent } = useCookies();
  const [categories, setCategories] = useState<CookieCategories>(consent.categories);
  const [hasChanges, setHasChanges] = useState(false);

  const handleCategoryChange = (key: keyof CookieCategories, value: boolean) => {
    if (key === 'necessary') return; // Cannot change necessary cookies
    
    const newCategories = { ...categories, [key]: value };
    setCategories(newCategories);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    updateConsent(categories);
    setHasChanges(false);
  };

  const handleResetConsent = () => {
    resetConsent();
    setCategories({ necessary: true, analytics: false, marketing: false, preferences: false });
    setHasChanges(false);
  };

  const cookieTypes = [
    {
      key: 'necessary' as keyof CookieCategories,
      title: 'Necessary Cookies',
      description: 'These cookies are essential for the website to function properly and cannot be disabled.',
      icon: Shield,
      required: true,
      examples: [
        'Authentication tokens to keep you logged in',
        'Session data for form security',
        'Essential site preferences and settings',
        'Security cookies to prevent fraud'
      ]
    },
    {
      key: 'preferences' as keyof CookieCategories,
      title: 'Preference Cookies',
      description: 'These cookies remember your choices and settings to provide a personalized experience.',
      icon: User,
      required: false,
      examples: [
        'Language and region preferences',
        'Theme and display settings',
        'Accessibility options',
        'Personalized content preferences'
      ]
    },
    {
      key: 'analytics' as keyof CookieCategories,
      title: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors use our website so we can improve it.',
      icon: BarChart3,
      required: false,
      examples: [
        'Page views and user interactions',
        'Time spent on different pages',
        'Popular features and content',
        'Error tracking and performance monitoring'
      ]
    },
    {
      key: 'marketing' as keyof CookieCategories,
      title: 'Marketing Cookies',
      description: 'These cookies are used to show you relevant content and advertisements.',
      icon: Target,
      required: false,
      examples: [
        'Advertising preferences and targeting',
        'Social media integration',
        'Email marketing effectiveness',
        'Cross-platform advertising tracking'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation backTo={{ href: "/", label: "Back to Home", shortLabel: "Back" }} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
          <p className="text-muted-foreground">
            Learn about how we use cookies and manage your preferences
          </p>
        </div>

        {/* Cookie Consent Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Your Cookie Preferences
            </CardTitle>
            <CardDescription>
              {consent.hasConsented 
                ? `Last updated: ${new Date(consent.consentDate).toLocaleDateString()}`
                : 'You have not provided cookie consent yet'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cookieTypes.map((type) => {
                const Icon = type.icon;
                const isEnabled = categories[type.key];
                
                return (
                  <div key={type.key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-3 flex-1">
                      <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Label className="text-sm font-medium">{type.title}</Label>
                          {type.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      disabled={type.required}
                      onCheckedChange={(value) => handleCategoryChange(type.key, value)}
                    />
                  </div>
                );
              })}
            </div>
            
            {hasChanges && (
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button onClick={handleSaveChanges}>Save Changes</Button>
                <Button variant="outline" onClick={() => {
                  setCategories(consent.categories);
                  setHasChanges(false);
                }}>
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Cookie Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What are cookies?</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                Cookies are small text files that are stored on your device when you visit a website. 
                They help websites remember information about your visit, which can make your next visit 
                easier and the site more useful to you.
              </p>
              <p>
                We use cookies to enhance your experience on heyMemory, analyze site usage, 
                and provide personalized content that helps support your memory journey.
              </p>
            </CardContent>
          </Card>

          {cookieTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card key={type.key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {type.title}
                    {type.required && <Badge variant="secondary">Required</Badge>}
                  </CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-medium mb-2">Examples include:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {type.examples.map((example, index) => (
                        <li key={index}>{example}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card>
            <CardHeader>
              <CardTitle>Managing your cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You can manage your cookie preferences at any time by:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>Using the preference controls above</li>
                <li>Adjusting your browser settings to block or delete cookies</li>
                <li>Visiting this page to update your choices</li>
              </ul>
              
              <Separator />
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleResetConsent}>
                  Reset All Preferences
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questions about cookies?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about our use of cookies or this cookie policy, 
                please don't hesitate to contact us. We're here to help you understand 
                how we protect your privacy while providing the best possible experience.
              </p>
              <Button variant="outline" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <MainFooter />
    </div>
  );
}