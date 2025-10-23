import { connectToDatabase } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Invalid verification link" }),
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    console.log("Before verification:", user);

    if (user.emailVerified) {
      return new Response(
        JSON.stringify({ message: "Email already verified!" }),
        { status: 200 }
      );
    }

    // ✅ Update verification
    user.emailVerified = true;
    await user.save();

    console.log("After verification:", user);

    return new Response(
      JSON.stringify({ message: "Email verified successfully!" }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Verification error:", err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
