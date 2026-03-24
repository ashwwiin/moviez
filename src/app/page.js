"use client";

import Image from "next/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Footer from "../../components/Footer";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle, Film, MonitorPlay, Download, ChevronRight } from "lucide-react";

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
  }, [router]);

  return (
    <div className="w-full min-h-screen font-sans selection:bg-red-500/30 text-white">
      {/* Cinematic Background */}
      <div className="fixed top-0 left-0 w-full h-screen bg-black z-0 overflow-hidden">
        <img
          src="/bgimage1.jpg"
          alt="Landing Background"
          className="w-full h-full object-cover opacity-40 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90" />
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-black via-transparent to-transparent opacity-90" />
      </div>


      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 sm:px-12 py-6 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center">
          <Image src="/moviez2.png" alt="Moviez Logo" width={55} height={55} className="drop-shadow-2xl hover:scale-105 transition-transform" />
        </div>
        <nav>
          <Link
            href="/signin"
            className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300 font-bold text-sm shadow-lg tracking-wide"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 max-w-6xl mx-auto pt-24 pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-black tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(239,68,68,0.15)] opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
          <PlayCircle size={15} /> The Next Evolution of Cinema
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white mb-6 tracking-tighter leading-[1.1] drop-shadow-2xl max-w-5xl opacity-0 animate-[fadeIn_0.7s_ease-out_0.2s_forwards]">
          Unlimited Movies, <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-red-400">
            TV Shows, & More.
          </span>
        </h1>
        
        <p className="text-lg md:text-2xl text-neutral-300 mb-12 max-w-2xl font-medium opacity-0 animate-[fadeIn_0.7s_ease-out_0.4s_forwards]">
          Watch anywhere. Cancel anytime. Experience cinema-grade entertainment on your terms.
        </p>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl opacity-0 animate-[fadeIn_0.7s_ease-out_0.6s_forwards]">
          <input 
            type="email" 
            placeholder="Email address"
            className="flex-1 px-6 py-4 rounded-xl sm:rounded-l-xl sm:rounded-r-none bg-black/60 backdrop-blur-xl border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/50 focus:bg-white/5 transition-all text-lg"
          />
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-red-600 rounded-xl sm:rounded-r-xl sm:rounded-l-none text-white font-black text-lg hover:bg-red-500 transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] active:scale-95 group"
          >
            Start Watching <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full opacity-0 animate-[fadeIn_0.7s_ease-out_0.8s_forwards]">
          {[
            { icon: Film, title: "4K HDR Streaming", desc: "Experience unrivaled picture and sound quality." },
            { icon: MonitorPlay, title: "Watch Everywhere", desc: "Stream seamlessly on your TV, phone, tablet, and laptop." },
            { icon: Download, title: "Offline Viewing", desc: "Download your favorites and watch without the internet." }
          ].map((feat, i) => (
            <div key={i} className="flex flex-col items-center text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all group hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 group-hover:scale-110 group-hover:bg-red-500/20 transition-all">
                <feat.icon className="text-red-500" size={28} />
              </div>
              <h3 className="text-white font-black text-xl mb-3 tracking-tight">{feat.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-medium">{feat.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/5 bg-black/50 backdrop-blur-xl">
        <Footer />
      </div>
    </div>
  );
}
