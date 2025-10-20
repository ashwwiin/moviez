import Header from "../../../components/Header";
import MoviesSection from "../../../components/MoviesSection";
import { cookies } from "next/headers";
import { verifyJwt } from "../../../lib/jwt";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const allCookies = await cookies(); 

  // 1️⃣ Check user authentication
  const token = allCookies.get("token")?.value;
  if (!token) redirect("/signin");

  const user = verifyJwt(token);
  if (!user) redirect("/signin");

  return (
    <>
      <Header />
      <main className="mt-20">
        <MoviesSection />
      </main>
    </>
  );
}
