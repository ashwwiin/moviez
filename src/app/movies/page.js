import { connectToDatabase } from "../../../lib/mongodb";
import Movie from "../../../models/Movie";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  await connectToDatabase();
  const movies = await Movie.find().lean();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🎥 Movies</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link
            key={movie._id}
            href={`/movies/${encodeURIComponent(movie.name)}`}
            className="group relative rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform"
          >
            <img
              src={movie.poster}
              alt={movie.name}
              className="w-full h-72 object-cover"
            />
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2 text-center">
              <h3 className="font-semibold text-sm truncate">{movie.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
