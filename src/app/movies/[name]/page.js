// app/movies/[name]/page.js
import { notFound } from "next/navigation";
import { connectToDatabase } from "../../../../lib/mongodb";
import Movie from "../../../../models/Movie";
import MovieDetailClient from "./MovieDetailClient";

export default async function MovieDetailPage({ params }) {
  // ✅ Destructure using await to satisfy App Router
  const { name } = await params; // or just use params directly if not needed
  const movieName = decodeURIComponent(name);

  await connectToDatabase();
  let movie = await Movie.findOne({ name: movieName }).lean();

  if (!movie) return notFound();

  // Convert MongoDB document to plain JS object
  movie = {
    ...movie,
    _id: movie._id.toString(),
    cast: movie.cast?.map((c) => ({
      name: c.name,
      character: c.character,
      profile_path: c.profile_path,
    })),
    createdAt: movie.createdAt?.toString(),
    updatedAt: movie.updatedAt?.toString(),
  };

  return <MovieDetailClient movie={movie} />;
}
