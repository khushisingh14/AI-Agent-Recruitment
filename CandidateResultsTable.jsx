"use client";

import { useRouter } from "next/navigation";

function ScoreBar({ label, value, color }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
        <span>{label}</span>
        <span className="text-slate-900">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function CandidateResultsTable({ candidates }) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-left">
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Candidate</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Skills</th>
              <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Scores</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Final</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {candidates.map((candidate) => (
              <tr
                key={candidate.id}
                className="cursor-pointer transition hover:bg-blue-50/40"
                onClick={() => router.push(`/candidates/${candidate.id}`)}
              >
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700">
                      {candidate.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{candidate.name}</p>
                      <p className="text-sm text-slate-500">{candidate.yearsExperience} Years Experience</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex max-w-[320px] flex-wrap gap-2">
                    {candidate.highlightedSkills.map((skill) => (
                      <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase text-blue-700">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > candidate.highlightedSkills.length ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase text-slate-500">
                        +{candidate.skills.length - candidate.highlightedSkills.length}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="mx-auto w-52 space-y-3">
                    <ScoreBar label="Match" value={candidate.matchScore} color="bg-gradient-to-r from-blue-700 to-blue-400" />
                    <ScoreBar label="Interest" value={candidate.interestScore} color="bg-gradient-to-r from-violet-600 to-fuchsia-400" />
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-lg font-black text-blue-700">
                    {candidate.finalScore}
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <button
                    className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-700 hover:text-white"
                    onClick={(event) => {
                      event.stopPropagation();
                      router.push(`/candidates/${candidate.id}`);
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-6 py-4">
        <p className="text-sm text-slate-500">Showing {candidates.length} of 42 candidates</p>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((page) => (
            <div
              key={page}
              className={[
                "flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold",
                page === 1 ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600",
              ].join(" ")}
            >
              {page}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
