import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import StatusCard from "@/components/StatusCard";

export default async function Home() {
  // ✅ MUST await in Next 15+
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

  // 🔒 HARD GUARD
  if (!user) {
    redirect("/auth");
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    throw new Error("Failed to load profile");
  }

  return (
    <div className="space-y-10">
      <div className="space-y-1.5">
        <h2 className="text-2xl Sbold text-gray-900">
          Welcome! {profile.full_name}
        </h2>
        <p className="text-sm text-gray-500">
          Overview of KrisheCarbon's operations
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm uppercase tracking-wide text-gray-500">
          Network Metrics
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatusCard label="Artisan Pros" value="128" />
          <StatusCard label="Kontikkis" value="56" />
          <StatusCard label="Climapreneurs" value="342" />
        </div>
      </section>
    </div>
  );
}
