"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { parseJd } from "@/lib/api";
import { SAMPLE_JD, SAMPLE_JDS, setStoredJdText } from "@/lib/jd-session";

function titleize(values) {
  return values.map((value) =>
    value
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export default function JDParserPanel() {
  const router = useRouter();
  const [jdText, setJdText] = useState(SAMPLE_JD);
  const [selectedSampleId, setSelectedSampleId] = useState(SAMPLE_JDS[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState({
    skills: [],
    experience: 0,
    role: "Software Developer",
    domain: "General",
    summary: "",
  });
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const displaySkills = useMemo(() => titleize(result.skills || []), [result.skills]);

  async function handleAnalyze() {
    if (!jdText.trim()) {
      setError("Please enter a job description to analyze.");
      return;
    }

    setLoading(true);
    setError("");
    setHasAnalyzed(false);

    try {
      const parsed = await parseJd(jdText);
      console.log("Parsed JD result:", parsed);
      setStoredJdText(jdText);
      
      // Ensure all fields are present
      const normalizedResult = {
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        experience: typeof parsed.experience === "number" ? parsed.experience : 0,
        role: parsed.role || "Software Developer",
        domain: parsed.domain || "General",
        summary: parsed.summary || "",
      };
      
      setResult(normalizedResult);
      setHasAnalyzed(true);
    } catch (err) {
      console.error("JD parsing error:", err);
      setError(err.message || "Something went wrong while parsing the JD.");
      setHasAnalyzed(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="glass-panel rounded-[28px] p-6 shadow-soft">
        <div className="relative">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Sample JD Library</p>
              <p className="text-sm text-slate-500">Load one of the added sample job descriptions and run it through the parser.</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedSampleId}
                onChange={(event) => setSelectedSampleId(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              >
                {SAMPLE_JDS.map((sample) => (
                  <option key={sample.id} value={sample.id}>
                    {sample.title}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  const selected = SAMPLE_JDS.find((sample) => sample.id === selectedSampleId);
                  if (selected) {
                    setJdText(selected.text);
                    setStoredJdText(selected.text);
                    setError("");
                  }
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Load Sample
              </button>
            </div>
          </div>

          <textarea
            value={jdText}
            onChange={(event) => setJdText(event.target.value)}
            className="min-h-[360px] w-full resize-none rounded-3xl border border-slate-200 bg-white/70 p-5 text-sm leading-7 text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            placeholder="Paste the job description content here..."
          />
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">Paste a full JD and we&apos;ll extract role, skills, and experience from your backend parser.</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setStoredJdText(jdText);
                  router.push("/candidates");
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <span>View Matches</span>
              </button>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-px hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                <span>{loading ? "Analyzing..." : "Analyze JD"}</span>
              </button>
            </div>
          </div>
          {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-12">
          <h3 className="text-2xl font-bold text-slate-900">Extracted Smart Insights</h3>
          {!hasAnalyzed && (
            <p className="mt-2 text-sm text-slate-500">Click "Analyze JD" above to extract insights from your job description.</p>
          )}
        </div>

        <div className="glass-panel rounded-[28px] p-6 shadow-soft md:col-span-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-50" />
            <div>
              <p className="text-lg font-semibold text-slate-900">Key Skills</p>
              <p className="text-sm text-slate-500">Captured from the JD parser endpoint</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {displaySkills.length ? (
              displaySkills.map((skill) => (
                <span key={skill} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">{hasAnalyzed ? "No skills detected." : "No analysis performed yet."}</p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:col-span-7">
          <div className="glass-panel flex items-center justify-between rounded-[28px] p-6 shadow-soft">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Recommended Role</p>
              <p className="mt-2 text-xl font-bold text-slate-900">{result.role}</p>
            </div>
            <div className="rounded-2xl bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">Role Signal</div>
          </div>

          <div className="glass-panel flex items-center justify-between rounded-[28px] p-6 shadow-soft">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Experience Level</p>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {result.experience > 0 ? `${result.experience}+ Years Professional` : "Not specified"}
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">Experience Signal</div>
          </div>

          <div className="glass-panel flex items-center justify-between rounded-[28px] p-6 shadow-soft">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Domain</p>
              <p className="mt-2 text-xl font-bold text-slate-900">{result.domain}</p>
            </div>
            <div className="rounded-2xl bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">Domain Signal</div>
          </div>
        </div>

        {result.summary && (
          <div className="glass-panel rounded-[28px] p-6 shadow-soft md:col-span-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 mb-3">Summary</p>
            <p className="text-sm text-slate-700 leading-relaxed">{result.summary}</p>
          </div>
        )}
      </section>
    </div>
  );
}
