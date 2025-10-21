"use client";

import { useEffect } from "react";
import Header from "../../../../components/Header";
import FooterInside from "../../../../components/FooterInside";

export default function MovieDetailClient({ movie }) {
  useEffect(() => {
    if (!sessionStorage.getItem("movieRefreshed")) {
      sessionStorage.setItem("movieRefreshed", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("movieRefreshed");
    }
  }, []);

  const getDriveEmbedUrl = (link) => {
    const match = link?.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
  };

  const posterUrl = movie.poster || "/sumathivalavu.avif";
  const videoUrl = getDriveEmbedUrl(movie.webViewLink);

  // Filter out cast without valid profile_path
  const filteredCast = movie.cast?.filter((c) => c.profile_path) || [];

  return (
    <div className="min-h-screen bg-black to-black text-white">
      <Header />

      <div className="pt-24 px-4 sm:px-8 lg:px-16 pb-16">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* 🎥 Video Section */}
          <div className="relative w-full lg:w-2/3 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
            {videoUrl ? (
              <iframe
                src={videoUrl}
                className="absolute top-0 left-0 w-full h-full rounded-2xl"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                <p className="text-gray-500">🎬 Trailer not available</p>
              </div>
            )}
          </div>

          {/* 🎬 Movie Details */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="flex gap-6">
              <img
                src={posterUrl}
                alt={movie.name}
                className="w-36 sm:w-44 rounded-xl shadow-xl object-cover border border-zinc-700 hover:scale-105 transition-transform duration-300"
              />
              <div className="flex-1">
                <h1 className="text-4xl font-extrabold mb-2 leading-tight">
                  {movie.name}
                </h1>
                <p className="text-gray-300 text-sm sm:text-base leading-snug line-clamp-5">
                  {movie.overview || "No description available."}
                </p>

                <div className="mt-4 space-y-1 text-sm text-gray-400">
                  <p>
                    <span className="font-semibold text-gray-200">
                      Release Date:
                    </span>{" "}
                    {movie.release_date || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-200">Rating:</span>{" "}
                    {movie.rating ? `${movie.rating}/10` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* 🌟 Cast Section */}
            {filteredCast.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 border-b border-zinc-700 pb-2">
                  Cast
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {filteredCast.map((c) => (
                    <div
                      key={c._id || c.name}
                      className="group flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
                    >
                      <div className="w-20 h-24 sm:w-24 sm:h-28 overflow-hidden rounded-lg border border-zinc-700 shadow-md group-hover:border-red-500">
                        <img
                          src={c.profile_path}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs sm:text-sm mt-1 font-medium truncate w-full">
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate w-full">
                        {c.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🌈 Footer Gradient */}
      <div className="h-20 bg-gradient-to-t from-black via-transparent to-transparent" />
      <FooterInside />
    </div>
  );
}
