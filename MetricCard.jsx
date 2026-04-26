export default function MetricCard({ title, value, change, accent = "blue" }) {
  const accentStyles =
    accent === "purple"
      ? "bg-purple-50 text-purple-600"
      : accent === "amber"
        ? "bg-amber-50 text-amber-600"
        : "bg-blue-50 text-blue-600";

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
      <div className={`mb-4 inline-flex rounded-2xl p-2 ${accentStyles}`}>
        <div className="h-3 w-3 rounded-full bg-current" />
      </div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-1 text-2xl font-bold text-slate-900">{value}</h3>
      <p className="mt-2 text-xs font-semibold text-emerald-500">{change}</p>
    </div>
  );
}
