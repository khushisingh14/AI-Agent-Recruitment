import AppShell from "@/components/AppShell";
import MetricCard from "@/components/MetricCard";

const metrics = [
  { title: "Avg. Match Score", value: "84.2%", change: "+12%", accent: "blue" },
  { title: "Time to Shortlist", value: "3.2 Days", change: "-4 days", accent: "purple" },
  { title: "Candidate ROI", value: "4.8x", change: "Stable", accent: "amber" },
  { title: "AI Screening Accuracy", value: "96.4%", change: "+28%", accent: "blue" },
];

const distribution = [
  { label: "0-20%", height: "15%", value: 42, color: "bg-slate-100" },
  { label: "21-40%", height: "25%", value: 86, color: "bg-slate-100" },
  { label: "41-60%", height: "45%", value: 154, color: "bg-slate-200" },
  { label: "61-80%", height: "90%", value: 284, color: "bg-blue-700" },
  { label: "81-90%", height: "65%", value: 198, color: "bg-blue-500" },
  { label: "91-100%", height: "35%", value: 112, color: "bg-blue-300" },
];

export default function AnalyticsPage() {
  return (
    <AppShell searchPlaceholder="Search analytics...">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-950">Analytics Overview</h1>
            <p className="mt-2 text-lg text-slate-500">
              Measuring hiring efficiency and candidate quality across all active pipelines.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
              Last 30 Days
            </button>
            <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
              Export
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-soft">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Match Score Distribution</h3>
              <p className="mt-1 text-sm text-slate-500">Volume of candidates across percentile tiers</p>
            </div>
            <div className="flex h-[280px] items-end gap-3">
              {distribution.map((item) => (
                <div key={item.label} className="group flex flex-1 flex-col items-center justify-end">
                  <div className="mb-2 opacity-0 transition group-hover:opacity-100">
                    <span className="rounded bg-slate-900 px-2 py-1 text-[10px] font-bold text-white">{item.value}</span>
                  </div>
                  <div className={`w-full rounded-t-xl ${item.color}`} style={{ height: item.height }} />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {distribution.map((item) => (
                <span key={item.label}>{item.label}</span>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-soft">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Interest Scores</h3>
              <p className="mt-1 text-sm text-slate-500">Average candidate engagement over time</p>
            </div>
            <div className="relative h-[280px] overflow-hidden rounded-[28px] bg-slate-50">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#712ae2" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#712ae2" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 0 35 Q 15 32, 25 20 T 50 15 T 75 10 T 100 12 L 100 40 L 0 40 Z" fill="url(#areaGradient)" />
                <path d="M 0 35 Q 15 32, 25 20 T 50 15 T 75 10 T 100 12" fill="none" stroke="#712ae2" strokeWidth="1.5" />
                <circle cx="25" cy="20" r="1.5" fill="#712ae2" />
                <circle cx="50" cy="15" r="1.5" fill="#712ae2" />
                <circle cx="75" cy="10" r="1.5" fill="#712ae2" />
                <circle cx="100" cy="12" r="1.5" fill="#712ae2" />
              </svg>
              <div className="absolute inset-x-0 bottom-1/4 border-t border-dashed border-slate-200" />
              <div className="absolute inset-x-0 bottom-1/2 border-t border-dashed border-slate-200" />
              <div className="absolute inset-x-0 bottom-3/4 border-t border-dashed border-slate-200" />
            </div>
            <div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Key Insight",
              text: "Top 10% candidates show 30% higher interest scores than the average across all departments.",
            },
            {
              title: "AI Recommendation",
              text: "Increase engagement for mobile-focused roles to capture several high-match passive candidates.",
            },
            {
              title: "Alert",
              text: "Time to shortlist is still above benchmark for senior product manager roles this month.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[28px] border border-slate-200/60 bg-slate-50 p-6">
              <div className="mb-4 h-12 w-12 rounded-2xl bg-white shadow-sm" />
              <h4 className="font-bold text-slate-900">{item.title}</h4>
              <p className="mt-2 text-sm leading-7 text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
