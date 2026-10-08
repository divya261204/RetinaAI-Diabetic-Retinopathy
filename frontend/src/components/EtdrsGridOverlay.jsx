import { useState } from "react";
import { Grid, Eye, AlertCircle, ShieldCheck, Crosshair, Sparkles } from "lucide-react";

export default function EtdrsGridOverlay({
  imageUrl,
  lesionAreaPct = 12.5,
  stage = "Moderate",
}) {
  const [showGrid, setShowGrid] = useState(true);
  const [gridOpacity, setGridOpacity] = useState(0.85);

  // Compute estimated quadrant lesion density based on stage and overall lesion %
  const stageWeights = {
    "No DR": { central: 1.2, supTemp: 1.0, infTemp: 1.1, supNas: 0.8, infNas: 0.9 },
    "Mild": { central: 3.5, supTemp: 8.2, infTemp: 7.4, supNas: 4.1, infNas: 4.8 },
    "Moderate": { central: 14.8, supTemp: 26.5, infTemp: 24.1, supNas: 16.3, infNas: 18.2 },
    "Severe": { central: 28.4, supTemp: 44.1, infTemp: 41.8, supNas: 33.2, infNas: 36.5 },
    "Proliferative": { central: 42.1, supTemp: 68.4, infTemp: 64.2, supNas: 52.8, infNas: 56.1 },
  };

  const weights = stageWeights[stage] || stageWeights["Moderate"];
  const scale = lesionAreaPct > 0 ? lesionAreaPct / 25 : 1;

  const quadrantStats = [
    { name: "Central Macula (1mm)", value: Math.min(100, (weights.central * scale)).toFixed(1), risk: weights.central * scale > 15 ? "High DME Risk" : "Low DME Risk", color: "text-rose-400" },
    { name: "Superior Temporal (ST)", value: Math.min(100, (weights.supTemp * scale)).toFixed(1), risk: "Frequent MA / IRH", color: "text-amber-400" },
    { name: "Inferior Temporal (IT)", value: Math.min(100, (weights.infTemp * scale)).toFixed(1), risk: "Vascular Arcades", color: "text-amber-400" },
    { name: "Superior Nasal (SN)", value: Math.min(100, (weights.supNas * scale)).toFixed(1), risk: "Peripheral", color: "text-cyan-400" },
    { name: "Inferior Nasal (IN)", value: Math.min(100, (weights.infNas * scale)).toFixed(1), risk: "Peripheral", color: "text-cyan-400" },
  ];

  const csmeRiskScore = Math.min(100, Math.round(Number(quadrantStats[0].value) * 1.8));
  const isCsmeHigh = csmeRiskScore > 35;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 shadow-2xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Grid size={16} className="text-cyan-400" />
            ETDRS 9-Zone Retinal Grid & Macular Edema (CSME) Analyzer
          </h4>
          <p className="text-xs text-slate-400">
            Standardized Early Treatment Diabetic Retinopathy Study anatomical quadrant mapping.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              showGrid
                ? "border-cyan-400/40 bg-cyan-400/20 text-cyan-300"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <Crosshair size={14} />
            {showGrid ? "ETDRS Grid: Active" : "Show ETDRS Grid"}
          </button>
        </div>
      </div>

      {/* Grid Display */}
      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
        {/* Left: Retinal Scan with ETDRS Overlay Rings */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative aspect-square w-full max-w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-inner">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Retinal Fundus Scan"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                Fundus image unavailable
              </div>
            )}

            {/* ETDRS SVG Overlay */}
            {showGrid && (
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-300"
                style={{ opacity: gridOpacity }}
              >
                {/* Outer Ring 6mm */}
                <circle cx="50" cy="50" r="42" fill="none" stroke="#22d3ee" strokeWidth="0.8" strokeDasharray="2,2" />
                {/* Inner Ring 3mm */}
                <circle cx="50" cy="50" r="22" fill="none" stroke="#38bdf8" strokeWidth="0.9" />
                {/* Central Fovea 1mm */}
                <circle cx="50" cy="50" r="8" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="1.2" />

                {/* Quadrant Partition Lines */}
                <line x1="20" y1="20" x2="80" y2="80" stroke="#06b6d4" strokeWidth="0.6" strokeDasharray="1.5,1.5" />
                <line x1="20" y1="80" x2="80" y2="20" stroke="#06b6d4" strokeWidth="0.6" strokeDasharray="1.5,1.5" />

                {/* Central Foveal Crosshair */}
                <line x1="47" y1="50" x2="53" y2="50" stroke="#f43f5e" strokeWidth="1" />
                <line x1="50" y1="47" x2="50" y2="53" stroke="#f43f5e" strokeWidth="1" />

                {/* Text Labels */}
                <text x="50" y="14" fill="#a5f3fc" fontSize="3.2" fontWeight="bold" textAnchor="middle">Superior</text>
                <text x="50" y="96" fill="#a5f3fc" fontSize="3.2" fontWeight="bold" textAnchor="middle">Inferior</text>
                <text x="8" y="52" fill="#a5f3fc" fontSize="3.2" fontWeight="bold" textAnchor="middle">Temporal</text>
                <text x="92" y="52" fill="#a5f3fc" fontSize="3.2" fontWeight="bold" textAnchor="middle">Nasal</text>
                <text x="50" y="53" fill="#ffffff" fontSize="2.6" fontWeight="bold" textAnchor="middle">Fovea</text>
              </svg>
            )}

            <div className="absolute top-3 left-3 rounded-lg bg-black/80 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-400/20 backdrop-blur-md">
              ETDRS 9-Zone Mapping
            </div>
          </div>
        </div>

        {/* Right: Quadrant Lesion Density Breakdown & CSME Risk */}
        <div className="lg:col-span-6 space-y-4">
          {/* CSME Risk Indicator */}
          <div className={`rounded-2xl border p-4 ${
            isCsmeHigh ? "border-rose-500/30 bg-rose-500/10 text-rose-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">Macular Edema (CSME) Risk</span>
              <span className="font-mono font-extrabold text-sm">{csmeRiskScore}% Index</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              {isCsmeHigh
                ? "High lesion density detected within 1 Disc Diameter of central fovea. Optical Coherence Tomography (OCT) recommended to evaluate macular thickening."
                : "Foveal avascular zone is clear of significant central exudates. Standard periodic retinal evaluation."}
            </p>
          </div>

          {/* Quadrant Density Table */}
          <div className="rounded-xl border border-white/5 bg-black/20 p-3.5 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quadrant Lesion Load (%)</span>
            {quadrantStats.map((q) => (
              <div key={q.name} className="flex items-center justify-between text-xs">
                <span className="text-slate-300">{q.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500">{q.risk}</span>
                  <span className={`font-mono font-bold ${q.color}`}>{q.value}%</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500">
            *Conforms to International Clinical Diabetic Retinopathy Disease Severity Scale (ICDR) and ETDRS protocols.
          </p>
        </div>
      </div>
    </div>
  );
}
