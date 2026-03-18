// /app/api/admin/pending-users/route.js
import { connectToDatabase } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({ isApproved: false }).select("name email");
    return NextResponse.json({ users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
