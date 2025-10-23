// app/api/syncMovies/route.js
import { connectToDatabase } from "../../../../lib/mongodb";
import Movie from "../../../../models/Movie";
import axios from "axios";

export async function GET() {
  try {
    await connectToDatabase();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    console.log(`🌐 Syncing movies from: ${baseUrl}`);

    // 1️⃣ Fetch Google Drive movie files
    const driveRes = await axios.get(`${baseUrl}/api/testdrive`);
    const driveFiles = driveRes.data.files || [];

    const currentFileNames = driveFiles.map((f) =>
      f.name.replace(/\.[^/.]+$/, "")
    );

    // 2️⃣ Remove movies that no longer exist in Drive
    await Movie.deleteMany({ name: { $nin: currentFileNames } });

    // 3️⃣ Loop through Drive files and sync
    for (const file of driveFiles) {
      const movieNameRaw = file.name.replace(/\.[^/.]+$/, "");
      console.log(`🎬 Processing: ${movieNameRaw}`);

      // 🧹 Remove year in parentheses for TMDb search
      const cleanName = movieNameRaw.replace(/\s*\(\d{4}\)\s*$/, "").trim();

      // 🔍 Search TMDb
      const tmdbSearchRes = await axios.get(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: {
            api_key: process.env.TMDB_API_KEY,
            query: cleanName,
            include_adult: false,
          },
        }
      );

      let results = tmdbSearchRes.data.results || [];
      if (results.length === 0) {
        console.warn(`⚠️ No TMDb match found for "${cleanName}"`);
        continue;
      }

      // 🆕 Sort by release date (newest first)
      results = results
        .filter((m) => m.release_date)
        .sort(
          (a, b) =>
            new Date(b.release_date).getTime() -
            new Date(a.release_date).getTime()
        );

      // ✅ Pick the newest movie
      const tmdb = results[0];

      // 🧾 Extract release year
      const releaseYear = tmdb.release_date
        ? new Date(tmdb.release_date).getFullYear()
        : "Unknown";

      // ✅ Store as “Title (Year)”
      const formattedName = `${tmdb.title} (${releaseYear})`;

      // 🎭 Fetch cast
      let cast = [];
      try {
        const castRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${tmdb.id}/credits`,
          { params: { api_key: process.env.TMDB_API_KEY } }
        );

        cast = castRes.data.cast?.slice(0, 8).map((c) => ({
          name: c.name,
          character: c.character,
          profile_path: c.profile_path
            ? `https://image.tmdb.org/t/p/w200${c.profile_path}`
            : null,
        }));
      } catch (castErr) {
        console.warn(`⚠️ Failed to fetch cast for "${formattedName}":`, castErr.message);
      }

      // 💾 Upsert movie by TMDb ID
      await Movie.findOneAndUpdate(
        { tmdbId: tmdb.id },
        {
          name: formattedName,
          fileId: file.id,
          webViewLink: file.webViewLink,
          tmdbId: tmdb.id,
          poster: tmdb.poster_path
            ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}`
            : "",
          overview: tmdb.overview || "No overview available.",
          release_date: tmdb.release_date || "Unknown",
          rating: tmdb.vote_average || 0,
          cast,
        },
        { upsert: true, new: true }
      );

      console.log(`✅ Synced: ${formattedName} (TMDb ID: ${tmdb.id})`);
    }

    return Response.json({ message: "✅ Movies synced successfully" });
  } catch (err) {
    console.error("❌ Sync error:", err.message);
    return Response.json({ error: "Failed to sync movies" }, { status: 500 });
  }
}
