import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  const token = req.cookies.get("google_token")?.value;
  if (!token) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  try {
    const response = await axios.get("https://www.googleapis.com/drive/v3/files", {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageSize: 20, fields: "files(id,name,mimeType,webViewLink)" },
    });

    return NextResponse.json(response.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}
