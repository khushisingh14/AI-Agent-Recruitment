"use client";

import { useEffect, useState } from "react";

import { fetchCandidateDetail } from "@/lib/api";
import { getStoredJdText } from "@/lib/jd-session";

function MessageBubble({ message }) {
  const isCandidate = message.sender === "candidate";

  return (
    <div className={`flex ${isCandidate ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[78%] rounded-3xl px-4 py-4 text-sm leading-7 shadow-sm",
          isCandidate ? "rounded-tr-md bg-blue-700 text-white" : "rounded-tl-md border border-slate-200 bg-white text-slate-700",
        ].join(" ")}
      >
        <p>{message.text}</p>
        <span className={`mt-2 block text-[11px] ${isCandidate ? "text-blue-100" : "text-slate-400"}`}>{message.time}</span>
      </div>
    </div>
  );
}

export default function CandidateDetailClient({ candidateId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [candidate, setCandidate] = useState(null);
  const [parsedJd, setParsedJd] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCandidate() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchCandidateDetail(candidateId, getStoredJdText());
        if (!cancelled) {
          setCandidate(data.candidate);
          setParsedJd(data.parsed_jd);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load candidate detail.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCandidate();
    return () => {
      cancelled = true;
    };
  }, [candidateId]);

  if (loading) {
    return <div className="rounded-[32px] border border-slate-100 bg-white p-8 text-sm text-slate-500 shadow-soft">Loading candidate conversation...</div>;
  }

  if (error || !candidate) {
    return <div className="rounded-[32px] border border-red-100 bg-red-50 p-8 text-sm font-medium text-red-700 shadow-soft">{error || "Candidate not found."}</div>;
  }

  return (
    <div className="flex h-[calc(100vh-136px)] overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-soft">
      <section className="scrollbar-thin w-full overflow-y-auto border-r border-slate-200 lg:w-[430px]">
        <div className="p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-blue-100 to-indigo-100 text-2xl font-black text-blue-700">
              {candidate.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </div>
            <h2 className="text-3xl font-black text-slate-950">{candidate.name}</h2>
            <p className="mt-1 font-semibold text-blue-700">{candidate.role}</p>
            <div className="mt-3 flex justify-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                {candidate.location}
              </span>
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
                {candidate.salary}
              </span>
            </div>
          </div>

          <div className="mb-6 rounded-[24px] border border-blue-100 bg-blue-50/70 p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">Current JD Match</p>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-4xl font-black text-slate-950">{candidate.matchScore}%</span>
              <span className="pb-1 text-sm font-semibold text-slate-500">{parsedJd?.role || "Role fit"}</span>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Matched skills: {candidate.matchedSkills.length ? candidate.matchedSkills.join(", ") : "none"}.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-slate-900">About</h3>
            <p className="text-sm leading-7 text-slate-500">{candidate.bio}</p>
          </div>

          <div className="mb-8">
            <h3 className="mb-4 text-xl font-bold text-slate-900">Core Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span key={skill} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-xl font-bold text-slate-900">Experience</h3>
            <div className="space-y-6">
              {candidate.timeline.map((item) => (
                <div key={`${item.company}-${item.years}`} className="relative pl-10">
                  <div className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                    <div className="h-2 w-2 rounded-full bg-blue-700" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">{item.years}</p>
                  <h4 className="mt-1 font-semibold text-slate-900">{item.title}</h4>
                  <p className="text-sm font-medium text-blue-700">{item.company}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-w-0 flex-1 flex-col bg-slate-50">
        <div className="glass-panel flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recruiter AI Agent</h3>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Live Match-Aware Conversation</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Interest Level</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-500" style={{ width: `${candidate.interestScore}%` }} />
              </div>
              <span className="font-bold text-blue-700">{candidate.interestScore}%</span>
            </div>
          </div>
        </div>

        <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto p-8">
          <div className="flex justify-center">
            <span className="rounded-full border border-slate-200 bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Today
            </span>
          </div>

          {candidate.messages.map((message, index) => (
            <MessageBubble key={`${candidate.id}-${index}`} message={message} />
          ))}

          <div className="mx-auto max-w-xl rounded-3xl border border-indigo-100 bg-indigo-50/70 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-700">AI Sentiment Analysis</p>
            <p className="mt-2 text-sm leading-7 text-indigo-950">{candidate.insight}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">
              Match score sent to chat simulation: {candidate.matchScore}%
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              placeholder="Type a message or AI instruction..."
            />
            <button className="rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20">
              Send
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
