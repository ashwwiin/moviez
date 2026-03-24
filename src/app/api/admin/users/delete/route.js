import { connectToDatabase } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/User";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const { email, id } = await req.json();
    await connectToDatabase();

    const query = id ? { _id: id } : { email };
    const result = await User.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User removed successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
