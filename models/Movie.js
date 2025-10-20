import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    fileId: String,
    webViewLink: String,
    tmdbId: Number,
    poster: String,
    overview: String,
    release_date: String,
    rating: Number,
    cast: [
      {
        name: String,
        character: String,
        profile_path: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
