
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

console.log("Connecting to:", MONGODB_URI.split("@")[1]); // Hide password

async function test() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connection successful");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed");
    console.error(err);
    process.exit(1);
  }
}

test();
