// /lib/models/Token.js
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  refresh_token: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export const Token = mongoose.models.Token || mongoose.model("Token", tokenSchema, "tokens");
