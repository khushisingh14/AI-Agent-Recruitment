"use client";

import { useEffect, useMemo, useState } from "react";

import CandidateResultsTable from "@/components/CandidateResultsTable";
import { fetchPipeline } from "@/lib/api";
import { getStoredJdText } from "@/lib/jd-session";

export default function CandidatesPipelineClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pipeline, setPipeline] = useState({ parsed_jd: null, candidates: [] });

  useEffect(() => {
    let cancelled = false;

    async function loadPipeline() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchPipeline(getStoredJdText());
        if (!cancelled) {
          setPipeline(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load candidate pipeline.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPipeline();
    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = useMemo(() => {
    const candidates = pipeline.candidates || [];
    const avgMatch = candidates.length
      ? Math.round(candidates.reduce((sum, candidate) => sum + candidate.matchScore, 0) / candidates.length)
      : 0;
    const topSkills = pipeline.parsed_jd?.skills || [];
    const highInterestCount = candidates.filter((candidate) => candidate.interestScore >= 75).length;

    return {
      avgMatch,
      topSkills,
      highInterestCount,
    };
  }, [pipeline]);

  if (loading) {
    return <div className="rounded-[28px] border border-slate-100 bg-white p-8 text-sm text-slate-500 shadow-soft">Loading live candidate pipeline...</div>;
  }

  if (error) {
    return <div className="rounded-[28px] border border-red-100 bg-red-50 p-8 text-sm font-medium text-red-700 shadow-soft">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            <span>Campaigns</span>
            <span>/</span>
            <span className="text-blue-700">{pipeline.parsed_jd?.role || "Active Search"}</span>
          </div>
          <h1 className="text-4xl font-black text-slate-950">Candidate Pipeline</h1>
          <p className="mt-2 max-w-3xl text-lg text-slate-500">
            Parsed JD skills and candidate profiles are now flowing through matcher and chat simulation, so the shortlist reflects real fit and interest signals.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:shadow-sm">
            Filter
          </button>
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:shadow-sm">
            Score: High-Low
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="glass-panel rounded-[28px] p-6 shadow-soft">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Avg. Match</p>
          <p className="mt-4 text-4xl font-black text-blue-700">{metrics.avgMatch}%</p>
          <p className="mt-2 text-sm text-slate-500">Live average from matcher output</p>
        </div>
        <div className="glass-panel rounded-[28px] p-6 shadow-soft">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">JD Skills</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {metrics.topSkills.length ? (
              metrics.topSkills.slice(0, 4).map((skill) => (
                <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase text-blue-700">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">No skills parsed</span>
            )}
          </div>
        </div>
        <div className="rounded-[28px] bg-gradient-to-br from-blue-700 to-violet-600 p-6 text-white shadow-soft md:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-100">AI Insight</p>
          <p className="mt-4 max-w-xl text-lg font-medium leading-8">
            {metrics.highInterestCount} candidates show strong simulated intent. Match scores are based on parsed JD skills, experience, and inferred domain alignment.
          </p>
        </div>
      </div>

      <CandidateResultsTable candidates={pipeline.candidates} />
    </div>
  );
}
