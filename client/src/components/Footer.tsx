import { Brain, Mail, Heart } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t-4 border-gray-300 mt-16">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="text-center space-y-8">
          {/* Logo and Brand */}
          <div className="flex items-center justify-center space-x-4">
            <Brain className="text-[var(--button-primary)] w-10 h-10" />
            <span className="text-3xl font-bold text-black">heyMemory</span>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center justify-center space-x-8">
            <Link href="/dashboard">
              <button className="text-xl font-bold text-black hover:text-[var(--button-primary)] focus:text-[var(--button-primary)] focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-xl px-6 py-3 transition-colors">
                Dashboard
              </button>
            </Link>
            
            <Link href="/contact">
              <button className="text-xl font-bold text-black hover:text-[var(--button-primary)] focus:text-[var(--button-primary)] focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-xl px-6 py-3 transition-colors">
                <Mail className="w-6 h-6 mr-2 inline" />
                Contact Us
              </button>
            </Link>
          </div>
          
          {/* Support Info */}
          <div className="space-y-4">
            <p className="text-xl text-gray-700">
              Designed for people with Alzheimer's and memory challenges
            </p>
            <p className="text-lg text-gray-600">
              For support: <a href="mailto:help@heymemory.app" className="text-[var(--button-primary)] font-bold hover:underline focus:underline focus:outline-none">help@heymemory.app</a>
            </p>
          </div>
          
          {/* Copyright */}
          <div className="pt-8 border-t-2 border-gray-200">
            <p className="text-lg text-gray-600">
              © 2025 heyMemory. Accessible memory support for everyone.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}