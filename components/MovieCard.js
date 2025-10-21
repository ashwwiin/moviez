"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MovieCard({ file }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
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
