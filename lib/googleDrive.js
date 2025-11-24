import { connectToDatabase } from "./mongodb";
import { Token } from "./models/Token";
import axios from "axios";

/**
 * Get Google API access token using refresh token stored in MongoDB
 */
export async function getAccessTokenFromDB() {
  await connectToDatabase();

  const tokenDoc = await Token.findOne().lean();
  if (!tokenDoc?.refresh_token) {
    throw new Error("No refresh token found in DB");
  }

  try {
    const body = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: tokenDoc.refresh_token,
      grant_type: "refresh_token",
    }).toString();

    const res = await axios.post("https://oauth2.googleapis.com/token", body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return res.data.access_token;
  } catch (err) {
    console.error("Error fetching access token:", err.response?.data || err.message);
    throw new Error("Failed to get Google access token");
  }
}

/**
 * List video files from Google Drive
 */
export async function listDriveFiles() {
  const accessToken = await getAccessTokenFromDB();

  try {
    const res = await axios.get("https://www.googleapis.com/drive/v3/files", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        q: "mimeType contains 'video/'",
        fields: "files(id,name,webViewLink)",
        pageSize: 1000,
      },
    });

    return res.data.files || [];
  } catch (err) {
    console.error("Error fetching Google Drive files:", err.response?.data || err.message);
    throw new Error("Failed to fetch Google Drive files");
  }
}
