"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black/90 text-gray-300 px-6 py-10 font-sans">
      <div className="max-w-6xl mx-auto text-center">
        {/* About */}
        <div className="mb-8">
          <h3 className="text-white font-bold text-xl mb-2">Moviez</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Unlimited movies, TV shows, and more. Watch anywhere.
          </p>
        </div>

        {/* Links and Support */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-12 mb-8">
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/" className="hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link href="/collection" className="hover:text-red-500 transition-colors">Collection</Link></li>
              <li><Link href="/signin" className="hover:text-red-500 transition-colors">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-red-500 transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-2">Support</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="#" className="hover:text-red-500 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center items-center gap-6 mb-6">
          {/* Instagram */}
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.206.058 2.03.25 2.503.415a4.92 4.92 0 0 1 1.792 1.042 4.92 4.92 0 0 1 1.042 1.792c.165.473.357 1.297.415 2.503.058 1.266.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.058 1.206-.25 2.03-.415 2.503a4.918 4.918 0 0 1-1.042 1.792 4.918 4.918 0 0 1-1.792 1.042c-.473.165-1.297.357-2.503.415-1.266.058-1.645.07-4.85.07s-3.584-.012-4.85-.07c-1.206-.058-2.03-.25-2.503-.415a4.918 4.918 0 0 1-1.792-1.042 4.918 4.918 0 0 1-1.042-1.792c-.165-.473-.357-1.297-.415-2.503C2.175 15.747 2.163 15.368 2.163 12s.012-3.584.07-4.85c.058-1.206.25-2.03.415-2.503a4.92 4.92 0 0 1 1.042-1.792A4.92 4.92 0 0 1 5.492 2.648c.473-.165 1.297-.357 2.503-.415C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.127 4.822.319 4.042.57a6.918 6.918 0 0 0-2.51 1.64A6.918 6.918 0 0 0 .57 4.042C.319 4.822.127 5.771.07 7.052.012 8.332 0 8.741 0 12s.012 3.668.07 4.948c.057 1.281.249 2.23.5 3.01a6.918 6.918 0 0 0 1.64 2.51 6.918 6.918 0 0 0 2.51 1.64c.78.251 1.729.443 3.01.5 1.28.058 1.689.07 4.948.07s3.668-.012 4.948-.07c1.281-.057 2.23-.249 3.01-.5a6.918 6.918 0 0 0 2.51-1.64 6.918 6.918 0 0 0 1.64-2.51c.251-.78.443-1.729.5-3.01.058-1.28.07-1.689.07-4.948s-.012-3.668-.07-4.948c-.057-1.281-.249-2.23-.5-3.01a6.918 6.918 0 0 0-1.64-2.51 6.918 6.918 0 0 0-2.51-1.64c-.78-.251-1.729-.443-3.01-.5C15.668.012 15.259 0 12 0z"/>
              <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zM18.406 4.594a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
            </svg>
          </a>

          {/* X / Twitter */}
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors" aria-label="X">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9.09 9.09 0 0 1-2.88 1.1 4.52 4.52 0 0 0-7.76 4.13A12.84 12.84 0 0 1 1.64 1.15a4.52 4.52 0 0 0 1.4 6.03A4.41 4.41 0 0 1 .96 6.1v.06a4.52 4.52 0 0 0 3.63 4.43 4.52 4.52 0 0 1-2.04.08 4.52 4.52 0 0 0 4.22 3.13A9.05 9.05 0 0 1 0 19.54a12.77 12.77 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.84 0-.2-.01-.42-.02-.63A9.22 9.22 0 0 0 23 3z"/>
            </svg>
          </a>

          {/* GitHub */}
          <a href="https://www.github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors" aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.724-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.838 1.234 1.838 1.234 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.304.762-1.604-2.665-.3-5.466-1.332-5.466-5.931 0-1.31.465-2.381 1.235-3.221-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3-.404c1.02.005 2.045.138 3 .404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.241 2.873.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.609-2.804 5.628-5.475 5.922.43.372.823 1.102.823 2.222v3.293c0 .319.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>
        </div>

        <div className="border-t border-gray-800 pt-4 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Moviez. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
