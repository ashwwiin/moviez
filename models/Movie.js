import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    overview: String,
    poster: String,
    rating: Number,
    release_date: String,
    fileId: String,
    webViewLink: String,
    cast: Array,
  },
  { timestamps: true }
);

export default mongoose.models.Movie || mongoose.model("Movie", movieSchema);
