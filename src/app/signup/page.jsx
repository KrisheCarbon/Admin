"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { establishSessionFromUrl } from "@/lib/parseAuthHash";
import { completeSignup } from "./actions";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState("loading"); // loading | setup | waiting | done
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let settled = false;
    let timeoutId;

    function activate(session) {
      if (!session || settled) return;
      settled = true;
      clearTimeout(timeoutId);
      setUserId(session.user.id);
      setEmail(session.user.email ?? "");
      setStep("setup");
    }

    async function init() {
      const queryError = searchParams.get("error_description");
      if (queryError) {
        setError(decodeURIComponent(queryError));
        setStep("waiting");
        return;
      }

      const hash = window.location.hash.replace(/^#/, "");
      const hashParams = new URLSearchParams(hash);
      const hashError =
        hashParams.get("error_description") || hashParams.get("error");
      if (hashError) {
        setError(hashError.replace(/\+/g, " "));
        setStep("waiting");
        return;
      }

      const code = searchParams.get("code");

      try {
        // Invite links deliver tokens in the URL hash — parse them manually.
        const hashSession = await establishSessionFromUrl(supabase);
        if (hashSession) {
          activate(hashSession);
          return;
        }

        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;

          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            activate(session);
            return;
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          activate(session);
          return;
        }
      } catch (err) {
        setError(err.message);
        setStep("waiting");
        return;
      }

      timeoutId = setTimeout(() => {
        setStep((s) => (s === "loading" ? "waiting" : s));
      }, 2000);
    }

    init();

    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  async function handleSubmit() {
    setError("");

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error: pwError } = await supabase.auth.updateUser({ password });
      if (pwError) throw pwError;

      await completeSignup({ userId });
      setStep("done");
      setTimeout(() => router.replace("/"), 1500);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="w-[400px] max-w-full bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 pt-8 pb-6 text-center border-b">
        <div className="flex justify-center mb-3">
          <img src="/icons/logo.png" alt="KrisheCarbon" className="h-12" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">
          Set up your account
        </h1>
      </div>

      <div className="px-6 py-6 space-y-4">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {step === "loading" && (
          <p className="text-sm text-gray-500 text-center py-4">
            Verifying your invite…
          </p>
        )}

        {step === "waiting" && (
          <div className="space-y-4 text-center">
            <p className="text-sm text-gray-600">
              Open the setup link from your invite email to create your password.
            </p>
            <p className="text-xs text-gray-400">
              Links expire after 24 hours. Ask your admin to click{" "}
              <strong>Resend email</strong> on the Users page.
            </p>
          </div>
        )}

        {step === "setup" && (
          <>
            <p className="text-sm text-gray-600 text-center">
              You are creating a password for:
            </p>
            <EmailBadge email={email} />

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Confirm password
                </label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2.5 rounded-md text-sm font-medium hover:bg-black transition disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </>
        )}

        {step === "done" && (
          <p className="text-sm text-green-700 text-center font-medium py-4">
            Account created! Redirecting…
          </p>
        )}

        <p className="text-center text-sm text-gray-500 pt-2">
          Already set up?{" "}
          <Link
            href="/auth"
            className="text-gray-900 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function EmailBadge({ email }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
        Your account email
      </p>
      <p className="text-sm font-semibold text-gray-900 break-all">{email}</p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Suspense fallback={<p className="text-sm text-gray-500">Loading…</p>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
