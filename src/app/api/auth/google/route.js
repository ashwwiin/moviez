import { NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export async function GET() {
  try {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    // Google OAuth configuration
    const options = {
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "code",
      access_type: "offline", // ✅ Ensures you get a refresh token
      prompt: "consent", // ✅ Always show consent screen once per user to ensure refresh token
      scope: [
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid",
      ].join(" "),
    };

    // Build final redirect URL
    const url = `${rootUrl}?${new URLSearchParams(options).toString()}`;

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Google OAuth Error:", error);
    return NextResponse.json({ error: "Failed to start Google OAuth" }, { status: 500 });
  }
}
