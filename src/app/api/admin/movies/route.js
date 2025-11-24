// /app/api/admin/movies/route.js
import { connectToDatabase } from "../../../../../lib/mongodb";
import Movie from "../../../../../models/Movie";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const movies = await Movie.find({}, "name release_date").sort({ release_date: -1 });
    const count = movies.length;
    return NextResponse.json({ movies, count });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
