import { Link } from "wouter";
import { ArrowLeft, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MainNavigationProps {
  backTo?: {
    href: string;
    label: string;
    shortLabel?: string;
  };
}

export function MainNavigation({ backTo }: MainNavigationProps) {
  return (
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
          {backTo && (
            <div className="flex items-center">
              <Link href={backTo.href}>
                <Button variant="outline" className="touch-button bg-white text-black font-bold text-sm md:text-lg px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl border-2 border-gray-300 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-gray-400 transition-colors">
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">{backTo.label}</span>
                  <span className="sm:hidden">{backTo.shortLabel || "Back"}</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}