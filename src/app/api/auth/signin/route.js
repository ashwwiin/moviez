import { connectToDatabase } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import bcrypt from "bcryptjs";
import { signJwt } from "../../../../../lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password, rememberMe } = await req.json();

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // ✅ Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Please verify your email before signing in" },
        { status: 403 }
      );
    }

    // ✅ Check if admin has approved
    if (!user.isApproved) {
      return NextResponse.json(
        { error: "Your account is pending admin approval" },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = signJwt({ sub: user._id, email: user.email });

    // Set cookie
    const res = NextResponse.json({ message: "Login successful" });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined, // 7 days if rememberMe
    });

    return res;
  } catch (err) {
    console.error("Signin error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
