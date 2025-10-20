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
        console.log("Fetched movies from DB:", data);
        setMovies(data.status === "success" ? data.movies : []);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
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
    <section className="flex flex-wrap gap-2 p-4 mt-20 mb-10">
      {movies.map((movie) => (
        <MovieCard key={movie._id} file={movie}/>
      ))}
    </section>
  );
}
