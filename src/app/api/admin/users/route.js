// /app/api/admin/users/route.js
import { connectToDatabase } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}, "name email emailVerified isApproved isAdmin createdAt").sort({ createdAt: -1 });
    return NextResponse.json({ users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
