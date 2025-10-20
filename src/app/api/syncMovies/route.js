// app/api/syncMovies/route.js
import { connectToDatabase } from "../../../../lib/mongodb";
import Movie from "../../../../models/Movie";
import axios from "axios";

export async function GET() {
  try {
    await connectToDatabase();

    // ✅ Use fallback for base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // 1️⃣ Fetch movie files from your Drive API
    const driveRes = await axios.get(`${baseUrl}/api/testdrive`);
    const driveFiles = driveRes.data.files || [];

    const currentFileNames = driveFiles.map((f) =>
      f.name.replace(/\.[^/.]+$/, "")
    );

    // 2️⃣ Remove movies not present in Drive anymore
    await Movie.deleteMany({ name: { $nin: currentFileNames } });

    // 3️⃣ Loop through and update/insert movie details
    for (const file of driveFiles) {
      const movieName = file.name.replace(/\.[^/.]+$/, "");

      // Search TMDB for movie info
      const tmdbRes = await axios.get("https://api.themoviedb.org/3/search/movie", {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query: movieName,
        },
      });

      const tmdb = tmdbRes.data.results?.[0];
      if (!tmdb) {
        console.warn(`⚠️ No TMDB match found for ${movieName}`);
        continue;
      }

      // Fetch cast details
      const castRes = await axios.get(
        `https://api.themoviedb.org/3/movie/${tmdb.id}/credits`,
        { params: { api_key: process.env.TMDB_API_KEY } }
      );

      const cast = castRes.data.cast?.slice(0, 8).map((c) => ({
        name: c.name,
        character: c.character,
        profile_path: c.profile_path
          ? `https://image.tmdb.org/t/p/w200${c.profile_path}`
          : null,
      }));

      // Upsert the movie record in MongoDB
      await Movie.findOneAndUpdate(
        { name: movieName },
        {
          name: movieName,
          fileId: file.id,
          webViewLink: file.webViewLink,
          tmdbId: tmdb.id,
          poster: tmdb.poster_path
            ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}`
            : "",
          overview: tmdb.overview,
          release_date: tmdb.release_date,
          rating: tmdb.vote_average,
          cast,
        },
        { upsert: true, new: true }
      );
    }

    return Response.json({ message: "✅ Movies synced successfully" });
  } catch (err) {
    console.error("❌ Sync error:", err.message);
    return Response.json({ error: "Failed to sync movies" }, { status: 500 });
  }
}
