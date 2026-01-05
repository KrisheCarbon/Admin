import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default async function AdminLayout({ children }) {
  // ✅ Next 15+ requires awaiting cookies()
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

  // 🔒 AUTH CHECK
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // 🔐 ADMIN ROLE CHECK
  const { data: profile, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || profile?.role !== "admin") {
    redirect("/auth");
  }

  // ✅ AUTHORIZED ADMIN UI
  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden">
      
      {/* NAVBAR – FULL WIDTH */}
      <header className="h-16 flex-shrink-0 border-b border-gray-200 bg-white">
        <Navbar />
      </header>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
          <Sidebar />
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
