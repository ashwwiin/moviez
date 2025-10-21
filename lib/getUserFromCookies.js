import { cookies } from "next/headers";
import { verifyJwt } from "./jwt";

export async function getUserFromCookies() {
  const allCookies = await cookies();
  const token = allCookies.get("token")?.value;

  if (!token) return null;
  const user = verifyJwt(token);
  return user;
}
