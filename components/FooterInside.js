"use client";

export default function FooterInside() {
  return (
    <div className="w-full bg-black text-gray-500 py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} Moviez. All rights reserved.
      </div>
    </div>
  );
}
