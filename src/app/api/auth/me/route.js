import { cookies } from "next/headers";
import { verifyJwt } from "../../../../../lib/jwt";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyJwt(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Return limited info
  return NextResponse.json({
    email: decoded.email,
    isAdmin: decoded.isAdmin,
  });
}
