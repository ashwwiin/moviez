"use client";

import Header from "../../../components/Header";
import MoviesSection from "../../../components/MoviesSection";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardClient({ user }) {
  const router = useRouter();

  useEffect(() => {
    // Helps ensure client-side navigation is fully hydrated
    router.prefetch("/dashboard");
  }, [router]);

  return (
    <>
      <Header />
      <main className="mt-20">
        <MoviesSection />
      </main>
    </>
  );
}
