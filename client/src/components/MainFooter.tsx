import { Link } from "wouter";
import { Brain } from "lucide-react";

export function MainFooter() {
  return (
    <footer className="bg-gray-50 border-t-2 border-gray-200 py-12" role="contentinfo">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <Link href="/">
            <div className="flex items-center justify-center space-x-3 mb-6 cursor-pointer hover:opacity-80 transition-opacity">
              <Brain className="text-[var(--button-primary)] w-8 h-8" aria-hidden="true" />
              <span className="text-2xl font-bold">heyMemory</span>
            </div>
          </Link>
          
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
            <p className="text-body">© {new Date().getFullYear()} heyMemory. Designed with care for memory support.</p>
            <p className="text-sm text-gray-600">
              Developed with <svg className="inline-block w-4 h-4 mx-1 align-middle" viewBox="0 0 24 24" fill="#ef4444" xmlns="http://www.w3.org/2000/svg" aria-label="love"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> by{" "}
              <a 
                href="https://biltsite.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[var(--button-primary)] underline transition-colors"
              >
                Biltsite
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}