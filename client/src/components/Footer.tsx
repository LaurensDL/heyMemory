import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">heyMemory</h3>
            <p className="text-xs text-muted-foreground">
              Supporting memory and cognitive wellness through accessible technology.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Features</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/faces-game" className="text-muted-foreground hover:text-foreground">
                  Faces Game
                </Link>
              </li>
              <li>
                <Link href="/remember" className="text-muted-foreground hover:text-foreground">
                  Memory Items
                </Link>
              </li>
              <li>
                <Link href="/caregiver" className="text-muted-foreground hover:text-foreground">
                  Caregiver Tools
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Account</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-foreground">
                  Account Settings
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p className="text-xs text-muted-foreground">
            © 2025 heyMemory. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <Link href="/terms-of-service" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy-policy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/cookie-policy" className="hover:text-foreground">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}