import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_PREFIXES = ["/auth", "/onboarding", "/signup"];

function isPublicRoute(pathname) {
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function middleware(req) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) =>
          res.cookies.set({ name, value, ...options }),
        remove: (name, options) =>
          res.cookies.set({ name, value: "", ...options }),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public routes
  if (isPublicRoute(pathname)) {
    // Let /auth/callback finish the invite flow without redirecting away.
    if (user && (pathname === "/auth" || pathname === "/signup")) {
      const { data: profile } = await supabase
        .from("users")
        .select("status")
        .eq("id", user.id)
        .single();

      if (profile?.status === "pending_auth") {
        return NextResponse.redirect(new URL("/signup", req.url));
      }

      if (profile?.status === "active") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return res;
  }

  if (!user) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  const { data: profile } = await supabase
    .from("users")
    .select("status, role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (profile.status === "pending_auth") {
    return NextResponse.redirect(new URL("/signup", req.url));
  }

  if (profile.status === "disabled") {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|icons|images|public).*)"],
};
