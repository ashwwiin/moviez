import { connectToDatabase } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const users = await User.find({ emailVerified: true, isApproved: false }).select("name email");

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("Fetch pending users error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
