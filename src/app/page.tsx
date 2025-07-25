"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-navy-gradient">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-100 mb-6">
            Road to 1%
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Transform your trucking career with data-driven assessments and
            personalized guidance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-2xl text-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all hover:shadow-lg flex items-center justify-center"
            >
              Start Your Assessment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="border-2 border-gray-600 text-gray-300 px-8 py-3 rounded-2xl text-lg font-semibold hover:border-gray-500 hover:text-white transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2025{" "}
            <a
              href="https://letstrucktribe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors"
            >
              Letstrucktribe.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
