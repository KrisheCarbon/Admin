"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // email | otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendOtp() {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setStep("otp");
  }

  async function verifyOtp() {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Force cookie write
    await supabase.auth.getSession();
    router.replace("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-[380px] max-w-full bg-white rounded-xl border border-gray-200 shadow-sm">

        
        {/* Brand Header */}
        <div className="px-6 pt-8 pb-6 text-center border-b">
          <div className="flex justify-center mb-3">
            <img
              src="/icons/logo.png"
              alt="KrisheCarbon"
              className="h-12"
            />
          </div>
          <h1 className="text-lg Sbold text-gray-900">
            KrisheCarbon Admin
          </h1>
        </div>

        {/* Form */}
        {/* Form */}
        <div className="px-6 py-6 space-y-4 min-h-[260px] flex flex-col justify-center">

          <div className="min-h-[40px]">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {error}
              </div>
            )}
          </div>


          {step === "email" && (
            <>
              <div className="space-y-1">
                <label className="text-sm Smedium text-gray-700">
                  Admin email
                </label>
                <input
                  type="email"
                  placeholder="you@krishecarbon.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-gray-900 text-white py-2.5 rounded-md text-sm Smedium hover:bg-black transition disabled:opacity-60"
              >
                {loading ? "Sending OTP…" : "Send OTP"}
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="space-y-1">
                <label className="text-sm Smedium text-gray-700">
                  One-time password
                </label>
                <input
                  type="text"
                  placeholder="Enter the 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full bg-gray-900 text-white py-2.5 rounded-md text-sm Smedium hover:bg-black transition disabled:opacity-60"
              >
                {loading ? "Verifying…" : "Verify & Login"}
              </button>

              <button
                onClick={() => setStep("email")}
                className="w-full text-sm text-gray-500 hover:text-gray-900 mt-2"
              >
                Use a different email
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
