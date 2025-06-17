import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X, Settings, Shield, BarChart3, Target, User } from "lucide-react";
import { useCookies, CookieCategories } from "@/hooks/useCookies";
import { useState } from "react";

export function CookieBanner() {
  const { showBanner, acceptAll, acceptNecessary, updateConsent, dismissBanner, consent } = useCookies();
  const [showSettings, setShowSettings] = useState(false);
  const [tempCategories, setTempCategories] = useState<CookieCategories>(consent.categories);

  if (!showBanner) return null;

  const handleSaveSettings = () => {
    updateConsent(tempCategories);
    setShowSettings(false);
  };

  const cookieTypes = [
    {
      key: 'necessary' as keyof CookieCategories,
      title: 'Necessary Cookies',
      description: 'Essential for the website to function properly. These cannot be disabled.',
      icon: Shield,
      required: true,
    },
    {
      key: 'preferences' as keyof CookieCategories,
      title: 'Preference Cookies',
      description: 'Remember your settings and preferences to provide a personalized experience.',
      icon: User,
      required: false,
    },
    {
      key: 'analytics' as keyof CookieCategories,
      title: 'Analytics Cookies',
      description: 'Help us understand how you use our website so we can improve it.',
      icon: BarChart3,
      required: false,
    },
    {
      key: 'marketing' as keyof CookieCategories,
      title: 'Marketing Cookies',
      description: 'Used to show you relevant content and advertisements.',
      icon: Target,
      required: false,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">We value your privacy</CardTitle>
              <CardDescription className="mt-1">
                We use cookies to enhance your experience, analyze site usage, and assist in marketing efforts. 
                You can customize your preferences or accept all cookies.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissBanner}
              className="ml-2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardFooter className="pt-0 gap-2 flex-wrap">
          <Button onClick={acceptNecessary} variant="outline" size="sm">
            Accept Necessary Only
          </Button>
          
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cookie Preferences</DialogTitle>
                <DialogDescription>
                  Choose which types of cookies you'd like to allow. You can change these settings at any time.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {cookieTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div key={type.key} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                          <div className="flex-1">
                            <Label 
                              htmlFor={type.key} 
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {type.title}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {type.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          id={type.key}
                          checked={tempCategories[type.key]}
                          disabled={type.required}
                          onCheckedChange={(checked) => 
                            setTempCategories(prev => ({ ...prev, [type.key]: checked }))
                          }
                        />
                      </div>
                      {type.key !== 'marketing' && <Separator />}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSettings}>
                  Save Preferences
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button onClick={acceptAll} size="sm" className="ml-auto">
            Accept All Cookies
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}