"use client";

import Image from "next/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Footer from "../../components/Footer";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  // Redirect if logged in and prevent back to landing page
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => {
        if (res.ok) {
          router.replace("/dashboard"); // Redirect logged-in users to dashboard
        }
      })
      .catch(() => {});

    // Prevent back navigation to previous pages after logout
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.go(1); // stay on landing page if back is pressed
    };
  }, [router]);

  return (
    <div className="relative w-full bg-black">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full">
        <img
          src="/bgimage1.jpg"
          alt="Landing Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <Image src="/moviez2.png" alt="Moviez Logo" width={60} height={60} />
        </div>
        <nav>
          <Link
            href="/signin"
            className="px-3 py-1.5 bg-red-600/80 rounded hover:bg-red-700/90 transition-all duration-300 text-white font-semibold text-sm shadow-lg hover:scale-105"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fadeIn drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">
          Unlimited Movies, TV Shows, and More.
        </h1>
        <Link
          href="/signup"
          className="px-6 py-2 bg-red-600/90 rounded text-white font-semibold text-sm hover:bg-red-700/100 transition-all duration-300 shadow-lg hover:scale-110 animate-fadeIn delay-400 hover:shadow-[0_0_20px_rgba(255,0,0,0.8)] focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Get Started
        </Link>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
