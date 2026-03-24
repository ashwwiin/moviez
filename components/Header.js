"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Settings, LogOut } from "lucide-react";

export default function Header({ onSearch, searchQuery }) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [user, setUser] = useState(null);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

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
    <header className="fixed top-0 left-0 w-full z-50 h-[90px] bg-black/80 backdrop-blur-xl text-white px-4 sm:px-8 flex items-center justify-between border-b border-white/10">
      {/* Left Section - Logo */}
      <div className="flex items-center w-auto sm:w-1/3">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <Image
            src="/moviez2.png"
            alt="Moviez Logo"
            width={45}
            height={45}
            priority
          />
        </Link>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 flex justify-center px-4">
        {onSearch && (
          <div className="relative group w-full max-w-[200px] sm:max-w-sm md:max-w-md">
            <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-red-500 transition-colors pointer-events-none" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery || ''}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 w-full bg-white/5 border border-white/10 rounded-full text-[10px] sm:text-xs font-semibold text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all shadow-lg shadow-black/20"
            />
          </div>
        )}
      </div>

      {/* Right Section - Avatar */}
      <div className="flex items-center justify-end space-x-6 relative w-auto sm:w-1/3">
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
                {user?.isAdmin && (
                  <Link href="/admin">
                    <li
                      className="flex items-center px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings size={16} className="mr-2" /> Admin Panel
                    </li>
                  </Link>
                )}
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