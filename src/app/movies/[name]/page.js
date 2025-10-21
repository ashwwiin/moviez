import { notFound } from "next/navigation";
import { connectToDatabase } from "../../../../lib/mongodb";
import Movie from "../../../../models/Movie";
import MovieDetailClient from "./MovieDetailClient";

export const dynamic = "force-dynamic"; // ensures fresh data
export const revalidate = 0;

export default async function MovieDetailPage({ params }) {
  // ✅ Await params if Next.js tells you to
  const resolvedParams = await params; // <--- this fixes the error
  const movieName = decodeURIComponent(resolvedParams.name);

  await connectToDatabase();
  let movie = await Movie.findOne({ name: movieName }).lean();

  if (!movie) return notFound();

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
