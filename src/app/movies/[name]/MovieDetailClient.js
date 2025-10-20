"use client";

import Header from "../../../../components/Header"; // adjust path if needed

export default function MovieDetailClient({ movie }) {
  const getDriveEmbedUrl = (link) => {
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    return null;
  };

  const posterUrl = movie.poster || "/sumathivalavu.avif";
  const videoUrl = getDriveEmbedUrl(movie.webViewLink);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="pt-20 p-6 flex flex-col items-center"> {/* Added pt-20 to push content below header */}
        <div className="w-full md:w-4/5 flex flex-col md:flex-row gap-6">
          {/* Video Player */}
          <div className="md:w-1/2 w-full rounded-lg shadow-lg overflow-hidden relative pt-[56.25%]">
            {videoUrl && (
              <iframe
                src={videoUrl}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
          </div>

          {/* Details: Poster, Info, Cast */}
          <div className="md:w-1/2 flex flex-col gap-4">
            <div className="flex gap-4">
              <img
                src={posterUrl}
                alt={movie.name}
                className="w-32 h-48 rounded-lg shadow-lg object-cover"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{movie.name}</h1>
                <p className="text-gray-300 text-sm">{movie.overview}</p>
                <p className="mt-2 text-sm">
                  <strong>Release Date:</strong> {movie.release_date}
                </p>
                <p className="text-sm">
                  <strong>Rating:</strong> {movie.rating} / 10
                </p>
              </div>
            </div>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Cast</h2>
                <div className="flex flex-wrap gap-4">
                  {movie.cast.map((c) => (
                    <div key={c.name} className="w-20 text-center">
                      {c.profile_path && (
                        <img
                          src={c.profile_path}
                          alt={c.name}
                          className="rounded-lg w-full h-24 object-cover"
                        />
                      )}
                      <p className="text-xs text-white mt-1 truncate">{c.name}</p>
                      <p className="text-xs text-gray-300 truncate">{c.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
