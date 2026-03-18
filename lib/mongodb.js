// lib/mongodb.js
import mongoose from "mongoose";
import dns from "dns";

// Fix for SRV resolution issues on some DNS providers (like BSNL)
// This must be called at the very top level before any connections
if (typeof dns.setServers === 'function') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    console.log("ℹ️ DNS servers set to Google & Cloudflare");
  } catch (e) {
    console.warn("⚠️ Could not set DNS servers:", e.message);
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 20000, // Increased timeout
      family: 4, // Force IPv4 to avoid some local resolution issues
    };

    console.log("🔌 Attempting to connect to MongoDB...");
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected Successfully");
      return mongoose;
    }).catch(err => {
      console.error("❌ MongoDB Connection Promise Rejected:", err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise so we can retry
    console.error("❌ MongoDB Final Connection Error:", e.message);
    throw e;
  }

  global.mongoose = cached;
  return cached.conn;
}
