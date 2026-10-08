import { useState, useEffect } from "react";
import { GitCompare, Calendar, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, Activity, ShieldCheck, Download, Eye } from "lucide-react";

export default function LongitudinalTrackerPage() {
  const backendUrl = typeof window !== "undefined" && window.location.port === "5173" ? "http://127.0.0.1:8000" : "";

  const presetCases = [
    {
      id: "case_1",
      title: "Patient A: Progressive Disease (Mild → Moderate NPDR)",
      patientName: "Robert Miller",
      patientId: "PAT-LONG-01",
      visit1: {
        date: "2025-04-12",
        stage: "Mild",
        confidence: 86.4,
        lesionArea: 6.2,
        imageUrl: "/static/samples/sample_stage_1_0024cdab0c1e.png",
        hba1c: 7.4,
      },
      visit2: {
        date: "2026-02-18",
        stage: "Moderate",
        confidence: 89.1,
        lesionArea: 18.5,
        imageUrl: "/static/samples/sample_stage_2_000c1434d8d7.png",
        hba1c: 8.8,
      },
      trajectory: "Progression (+12.3% Lesion Expansion)",
      recommendation: "Disease transitioned across ETDRS threshold. Intensify glycemic management and schedule 3-month ophthalmic follow-up.",
      urgencyColor: "border-orange-500/30 bg-orange-500/10 text-orange-300",
    },
    {
      id: "case_2",
      title: "Patient B: Stable Glycemic Control (Moderate NPDR Stable)",
      patientName: "Elena Rostova",
      patientId: "PAT-LONG-02",
      visit1: {
        date: "2025-01-10",
        stage: "Moderate",
        confidence: 88.2,
        lesionArea: 16.8,
        imageUrl: "/static/samples/sample_stage_2_000c1434d8d7.png",
        hba1c: 8.2,
      },
      visit2: {
        date: "2026-01-15",
        stage: "Moderate",
        confidence: 87.5,
        lesionArea: 15.9,
        imageUrl: "/static/samples/sample_stage_2_000c1434d8d7.png",
        hba1c: 7.1,
      },
      trajectory: "Stable / Non-Progressive (-0.9% Lesion Area)",
      recommendation: "Patient exhibits stable microvascular lesions following improved HbA1c control. Maintain 6-month routine screening.",
      urgencyColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    },
    {
      id: "case_3",
      title: "Patient C: Rapid Progression to Proliferative DR (Severe → PDR)",
      patientName: "David Chen",
      patientId: "PAT-LONG-03",
      visit1: {
        date: "2025-08-20",
        stage: "Severe",
        confidence: 91.0,
        lesionArea: 28.4,
        imageUrl: "/static/samples/sample_stage_3_0104b032c141.png",
        hba1c: 9.6,
      },
      visit2: {
        date: "2026-03-02",
        stage: "Proliferative",
        confidence: 94.7,
        lesionArea: 44.8,
        imageUrl: "/static/samples/sample_stage_4_001639a390f0.png",
        hba1c: 10.4,
      },
      trajectory: "Critical Progression (Neovascularization Triggered)",
      recommendation: "Rapid conversion to proliferative retinopathy with high risk of vitreous hemorrhage. Urgent vitreoretinal referral within 1 week for PRP evaluation.",
      urgencyColor: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    },
  ];

  const [selectedCaseId, setSelectedCaseId] = useState("case_1");
  const activeCase = presetCases.find((c) => c.id === selectedCaseId) || presetCases[0];

  const deltaLesion = (activeCase.visit2.lesionArea - activeCase.visit1.lesionArea).toFixed(1);
  const deltaHba1c = (activeCase.visit2.hba1c - activeCase.visit1.hba1c).toFixed(1);

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-12">
      {/* Header */}
      <section className="rounded-[30px] border border-blue-400/10 bg-gradient-to-br from-[#10265a] via-[#14296c] to-[#24105a] p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <GitCompare size={27} className="text-slate-950 font-black" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Longitudinal Ophthalmology</p>
            <h1 className="mt-1 text-3xl font-extrabold text-white">Multi-Visit Disease Progression Tracker</h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Compare sequential retinal fundus screenings over time to monitor lesion expansion, evaluate therapy response, and detect rapid progression to proliferative retinopathy.
        </p>
      </section>

      {/* Case Selector Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#0d1429]/90 p-3 shadow-2xl">
        <span className="text-xs font-bold text-slate-400 self-center px-2">Select Longitudinal Cohort:</span>
        {presetCases.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCaseId(c.id)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              selectedCaseId === c.id
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "border border-white/5 bg-black/20 text-slate-400 hover:text-white"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Patient Trajectory Header Card */}
      <div className="rounded-[28px] border border-white/10 bg-[#0d1429]/90 p-7 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Patient Cohort Record</span>
            <h3 className="text-xl font-bold text-white">{activeCase.patientName} ({activeCase.patientId})</h3>
          </div>

          <div className={`rounded-2xl border px-4 py-2 font-bold text-xs ${activeCase.urgencyColor}`}>
            Trajectory: {activeCase.trajectory}
          </div>
        </div>

        {/* Delta Key Metrics Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
            <span className="text-[10px] uppercase text-slate-500 font-bold">Baseline Visit</span>
            <p className="mt-1 text-lg font-extrabold text-white">{activeCase.visit1.stage}</p>
            <p className="text-xs text-slate-400 font-mono">{activeCase.visit1.date}</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
            <span className="text-[10px] uppercase text-slate-500 font-bold">Follow-Up Visit</span>
            <p className="mt-1 text-lg font-extrabold text-cyan-300">{activeCase.visit2.stage}</p>
            <p className="text-xs text-slate-400 font-mono">{activeCase.visit2.date}</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
            <span className="text-[10px] uppercase text-slate-500 font-bold">Δ Lesion Area</span>
            <p className={`mt-1 text-lg font-extrabold font-mono ${Number(deltaLesion) > 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {Number(deltaLesion) > 0 ? `+${deltaLesion}%` : `${deltaLesion}%`}
            </p>
            <p className="text-xs text-slate-400">Retinal field coverage</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
            <span className="text-[10px] uppercase text-slate-500 font-bold">Δ HbA1c Level</span>
            <p className={`mt-1 text-lg font-extrabold font-mono ${Number(deltaHba1c) > 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {Number(deltaHba1c) > 0 ? `+${deltaHba1c}%` : `${deltaHba1c}%`}
            </p>
            <p className="text-xs text-slate-400">{activeCase.visit1.hba1c}% → {activeCase.visit2.hba1c}%</p>
          </div>
        </div>

        {/* Side-by-Side Photographic Comparison */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Visit 1 Scan */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            <div className="border-b border-white/10 px-5 py-3.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">Baseline Visit: {activeCase.visit1.date}</p>
                <p className="text-xs text-slate-400">Classification: <strong className="text-cyan-300">{activeCase.visit1.stage}</strong> ({activeCase.visit1.confidence}%)</p>
              </div>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold text-blue-400">Visit 1</span>
            </div>
            <div className="p-4 flex items-center justify-center">
              <img
                src={activeCase.visit1.imageUrl}
                alt="Visit 1 Scan"
                className="max-h-72 w-full rounded-xl object-contain shadow-lg"
              />
            </div>
          </div>

          {/* Visit 2 Scan */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            <div className="border-b border-white/10 px-5 py-3.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">Follow-Up Visit: {activeCase.visit2.date}</p>
                <p className="text-xs text-slate-400">Classification: <strong className="text-cyan-300">{activeCase.visit2.stage}</strong> ({activeCase.visit2.confidence}%)</p>
              </div>
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold text-cyan-400">Visit 2</span>
            </div>
            <div className="p-4 flex items-center justify-center">
              <img
                src={activeCase.visit2.imageUrl}
                alt="Visit 2 Scan"
                className="max-h-72 w-full rounded-xl object-contain shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Clinical Action Recommendation */}
        <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-500/5 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-cyan-300">
              <Activity size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Longitudinal Trajectory Assessment</h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                {activeCase.recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
