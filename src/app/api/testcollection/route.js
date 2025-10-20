import { connectToDatabase } from "../../../../lib/mongodb";

export async function GET() {
  const client = await connectToDatabase();
  const db = client.connection.db; // raw DB
  const doc = await db.collection("tokens").findOne({});
  console.log("Raw doc:", doc);
  return new Response(JSON.stringify(doc));
}
