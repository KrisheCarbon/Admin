import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

// Roles that can access the portal
const PORTAL_ROLES = ["admin", "supervisor"];

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: profile, error } = await supabase
    .from("users")
    .select("role, first_name, last_name, status")
    .eq("id", user.id)
    .single();

  if (error || !profile || !PORTAL_ROLES.includes(profile.role)) {
    redirect("/auth");
  }

  const displayName = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .join(" ");

  const initials =
    (profile.first_name?.[0] ?? "") + (profile.last_name?.[0] ?? "") ||
    user.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden">
      <header className="h-16 flex-shrink-0 border-b border-gray-200 bg-white">
        <Navbar initials={initials.toUpperCase()} displayName={displayName} />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
          <Sidebar role={profile.role} />
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
