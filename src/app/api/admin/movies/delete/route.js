import { connectToDatabase } from "../../../../../../lib/mongodb";
import Movie from "../../../../../../models/Movie";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await connectToDatabase();

    const result = await Movie.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Movie removed successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
