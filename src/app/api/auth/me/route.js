import { verifyJwt } from "../../../../../lib/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not logged in" }, { status: 401});

  const user = verifyJwt(token);
  if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  return NextResponse.json({ user });
}
