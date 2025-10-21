"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

export default function MoviesSection() {
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

  if (loading)
    return <p className="text-white text-center mt-6">Loading movies...</p>;
  if (!movies.length)
    return <p className="text-white text-center mt-6">No movies found.</p>;

  return (
    <section className="p-4 mt-6 mb-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie._id} file={movie} />
        ))}
      </div>
    </section>
  );
}
