"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MovieCard({ file }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCardClick = () => {
    setIsLoading(true);
    router.push(`/movies/${encodeURIComponent(file.name)}`, { scroll: true });
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 bg-gray-900
        ${isHovered ? "scale-105 z-10" : "scale-100"}
      `}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent border-solid rounded-full animate-spin shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
          <p className="text-[10px] text-white font-bold uppercase tracking-widest mt-3 animate-pulse">Loading Asset</p>
        </div>
      )}

      {/* Poster with aspect ratio */}
      <div className="w-full aspect-[2/3] sm:aspect-[2/3] md:aspect-[2/3] lg:aspect-[2/3]">
        <img
          src={file.poster || "/sumathivalavu.avif"}
          alt={file.name}
          className="w-full h-full object-contain rounded-xl transition-transform duration-500"
        />
      </div>

      {/* Overlay */}
      <div
        className={`absolute bottom-0 w-full p-3 flex flex-col items-center rounded-b-xl
          bg-gradient-to-t from-black/90 to-transparent transition-all duration-300
          ${isHovered ? "h-36" : "h-16 overflow-hidden"}
        `}
      >
        <h3 className="text-white font-semibold text-sm text-center truncate w-full">
          {file.name}
        </h3>
        {isHovered && (
          <p className="text-gray-300 text-xs mt-1 text-center line-clamp-4">
            {file.overview || "No description available."}
          </p>
        )}
      </div>
    </div>
  );
}
