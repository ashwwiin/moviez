"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MovieCard({ file }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    router.push(`/movies/${encodeURIComponent(file.name)}`);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer overflow-hidden rounded-2xl shadow-md transform transition-all duration-300 bg-gray-900
        ${isHovered ? "scale-105 z-10" : "scale-100"}`}
      style={{
        width: "200px",
        height: "300px",
        margin: "10px",
      }}
    >
      {/* Poster Image */}
      <img
        src={file.poster}
        alt={file.name}
        className="w-full h-full object-cover rounded-2xl transition-transform duration-500"
      />

      {/* Overlay */}
      <div
        className={`absolute bottom-0 w-full p-3 flex flex-col items-center rounded-b-2xl 
          bg-gradient-to-t from-black/90 to-transparent transition-all duration-300
          ${isHovered ? "h-48" : "h-20 overflow-hidden"}`}
      >
        <h3 className="text-white font-semibold text-sm text-center truncate w-full">
          {file.name}
        </h3>

        {/* Short Description on Hover */}
        {isHovered && (
          <p className="text-gray-300 text-xs mt-2 text-center line-clamp-4">
            {file.overview || "No description available."}
          </p>
        )}
      </div>
    </div>
  );
}
