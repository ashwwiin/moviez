import { connectToDatabase } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isApproved: false, // Wait for admin approval
    });

    await newUser.save();

    return NextResponse.json(
      { message: "✅ Signup successful! Your account is pending admin approval." },
      { status: 201 }
    );

  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
