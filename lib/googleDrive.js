import { connectToDatabase } from "./mongodb";
import { Token } from "./models/Token";
import axios from "axios";

export async function getAccessTokenFromDB() {
  await connectToDatabase();

  const tokenDoc = await Token.findOne().lean(); // get plain JS object
  if (!tokenDoc?.refresh_token) throw new Error("No refresh token in DB");

  const res = await axios.post("https://oauth2.googleapis.com/token", {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: tokenDoc.refresh_token,
    grant_type: "refresh_token",
  });

  return res.data.access_token;
}

export async function listDriveFiles() {
  const accessToken = await getAccessTokenFromDB();

  const res = await axios.get("https://www.googleapis.com/drive/v3/files", {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { q: "mimeType contains 'video/'", fields: "files(id,name,webViewLink)" },
  });

  return res.data.files || [];
}
