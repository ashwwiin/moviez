"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { FiSearch } from "react-icons/fi";
import FooterInside from "./FooterInside";

export default function MoviesSection() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch("/api/movies");
        const data = await res.json();
        setMovies(data.status === "success" ? data.movies : []);
      } catch (err) {
        console.error(err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

if (loading)
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent border-solid rounded-full animate-spin">

      </div>
      <p className="text-white text-center mt-4">Loading movies...</p>
    </div>
  );

if (!movies.length)
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <p className="text-white text-center mt-4 animate-pulse">No movies found.</p>
    </div>
  );


  // Filter movies based on search query (case-insensitive)
  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <section className="pt-24 px-4 sm:px-6 mb-10">
  {/* Search Input */}
  <div className="flex justify-center mb-6">
    <div className="relative w-full max-w-sm">
      {/* Search Icon */}
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
        <FiSearch size={20} />
      </span>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Search movies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="
          w-full
          pl-10 pr-4 py-2.5
          rounded-full
          bg-gray-900
          text-white
          placeholder-gray-500
          shadow-md
          focus:outline-none
          focus:ring-2 focus:ring-red-600
          focus:ring-offset-1
          transition-all
          duration-300
          hover:shadow-xl
          sm:text-sm
        "
      />
    </div>
  </div>

  {/* Movies Grid */}
  {filteredMovies.length > 0 ? (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {filteredMovies.map((movie) => (
        <MovieCard key={movie._id} file={movie} />
      ))}
    </div>
  ) : (
    <p className="text-white text-center mt-6 animate-pulse">
      No movies matched your search.
    </p>
  )}
</section>
<FooterInside />
</>

  );
}
