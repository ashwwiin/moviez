"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) router.replace("/dashboard");
      } catch (err) {}
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();
      if (!res.ok) setMessage(data.error || "Login failed");
      else router.replace("/dashboard"); // redirect after login
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <img src="/moviez2.png" alt="Moviez Logo" width={60} height={60} />
        </div>
      </header>

      <div className="absolute top-0 left-0 w-full h-full">
        <img
          src="/bgimage1.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
      </div>

      <div className="relative z-10 bg-black/70 p-8 rounded-lg shadow-lg w-full max-w-md animate-slideIn">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Sign In</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
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

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              id="rememberMe"
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-white text-sm">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-red-600 hover:bg-red-700 transition duration-300 rounded text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {message && <p className="text-center text-white mt-4">{message}</p>}

        <p className="text-sm text-gray-400 mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-red-500 hover:underline">
            Sign Up
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
