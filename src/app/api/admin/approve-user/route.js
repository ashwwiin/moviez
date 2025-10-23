import { connectToDatabase } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import { NextResponse } from "next/server";

// Only admin can access this endpoint (you can implement auth later)
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.emailVerified) {
      return NextResponse.json({ error: "User email is not verified yet" }, { status: 400 });
    }

    if (user.isApproved) {
      return NextResponse.json({ message: "User is already approved" }, { status: 200 });
    }

    user.isApproved = true;
    await user.save();

    return NextResponse.json({ message: "✅ User approved successfully" }, { status: 200 });
  } catch (err) {
    console.error("Approval error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
