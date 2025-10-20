// app/api/syncMovies/route.js
import { connectToDatabase } from "../../../../lib/mongodb";
import Movie from "../../../../models/Movie";
import axios from "axios";

export async function GET() {
  try {
    await connectToDatabase();

    // ✅ Correct: use NEXT_PUBLIC_APP_URL (set in Vercel) or fallback to localhost
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    console.log(`🌐 Syncing movies from: ${baseUrl}`);

    // 1️⃣ Fetch movie files from Google Drive API endpoint
    const driveRes = await axios.get(`${baseUrl}/api/testdrive`);
    const driveFiles = driveRes.data.files || [];

    const currentFileNames = driveFiles.map((f) =>
      f.name.replace(/\.[^/.]+$/, "")
    );

    // 2️⃣ Remove any movies that no longer exist in Drive
    await Movie.deleteMany({ name: { $nin: currentFileNames } });

    // 3️⃣ For each file, fetch TMDB info and update/insert in MongoDB
    for (const file of driveFiles) {
      const movieName = file.name.replace(/\.[^/.]+$/, "");

      // Search TMDB for details
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

      // Get cast info
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

      // Upsert movie document in DB
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
