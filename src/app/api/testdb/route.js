// app/api/testdb/route.js
import { connectToDatabase } from "../../../../lib/mongodb";

export async function GET() {
  try {
    const db = await connectToDatabase();
    const collections = await db.connection.db.listCollections().toArray();

    return Response.json({
      message: "✅ MongoDB connected successfully!",
      collections: collections.map((c) => c.name),
    });
  } catch (error) {
    return Response.json(
      { message: "❌ MongoDB connection failed", error: error.message },
      { status: 500 }
    );
  }
}
