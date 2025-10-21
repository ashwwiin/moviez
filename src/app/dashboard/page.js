import { redirect } from "next/navigation";
import { getUserFromCookies } from "../../../lib/getUserFromCookies";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const user = await getUserFromCookies();
  if (!user) redirect("/signin");

  return <DashboardClient user={user} />;
}
