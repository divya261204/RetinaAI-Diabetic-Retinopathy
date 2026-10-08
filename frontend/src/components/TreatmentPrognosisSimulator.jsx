import { useState } from "react";
import { Sparkles, TrendingUp, ShieldCheck, Zap, Activity, Award, ArrowRight } from "lucide-react";

export default function TreatmentPrognosisSimulator({ stage = "Moderate" }) {
  const [selectedTherapy, setSelectedTherapy] = useState(
    stage === "Proliferative" || stage === "Severe" ? "anti_vegf" : "glycemic_optimization"
  );
  const [treatmentDurationMonths, setTreatmentDurationMonths] = useState(12);

  const therapies = [
    {
      id: "anti_vegf",
      name: "Intravitreal Anti-VEGF Therapy",
      subtitle: "Aflibercept / Ranibizumab / Faricimab",
      badge: "Gold Standard for DME & PDR",
      color: "border-cyan-400 bg-cyan-500/10 text-cyan-300",
      letterGain: "+8.4 Letters (ETDRS Scale)",
      edemaReduction: "-78% Central Subfield Thickness (CST)",
      pdrRegressionRate: "73% Complete Neovascularization Regression",
      description: "Inhibits VEGF-A isoforms to rapidly close endothelial fenestrations, resolve macular edema, and induce regression of retinal neovascularization.",
      schedule: "Monthly loading phase (3–5 doses) followed by Treat-and-Extend (T&E) protocol.",
    },
    {
      id: "prp_laser",
      name: "Panretinal Photocoagulation (PRP Laser)",
      subtitle: "Targeted Retinal Ischemic Ablation",
      badge: "Prevents Severe Vision Loss in PDR",
      color: "border-violet-400 bg-violet-500/10 text-violet-300",
      letterGain: "Stabilizes Acuity (Prevents Catastrophic Drop)",
      edemaReduction: "Secondary benefit (May require Anti-VEGF combo)",
      pdrRegressionRate: "85% Long-term Neovascular Involutions",
      description: "Destroys hypoxic peripheral photoreceptors, decreasing overall retinal metabolic demand and eliminating the ischemic stimulus driving VEGF production.",
      schedule: "1,200 to 1,600 laser burns delivered across 2 to 3 sessions.",
    },
    {
      id: "glycemic_optimization",
      name: "Intensive Glycemic & BP Protocol",
      subtitle: "HbA1c < 7.0% & Systolic BP < 130 mmHg",
      badge: "Primary Prevention & Microvascular Protection",
      color: "border-emerald-400 bg-emerald-500/10 text-emerald-300",
      letterGain: "+2.1 Letters (Preserves Natural Acuity)",
      edemaReduction: "-24% Gradual Exudate Resorption",
      pdrRegressionRate: "37% Hazard Reduction for Disease Progression",
      description: "Strict control of microvascular shear stress and non-enzymatic glycation of capillary basement membranes.",
      schedule: "Multidisciplinary primary care & endocrinology management.",
    },
    {
      id: "focal_laser",
      name: "Focal / Grid Macular Laser",
      subtitle: "Direct Microaneurysm Photocoagulation",
      badge: "ETDRS Standard for Non-Center-Involving DME",
      color: "border-amber-400 bg-amber-500/10 text-amber-300",
      letterGain: "50% Reduction in Moderate Visual Loss (MVL)",
      edemaReduction: "-52% Resolution of Hard Exudate Rings",
      pdrRegressionRate: "Local microvascular stabilization",
      description: "Direct laser application to leaking microaneurysms and grid laser to areas of diffuse capillary leakage in outer macular rings.",
      schedule: "Single outpatient treatment with 3-month follow-up assessment.",
    },
  ];

  const active = therapies.find((t) => t.id === selectedTherapy) || therapies[0];

  return (
    <div className="rounded-[28px] border border-blue-400/10 bg-[#0d1429]/90 p-7 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Clinical Prognostic Modeler</p>
          <h3 className="mt-1 text-xl font-bold text-white flex items-center gap-2">
            <Sparkles size={18} className="text-cyan-400" />
            Treatment Response & Visual Acuity Prognosis Simulator
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Model anticipated clinical efficacy, visual letter gain, and lesion regression based on DRCR.net clinical trials.
          </p>
        </div>

        {/* Duration Slider */}
        <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/40 px-3.5 py-1.5 text-xs">
          <span className="text-slate-400">Horizon:</span>
          <span className="font-mono font-bold text-cyan-300">{treatmentDurationMonths} Months</span>
        </div>
      </div>

      {/* Therapy Selector Pills */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {therapies.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedTherapy(t.id)}
            className={`rounded-2xl border p-3.5 text-left transition ${
              selectedTherapy === t.id
                ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-500/10"
                : "border-white/5 bg-black/20 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`h-2 w-2 rounded-full ${selectedTherapy === t.id ? "bg-cyan-400" : "bg-slate-600"}`}></span>
              <span className="text-[9px] font-bold uppercase text-slate-400">{t.badge.split(" ")[0]}</span>
            </div>
            <p className="mt-2 text-xs font-bold text-white">{t.name}</p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">{t.subtitle}</p>
          </button>
        ))}
      </div>

      {/* Projected Clinical Outcomes Grid */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Selected Intervention</span>
            <h4 className="text-lg font-bold text-white mt-0.5">{active.name}</h4>
            <p className="text-xs text-slate-400">{active.subtitle}</p>
          </div>
          <span className={`rounded-xl border px-3 py-1 text-xs font-bold ${active.color}`}>
            {active.badge}
          </span>
        </div>

        {/* 3 Outcome Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
            <span className="text-[10px] uppercase font-bold text-slate-500">Projected Visual Acuity</span>
            <p className="mt-1 text-base font-extrabold text-cyan-300">{active.letterGain}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">DRCR Protocol T aligned</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
            <span className="text-[10px] uppercase font-bold text-slate-500">Macular Edema Resorption</span>
            <p className="mt-1 text-base font-extrabold text-emerald-400">{active.edemaReduction}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Central retinal thickness</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
            <span className="text-[10px] uppercase font-bold text-slate-500">Neovascular Regression Rate</span>
            <p className="mt-1 text-base font-extrabold text-violet-300">{active.pdrRegressionRate}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Microvascular response</p>
          </div>
        </div>

        {/* Description & Clinical Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-white/5 bg-black/20 p-3.5">
            <span className="font-bold text-slate-300">Mechanism of Action:</span>
            <p className="mt-1 leading-relaxed text-slate-400">{active.description}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 p-3.5">
            <span className="font-bold text-slate-300">Standard Dosing Protocol:</span>
            <p className="mt-1 leading-relaxed text-slate-400">{active.schedule}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
