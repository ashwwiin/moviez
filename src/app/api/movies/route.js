import { connectToDatabase } from "../../../../lib/mongodb";
import Movie from "../../../../models/Movie";

export async function GET() {
  try {
    await connectToDatabase();
    const movies = await Movie.find({}).lean(); // fetch all movies
    return new Response(JSON.stringify({ status: "success", movies }), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch movies from DB:", err);
    return new Response(JSON.stringify({ status: "error", error: err.message }), { status: 500 });
  }
}
