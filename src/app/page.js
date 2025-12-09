import StatCard from "@/components/StatCard";

export default function Home() {
  return (
    <div className="space-y-8 m-10">
      {/* Header */}
      <div className="flex items-center justify-between ">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <div className="text-sm text-gray-500">Welcome back, Admin</div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="No. of Artisan Pros" value="128" delta="+4 this week" icon="/icons/users.svg" />
        <StatCard label="No. of Kontikkis" value="56" delta="+2 this week" icon="/icons/box.svg" />
        <StatCard label="No. of Climapreneurs" value="342" delta="+12 this week" icon="/icons/users.svg" />
        <StatCard label="Total Biochar Produced" value="78.4 tons" delta="+2.3 tons" icon="/icons/leaf.svg" />
        <StatCard label="Biomass Ready for Biochar" value="132.9 tons" delta="+8.7 tons" icon="/icons/leaf.svg" />
        <StatCard label="Verified Biochar" value="64.1 tons" delta="+1.1 tons" icon="/icons/check-badge.svg" />
      </div>
    </div>
  );
}
