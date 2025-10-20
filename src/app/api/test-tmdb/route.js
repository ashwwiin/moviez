import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tmdbKey = process.env.TMDB_API_KEY;
    if (!tmdbKey) throw new Error("TMDb API key not found in env");

    // Test search for a sample movie
    const movieName = "Inception";
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(movieName)}`
    );

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ status: "error", message: "No movie found" });
    }

    // Return first result for testing
    return NextResponse.json({
      status: "success",
      movie: data.results[0],
    });

  } catch (err) {
    console.error("TMDb Test Error:", err);
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
