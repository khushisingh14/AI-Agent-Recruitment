import Link from "next/link";

import AppShell from "@/components/AppShell";
import { dashboardPreviewCandidates } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <AppShell searchPlaceholder="Search talent...">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <div className="mb-4 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">
            Next-Gen Recruiting
          </div>
          <h1 className="max-w-2xl text-5xl font-black leading-tight text-slate-950">
            Find the Right <span className="text-blue-700">Talent</span> Instantly with AI
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-500">
            TalentAI helps recruiters parse job descriptions, surface strong candidates, simulate outreach, and act on ranked shortlists without the usual chaos.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/candidates"
              className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-px"
            >
              Start Scouting
            </Link>
            <Link
              href="/jd-analysis"
              className="rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Demo
            </Link>
          </div>
        </div>

        <div className="glass-panel rounded-[32px] p-6 shadow-soft">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-2xl font-bold text-slate-900">Smart Pipeline</h3>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">
              Live AI Scoring
            </span>
          </div>

          <div className="space-y-4">
            {dashboardPreviewCandidates.map((candidate) => (
              <div key={candidate.id} className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white/80 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-sm font-black text-blue-700">
                  {candidate.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">{candidate.name}</p>
                  <p className="truncate text-sm text-slate-500">{candidate.role}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-blue-700">{candidate.matchScore}%</div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Match</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs">
              <span className="text-slate-500">AI Confidence Level</span>
              <span className="font-bold text-blue-700">High</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-blue-700 to-violet-500" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Instant Screening",
            text: "Cuts first-pass recruiting time dramatically while keeping the shortlist explainable.",
          },
          {
            title: "JD Intelligence",
            text: "Turns messy job descriptions into structured role, experience, and skill signals.",
          },
          {
            title: "Interest Insights",
            text: "Combines profile fit with simulated engagement to show who is worth pursuing now.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-soft">
            <div className="mb-4 h-12 w-12 rounded-2xl bg-blue-50" />
            <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-500">{item.text}</p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
