"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Verifying...");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const email = searchParams.get("email");

      if (!email) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const res = await fetch(
          `/api/auth/verify-email?email=${encodeURIComponent(email)}`
        );
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          setTimeout(() => router.push("/signin"), 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed.");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Server error. Please try again later.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {status === "success" && (
          <h1 className="text-2xl font-bold text-green-400 mb-4">✅ Success!</h1>
        )}
        {status === "error" && (
          <h1 className="text-2xl font-bold text-red-500 mb-4">❌ Error</h1>
        )}
        {status === "Verifying..." && (
          <h1 className="text-2xl font-bold text-blue-400 mb-4">⏳ Verifying...</h1>
        )}
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-blue-400 mb-4">⏳ Loading...</h1>
          <p className="text-white">Please wait...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}