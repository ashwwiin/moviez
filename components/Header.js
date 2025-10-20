"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Settings, LogOut } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle sign out
  const handleSignOut = async () => {
    setDropdownOpen(false);
    try {
      const res = await fetch("/api/auth/signout", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        router.replace("/");
      } else {
        console.error("Sign out failed with status:", res.status);
        // Still redirect even if API fails
        router.replace("/");
      }
    } catch (err) {
      console.error("Sign out failed:", err);
      // Redirect anyway to clear the session on client side
      router.replace("/");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black backdrop-blur-md text-white px-4 sm:px-8 py-3 flex items-center justify-between border-b border-gray-800">
      {/* Left Section - Logo */}
      <div className="flex items-center space-x-3">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/moviez2.png"
            alt="Moviez Logo"
            width={45}
            height={45}
            priority
          />
        </Link>
      </div>

      {/* Right Section - Search & Avatar */}
      <div className="flex items-center space-x-3 relative">
       

        {/* Avatar */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-red-500 hover:opacity-90 transition"
          >
            <Image
              src="/avatar.png"
              alt="User Avatar"
              width={40}
              height={40}
              className="object-cover"
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-52 bg-neutral-900/95 border border-gray-700 rounded-xl shadow-lg backdrop-blur-lg overflow-hidden">
              <ul className="py-2 text-sm text-white">
                <li className="flex items-center px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer transition">
                  <Settings size={16} className="mr-2" /> Settings
                </li>
                <li
                  className="flex items-center px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer transition"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} className="mr-2" /> Sign Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}