import { NextResponse } from "next/server";

export async function POST(req) {
  const baseUrl = req.nextUrl.origin; // dynamically get base URL

  // Create redirect response to landing page
  const res = NextResponse.redirect(baseUrl);

  // Clear the auth token cookie
  res.cookies.set("token", "", {
    path: "/",           // cookie available on all routes
    maxAge: 0,           // expire immediately
    httpOnly: true,      // inaccessible to JS (security)
    sameSite: "strict",  // prevent CSRF
    secure: process.env.NODE_ENV === "production", // secure in prod
  });

  return res;
}
