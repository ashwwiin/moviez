"use client";

import Link from "next/link";
import { useState } from "react";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName, // map fullName → name
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) setMessage(data.error || "Signup failed");
      else {
        setMessage(
          "✅ Signup successful! Your account is pending admin approval."
        );
        setFullName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center font-sans text-white selection:bg-red-500/30">
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 sm:px-12 py-6 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center">
          <Link href="/">
            <img src="/moviez2.png" alt="Moviez Logo" width={55} height={55} className="drop-shadow-2xl hover:scale-105 transition-transform" />
          </Link>
        </div>
      </header>

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

      <div className="relative z-10 bg-black/60 backdrop-blur-xl border border-white/10 p-10 sm:p-12 rounded-3xl shadow-2xl w-full max-w-md animate-slideIn mt-20">
        <h1 className="text-4xl font-black mb-8 text-center text-white tracking-tight">
          Sign Up
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all"
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-7-11-7a19.607 19.607 0 014.118-5.644M6.706 6.706A9.955 9.955 0 0112 5c7 0 11 7 11 7a19.597 19.597 0 01-2.586 3.293M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full mt-4 py-4 bg-red-600 hover:bg-red-500 transition-all duration-300 rounded-xl text-white font-black text-lg shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] active:scale-95"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {message && <p className="text-center text-white mt-4">{message}</p>}

        <p className="text-sm text-neutral-400 mt-6 text-center font-medium">
          Already have an account?{" "}
          <Link href="/signin" className="text-white font-bold hover:text-red-500 hover:underline transition-colors">
            Sign In.
          </Link>
        </p>
      </div>

      <style jsx>{`
        .animate-slideIn {
          animation: slideIn 0.7s ease forwards;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
