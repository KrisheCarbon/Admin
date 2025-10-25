export default function StatCard({ label, value, delta, icon }) {
  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm 
                 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 
                 cursor-pointer min-h-[160px] flex flex-col justify-between"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500 font-medium">{label}</div>
          <div className="mt-2 text-3xl font-semibold text-gray-800">{value}</div>
          {delta ? (
            <div
              className={`mt-2 text-sm font-medium ${
                delta.startsWith("-") ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {delta}
            </div>
          ) : null}
        </div>

        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
            <img src={icon} alt="" className="h-7 w-7 opacity-80" />
          </div>
        )}
      </div>
    </div>
  );
}
