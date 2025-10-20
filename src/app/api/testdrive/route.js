import { NextResponse } from "next/server";
import { listDriveFiles } from "../../../../lib/googleDrive";

export async function GET() {
  try {
    const files = await listDriveFiles(); // Get Google Drive movies

    const TMDB_API_KEY = process.env.TMDB_API_KEY;

    // Map each file to TMDb data
    const filesWithTmdb = await Promise.all(
      files.map(async (file) => {
        try {
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
          const tmdbRes = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
              nameWithoutExt
            )}`
          );
          const tmdbData = await tmdbRes.json();
          const movie = tmdbData.results?.[0] || null;

          return {
            ...file,
            tmdb: movie
              ? {
                  title: movie.title,
                  overview: movie.overview,
                  poster_path: movie.poster_path,
                  release_date: movie.release_date,
                  vote_average: movie.vote_average,
                }
              : null,
          };
        } catch (err) {
          return { ...file, tmdb: null };
        }
      })
    );

    return NextResponse.json({ status: "success", files: filesWithTmdb });
  } catch (error) {
    console.error("Drive API Error:", error.message);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch Google Drive files" },
      { status: 500 }
    );
  }
}
