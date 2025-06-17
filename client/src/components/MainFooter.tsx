import { Link } from "wouter";
import { Brain } from "lucide-react";

export function MainFooter() {
  return (
    <footer className="bg-gray-50 border-t-2 border-gray-200 py-12" role="contentinfo">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Brain className="text-[var(--button-primary)] w-8 h-8" aria-hidden="true" />
            <span className="text-2xl font-bold">heyMemory</span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
            <Link href="/privacy-policy">
              <button className="text-body font-bold hover:text-[var(--button-primary)] focus:text-[var(--button-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] focus:ring-offset-2 rounded px-4 py-2">
                Privacy Policy
              </button>
            </Link>
            <Link href="/cookie-policy">
              <button className="text-body font-bold hover:text-[var(--button-primary)] focus:text-[var(--button-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] focus:ring-offset-2 rounded px-4 py-2">
                Cookie Policy
              </button>
            </Link>
            <Link href="/terms-of-service">
              <button className="text-body font-bold hover:text-[var(--button-primary)] focus:text-[var(--button-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] focus:ring-offset-2 rounded px-4 py-2">
                Terms of Service
              </button>
            </Link>
          </div>
          
          <div className="space-y-2">
            <p className="text-body">© 2025 heyMemory. Designed with care for memory support.</p>
            <p className="text-sm text-gray-600">A project by BILTSITE ™ Web & App Development.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}