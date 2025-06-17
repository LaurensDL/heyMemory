import { Link } from "wouter";
import { ArrowLeft, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MainNavigationProps {
  backTo?: {
    href: string;
    label: string;
    shortLabel?: string;
  };
  showJoinButton?: boolean;
}

export function MainNavigation({ backTo, showJoinButton = false }: MainNavigationProps) {
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
          <div className="flex items-center">
            {backTo && (
              <Link href={backTo.href}>
                <Button variant="outline" className="touch-button bg-white text-black font-bold text-sm md:text-lg px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl border-2 border-gray-300 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-gray-400 transition-colors">
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">{backTo.label}</span>
                  <span className="sm:hidden">{backTo.shortLabel || "Back"}</span>
                </Button>
              </Link>
            )}
            
            {showJoinButton && (
              <>
                {/* Mobile Join Button */}
                <Link href="/register" className="md:hidden">
                  <Button className="touch-button bg-blue-600 text-white font-bold text-base px-4 py-2 rounded-lg hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors">
                    Join
                  </Button>
                </Link>
                
                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center space-x-6">
                  <Link href="/register">
                    <button className="text-body font-bold hover:text-[var(--button-primary)] focus:text-[var(--button-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] focus:ring-offset-2 rounded px-4 py-2">
                      Join
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="text-body font-bold hover:text-[var(--button-primary)] focus:text-[var(--button-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] focus:ring-offset-2 rounded px-4 py-2">
                      Contact
                    </button>
                  </Link>
                  
                  {/* Accessibility Indicator - Desktop only */}
                  <div className="flex items-center bg-green-100 border-2 border-green-200 rounded-lg px-3 py-2">
                    <span className="text-xl font-black text-green-700 mr-2">A+</span>
                    <span className="text-base font-bold text-green-700">Accessible</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}