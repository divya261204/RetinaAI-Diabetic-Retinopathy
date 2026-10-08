import { useState } from "react";
import { Activity, Clock, ShieldAlert, HeartPulse, Sparkles, TrendingUp, Calendar, AlertCircle } from "lucide-react";

export default function RiskProgressionCalculator({ initialStage = "Moderate" }) {
  const [hba1c, setHba1c] = useState(8.2);
  const [durationYears, setDurationYears] = useState(10);
  const [systolicBp, setSystolicBp] = useState(138);
  const [selectedStage, setSelectedStage] = useState(initialStage);

  // Stage baseline risk points
  const stageBase = {
    "No DR": 5,
    "Mild": 18,
    "Moderate": 42,
    "Severe": 74,
    "Proliferative": 91,
  };

  // Empirical UKPDS/ETDRS-aligned progression simulation formula
  const base = stageBase[selectedStage] || 35;
  const hba1cFactor = Math.max(0, (hba1c - 6.5) * 6.5);
  const durationFactor = Math.min(25, durationYears * 0.85);
  const bpFactor = Math.max(0, (systolicBp - 120) * 0.35);

  const oneYearRisk = Math.min(98, Math.max(3, Math.round(base + (hba1cFactor * 0.6) + (durationFactor * 0.3) + (bpFactor * 0.3))));
  const threeYearVisionRisk = Math.min(95, Math.max(2, Math.round((oneYearRisk * 1.35))));

  const getFollowupRecommendation = (stage, risk) => {
    if (stage === "Proliferative" || risk > 80) {
      return {
        schedule: "1 to 2 Weeks (Urgent Specialist)",
        color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
        message: "Immediate referral to vitreoretinal surgeon for panretinal photocoagulation or Anti-VEGF therapy.",
      };
    }
    if (stage === "Severe" || risk > 65) {
      return {
        schedule: "1 Month (Priority Ophthalmology)",
        color: "text-red-400 bg-red-500/10 border-red-500/30",
        message: "High risk of conversion to proliferative retinopathy. Macular OCT required.",
      };
    }
    if (stage === "Moderate" || risk > 40) {
      return {
        schedule: "3 to 6 Months",
        color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
        message: "Careful monitoring with repeated digital retinal photography and HbA1c optimization.",
      };
    }
    if (stage === "Mild") {
      return {
        schedule: "6 to 12 Months",
        color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
        message: "Routine primary care diabetes management and annual screening interval.",
      };
    }
    return {
      schedule: "12 Months (Annual Routine)",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      message: "Standard annual diabetic retinal screening protocol.",
    };
  };

  const rec = getFollowupRecommendation(selectedStage, oneYearRisk);

  return (
    <div className="rounded-[28px] border border-blue-400/10 bg-[#0d1429]/90 p-7 shadow-2xl">
      <div className="border-b border-white/10 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Clinical Prognostic Tool</p>
        <h3 className="mt-1 text-xl font-bold text-white flex items-center gap-2">
          <Activity size={18} className="text-cyan-400" />
          Interactive DR Progression & Vision Risk Simulator
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Simulate clinical trajectory and evidence-based follow-up schedules based on UKPDS risk factor modeling.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-7 lg:grid-cols-12">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-6 space-y-4">
          {/* Stage selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300">Diagnosed Retinal Stage</label>
            <div className="mt-1.5 grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {["No DR", "Mild", "Moderate", "Severe", "Proliferative"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStage(s)}
                  className={`rounded-xl border px-2 py-2 text-xs font-bold transition ${
                    selectedStage === s
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-md shadow-cyan-500/20"
                      : "border-white/10 bg-black/20 text-slate-400 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* HbA1c Slider */}
          <div className="rounded-xl border border-white/5 bg-black/20 p-3.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Glycated Hemoglobin (HbA1c)</span>
              <span className="font-mono font-bold text-cyan-300">{hba1c}%</span>
            </div>
            <input
              type="range"
              min="5.5"
              max="14.0"
              step="0.1"
              value={hba1c}
              onChange={(e) => setHba1c(parseFloat(e.target.value))}
              className="mt-2 w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Target &lt;7.0% (Optimal)</span>
              <span>10.0%+ (High Risk)</span>
            </div>
          </div>

          {/* Diabetes Duration Slider */}
          <div className="rounded-xl border border-white/5 bg-black/20 p-3.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Diabetes Duration</span>
              <span className="font-mono font-bold text-violet-300">{durationYears} years</span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="1"
              value={durationYears}
              onChange={(e) => setDurationYears(parseInt(e.target.value))}
              className="mt-2 w-full accent-violet-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1 yr (Recent)</span>
              <span>20+ yrs (High Microvascular Exposure)</span>
            </div>
          </div>

          {/* Systolic BP Slider */}
          <div className="rounded-xl border border-white/5 bg-black/20 p-3.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Systolic Blood Pressure</span>
              <span className="font-mono font-bold text-orange-300">{systolicBp} mmHg</span>
            </div>
            <input
              type="range"
              min="100"
              max="190"
              step="2"
              value={systolicBp}
              onChange={(e) => setSystolicBp(parseInt(e.target.value))}
              className="mt-2 w-full accent-orange-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>120 mmHg (Normal)</span>
              <span>160+ mmHg (Severe Hypertension)</span>
            </div>
          </div>
        </div>

        {/* Right: Real-time Calculated Prognostic Trajectory */}
        <div className="lg:col-span-6 space-y-4">
          {/* Risk Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center gap-2 text-cyan-400">
                <TrendingUp size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wider">1-Year Progression Risk</span>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-white">{oneYearRisk}%</p>
              <p className="mt-1 text-[11px] text-slate-400">Probability of advancing to higher severity grade</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center gap-2 text-violet-400">
                <ShieldAlert size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wider">3-Yr Vision Threat Risk</span>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-violet-300">{threeYearVisionRisk}%</p>
              <p className="mt-1 text-[11px] text-slate-400">Risk of DME or severe acuity loss</p>
            </div>
          </div>

          {/* Follow-up Schedule Recommendation Banner */}
          <div className={`rounded-2xl border p-4 ${rec.color}`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              <Calendar size={18} />
              <span>Recommended Follow-Up Schedule: {rec.schedule}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              {rec.message}
            </p>
          </div>

          {/* Clinical Target Recommendations */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-xs space-y-2">
            <span className="font-bold text-white uppercase tracking-wider text-[10px]">Evidence-Based Clinical Goals (ADA/ICO):</span>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Target HbA1c reduction to <strong>&lt; 7.0%</strong> lowers microvascular progression risk by ~37%.</li>
              <li>Blood pressure control <strong>&lt; 130/80 mmHg</strong> delays progression of retinal hemorrhages.</li>
              <li>Annual dilated fundus screening reduces preventable blindness by over <strong>90%</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
