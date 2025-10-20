import { NextResponse } from "next/server";
import axios from "axios";
import { connectToDatabase } from "../../../../../../lib/mongodb";
import mongoose from "mongoose";

// Token schema
const tokenSchema = new mongoose.Schema({
  refresh_token: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});
const Token = mongoose.models.Token || mongoose.model("Token", tokenSchema, "tokens");

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    console.log("✅ Access Token:", access_token);
    console.log("✅ Refresh Token:", refresh_token);

    // Save refresh token in DB
    await connectToDatabase();

    if (refresh_token) {
      // Update if exists, else create new
      await Token.findOneAndUpdate(
        {},
        { refresh_token, created_at: new Date() },
        { upsert: true, new: true }
      );
      console.log("Refresh token stored/updated in DB");
    }

    // Set access token in cookie
    const response = NextResponse.redirect("http://localhost:3000/dashboard");
    response.cookies.set("tokens", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: expires_in,
    });

    return response;

  } catch (err) {
    console.error("Google OAuth Error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: "Failed to exchange code for token", details: err.response?.data || err.message },
      { status: 500 }
    );
  }
}
