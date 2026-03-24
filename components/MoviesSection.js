"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { FiSearch } from "react-icons/fi";
import FooterInside from "./FooterInside";

export default function MoviesSection({ searchQuery = "" }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Filter movies based on search query (case-insensitive)
  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  return (
    <>
      <section className="flex-1 flex flex-col pt-24 px-4 sm:px-6 mb-10 min-h-[calc(100vh-100px)]">
        {loading ? (
          <div className="flex flex-col items-center justify-center flex-1 mt-20">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent border-solid rounded-full animate-spin"></div>
            <p className="text-white text-center mt-4">Loading movies...</p>
          </div>
        ) : !movies.length ? (
          <div className="flex flex-col items-center justify-center flex-1 mt-20">
            <p className="text-white text-center mt-4 animate-pulse">No movies found.</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </section>
      <FooterInside />
    </>

  );
}
