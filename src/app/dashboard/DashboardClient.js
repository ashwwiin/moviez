"use client";

import Header from "../../../components/Header";
import MoviesSection from "../../../components/MoviesSection";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardClient({ user }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Helps ensure client-side navigation is fully hydrated
    router.prefetch("/dashboard");
  }, [router]);

  return (
    <>
      
    <main className="w-full min-h-screen bg-black flex flex-col">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      <MoviesSection searchQuery={searchQuery} />
    </main>
    </>
  );
}
