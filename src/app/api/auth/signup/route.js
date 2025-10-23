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
      emailVerified: false,
      isApproved: false,
    });

    await newUser.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?email=${encodeURIComponent(email)}`;

    await transporter.sendMail({
      from: `"Moviez" <moviez258963@gmail.com>`, // verified sender
      to: email,
      subject: "Verify your Moviez account",
      html: `<p>Hello ${name},</p>
             <p>Click below to verify your email:</p>
             <a href="${verifyLink}">Verify Email</a>`,
    });

    return NextResponse.json(
      { message: "✅ Signup successful! Check your email to verify." },
      { status: 201 }
    );

  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
