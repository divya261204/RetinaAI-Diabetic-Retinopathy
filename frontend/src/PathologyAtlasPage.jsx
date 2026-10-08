import { useState } from "react";
import { BookOpen, Search, Eye, AlertTriangle, ShieldCheck, CheckCircle2, Flame, Layers, Sparkles, HelpCircle } from "lucide-react";

export default function PathologyAtlasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);

  const stages = [
    {
      stage: "No Diabetic Retinopathy (Stage 0)",
      short: "Stage 0: Normal",
      etdrsCode: "ETDRS Level 10-20",
      icd10: "E11.9 / Z13.5",
      riskLevel: "Baseline / Normal",
      color: "emerald",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      imageUrl: "/static/samples/sample_stage_0_002c21358ce6.png",
      summary: "Normal healthy retinal fundus with crisp optic disc margins, intact foveal avascular zone (FAZ), and no microvascular abnormalities.",
      hallmarkLesions: [
        "Crisp optic nerve head with well-defined neuroretinal rim (Cup-to-Disc ratio normal).",
        "Uniform, tapering retinal arterioles and venules (A/V ratio approx. 2:3).",
        "Clear, uncompromised macula and central foveal light reflex.",
        "Zero microaneurysms, hemorrhages, or exudates present."
      ],
      pathophysiology: "Endothelial tight junctions in retinal capillaries remain intact without pericyte loss or hyperpermeability.",
      management: "Annual routine diabetic eye screening. Maintain target HbA1c < 7.0% and systolic BP < 130 mmHg.",
      followup: "12 Months"
    },
    {
      stage: "Mild Nonproliferative Retinopathy (Stage 1)",
      short: "Stage 1: Mild NPDR",
      etdrsCode: "ETDRS Level 20-35",
      icd10: "E11.319",
      riskLevel: "Low / Initial Signs",
      color: "yellow",
      badgeColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      imageUrl: "/static/samples/sample_stage_1_0024cdab0c1e.png",
      summary: "Earliest clinically detectable stage of diabetic retinopathy, characterized strictly by the presence of at least one microaneurysm.",
      hallmarkLesions: [
        "Microaneurysms (MAs): Small, round, red outpouchings in capillary walls (15–50 µm diameter).",
        "Occasional small dot hemorrhages in the inner nuclear layer.",
        "Absence of hard exudates, cotton wool spots, or venous beading.",
        "Macula remains typically dry without clinically significant edema."
      ],
      pathophysiology: "Hyperglycemia-induced loss of intramural pericytes weakens capillary walls, leading to localized saccular capillary outpouchings.",
      management: "Patient education, glycemic control optimization, lipid profiling, and blood pressure monitoring.",
      followup: "9 to 12 Months"
    },
    {
      stage: "Moderate Nonproliferative Retinopathy (Stage 2)",
      short: "Stage 2: Moderate NPDR",
      etdrsCode: "ETDRS Level 43-47",
      icd10: "E11.329",
      riskLevel: "Moderate / Action Needed",
      color: "orange",
      badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/30",
      imageUrl: "/static/samples/sample_stage_2_000c1434d8d7.png",
      summary: "Progressive microvascular damage characterized by multiple microaneurysms, flame/blot hemorrhages, hard lipid exudates, and cotton wool spots.",
      hallmarkLesions: [
        "Blot Hemorrhages: Ruptured microaneurysms located in the middle retinal layers.",
        "Hard Exudates: Waxy, yellow lipid and lipoprotein deposits leaking from permeable capillaries.",
        "Cotton Wool Spots (CWS): Fluffy, white patches representing micro-infarctions of the retinal nerve fiber layer (RNFL).",
        "Mild venous caliber irregularities or venous beading in no more than 1 quadrant."
      ],
      pathophysiology: "Breakdown of the inner blood-retinal barrier causes transudation of serum lipids into outer plexiform layer; localized capillary occlusion causes axoplasmic flow stasis (CWS).",
      management: "Referral to general ophthalmologist. Comprehensive dilated fundus examination and baseline macular OCT to screen for diabetic macular edema (DME).",
      followup: "3 to 6 Months"
    },
    {
      stage: "Severe Nonproliferative Retinopathy (Stage 3)",
      short: "Stage 3: Severe NPDR",
      etdrsCode: "ETDRS Level 53",
      icd10: "E11.339",
      riskLevel: "High / Urgent Referral",
      color: "red",
      badgeColor: "bg-red-500/10 text-red-400 border-red-500/30",
      imageUrl: "/static/samples/sample_stage_3_0104b032c141.png",
      summary: "Severe retinal ischemia nearing proliferative conversion. Defined clinically by the ETDRS '4:2:1 Rule'. Over 50% progress to proliferative DR within 1 year without intervention.",
      hallmarkLesions: [
        "4:2:1 Rule: Severe intraretinal hemorrhages in all 4 retinal quadrants.",
        "Definite venous beading (sausage-like dilatation) in 2 or more quadrants.",
        "Intraretinal Microvascular Abnormalities (IRMA) in at least 1 quadrant.",
        "Extensive capillary nonperfusion and deep retinal ischemia."
      ],
      pathophysiology: "Widespread capillary closure and ischemic hypoxia stimulate intense production of Vascular Endothelial Growth Factor (VEGF-A) by retinal pigment epithelium and Müller cells.",
      management: "High-priority ophthalmic referral (within 2–4 weeks). Evaluation for prophylactic panretinal photocoagulation (PRP) or Anti-VEGF injections.",
      followup: "1 to 2 Months"
    },
    {
      stage: "Proliferative Diabetic Retinopathy (Stage 4)",
      short: "Stage 4: Proliferative (PDR)",
      etdrsCode: "ETDRS Level 61-85",
      icd10: "E11.359",
      riskLevel: "Critical / Emergency",
      color: "rose",
      badgeColor: "bg-rose-600/20 text-rose-300 border-rose-500/30",
      imageUrl: "/static/samples/sample_stage_4_001639a390f0.png",
      summary: "Advanced sight-threatening stage characterized by pathologic new blood vessel growth (neovascularization) that can cause catastrophic vitreous hemorrhage or tractional retinal detachment.",
      hallmarkLesions: [
        "Neovascularization of the Disc (NVD) or Elsewhere (NVE): Fragile, abnormal new capillaries extending along the retinal surface.",
        "Preretinal (boat-shaped) or Vitreous Hemorrhage due to rupture of fragile new vessels.",
        "Fibrovascular tissue proliferation along posterior hyaloid face.",
        "High risk of Tractional Retinal Detachment (TRD) and Neovascular Glaucoma."
      ],
      pathophysiology: "Extreme retinal ischemia drives pathological angiogenesis. New vessels lack mature pericytes and tight junctions, hemorrhaging easily into the vitreous body.",
      management: "Emergency vitreoretinal surgical referral (within 1 week). Immediate Panretinal Photocoagulation (PRP), intravitreal Anti-VEGF (Aflibercept/Ranibizumab/Faricimab), and pars plana vitrectomy for non-clearing vitreous hemorrhage.",
      followup: "1 to 2 Weeks"
    }
  ];

  const filteredStages = stages.filter(
    (s) =>
      s.stage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.hallmarkLesions.some((l) => l.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const active = stages[selectedStageIndex];

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-12">
      {/* Header */}
      <section className="rounded-[30px] border border-blue-400/10 bg-gradient-to-br from-[#10265a] via-[#14296c] to-[#24105a] p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
            <BookOpen size={27} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Clinical Reference Guide</p>
            <h1 className="mt-1 text-3xl font-extrabold text-white">Retinal Pathology Atlas & ETDRS Criteria</h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Comprehensive ophthalmic classification guide based on the International Clinical Diabetic Retinopathy Disease Severity Scale (ICDR) and Early Treatment Diabetic Retinopathy Study (ETDRS).
        </p>
      </section>

      {/* Stage Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 rounded-2xl border border-white/10 bg-[#0d1429]/90 p-3 shadow-2xl">
        {stages.map((s, idx) => (
          <button
            key={s.short}
            type="button"
            onClick={() => setSelectedStageIndex(idx)}
            className={`rounded-xl px-3 py-3 text-xs font-bold text-center transition ${
              selectedStageIndex === idx
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                : "border border-white/5 bg-black/20 text-slate-400 hover:text-white"
            }`}
          >
            {s.short}
          </button>
        ))}
      </div>

      {/* Active Stage Detailed Breakdown */}
      <div className="rounded-[28px] border border-white/10 bg-[#0d1429]/90 p-8 shadow-2xl space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Clinical Diagnostic Profile</span>
            <h2 className="text-2xl font-extrabold text-white mt-1">{active.stage}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-slate-300 font-mono font-bold">
                {active.etdrsCode}
              </span>
              <span className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-cyan-300 font-mono font-bold">
                ICD-10: {active.icd10}
              </span>
            </div>
          </div>

          <div className={`rounded-2xl border px-4 py-2 text-xs font-extrabold text-right ${active.badgeColor}`}>
            Risk Level: {active.riskLevel}
            <p className="text-[10px] font-normal opacity-80 mt-0.5">Follow-up: {active.followup}</p>
          </div>
        </div>

        {/* Main Grid: Fundus Photo vs Hallmarks */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 items-start">
          {/* Left: Fundus Scan Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="overflow-hidden rounded-2xl border border-cyan-400/20 bg-black/60 p-4 shadow-inner w-full max-w-[360px]">
              <img
                src={active.imageUrl}
                alt={active.stage}
                className="mx-auto aspect-square max-h-72 w-full rounded-xl object-contain shadow-lg"
              />
              <p className="mt-3 text-center text-xs font-semibold text-slate-400">
                Representative Fundus Photograph ({active.short})
              </p>
            </div>
          </div>

          {/* Right: Pathological Hallmarks & Mechanism */}
          <div className="lg:col-span-7 space-y-5">
            {/* Overview Summary */}
            <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Clinical Summary</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-200">{active.summary}</p>
            </div>

            {/* Hallmark Pathological Lesions */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Pathological Hallmarks & Lesions</h4>
              <ul className="mt-2 space-y-2 text-xs text-slate-300">
                {active.hallmarkLesions.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 rounded-xl bg-white/[0.02] border border-white/5 p-2.5">
                    <CheckCircle2 size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cellular Pathophysiology */}
            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/5 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-violet-300">Microvascular Pathophysiology</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{active.pathophysiology}</p>
            </div>

            {/* Recommended Clinical Management */}
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Standard Clinical Management & Intervention</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{active.management}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
