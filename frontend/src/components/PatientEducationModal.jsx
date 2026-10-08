import { useState } from "react";
import { HeartPulse, Printer, X, ShieldAlert, CheckCircle2, Eye, Sparkles, HelpCircle, AlertTriangle } from "lucide-react";

export default function PatientEducationModal({
  isOpen,
  onClose,
  predictionResult,
}) {
  if (!isOpen || !predictionResult) return null;

  const stage = predictionResult.prediction || "Moderate";
  const patientName = predictionResult.patient_name || "Valued Patient";

  const getPatientSummary = (s) => {
    switch (s) {
      case "No DR":
        return {
          plainText: "Good news! No signs of diabetic eye damage were found in this screening.",
          meaning: "Your retina (the light-sensitive layer at the back of your eye) looks clear and healthy without damaged blood vessels.",
          actionPlan: "Keep up your great routine! Schedule your next annual screening in 12 months.",
        };
      case "Mild":
        return {
          plainText: "Early mild changes (small microaneurysms) were detected in your retina.",
          meaning: "Tiny blood vessels in your eye are showing very early stress from blood sugar levels. Your vision is generally normal at this stage.",
          actionPlan: "Tighten blood sugar control and blood pressure. Schedule a follow-up eye check in 9 to 12 months.",
        };
      case "Moderate":
        return {
          plainText: "Moderate diabetic changes (blood vessel leakage) were identified.",
          meaning: "Several tiny blood vessels have leaked tiny amounts of fluid or blood into the retina. Without management, this can progress and threaten your vision.",
          actionPlan: "See an eye doctor (ophthalmologist) within 3 to 6 months for a dilated exam and specialized retina scan (OCT).",
        };
      case "Severe":
        return {
          plainText: "Significant diabetic eye changes detected. Prompt medical attention needed.",
          meaning: "Many blood vessels in your retina are blocked, depriving the eye of oxygen. There is a high chance this could progress to the advanced stage.",
          actionPlan: "See a retina specialist within 2 to 4 weeks. Laser treatment or specialized medicine may be recommended to protect your vision.",
        };
      case "Proliferative":
        return {
          plainText: "Advanced diabetic retinopathy detected. Urgent treatment required.",
          meaning: "Fragile new blood vessels have grown on the retina and are at high risk of bleeding into your eye or causing vision loss.",
          actionPlan: "URGENT: See a retina specialist immediately (within 1 to 2 weeks). Effective treatments (injections/lasers) can preserve your sight.",
        };
      default:
        return {
          plainText: "Diabetic eye evaluation completed.",
          meaning: "Please review your results with your physician.",
          actionPlan: "Follow your doctor's instructions.",
        };
    }
  };

  const info = getPatientSummary(stage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0d1429] p-6 sm:p-8 text-white shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-bold">
              <HeartPulse size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Patient Eye Health & Care Guide</h3>
              <p className="text-xs text-slate-400">Personalized take-home guide for {patientName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition hover:brightness-110"
            >
              <Printer size={15} />
              Print Guide
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PRINTABLE DISCHARGE GUIDE */}
        <div id="patient-guide-print" className="mt-6 rounded-2xl bg-white p-6 sm:p-8 text-slate-900 shadow-inner space-y-6">
          {/* Header */}
          <div className="border-b-2 border-emerald-600 pb-4">
            <h2 className="text-2xl font-black text-emerald-950">YOUR DIABETIC EYE SCREENING RESULTS</h2>
            <p className="text-xs font-semibold text-slate-500">Prepared for: <strong>{patientName}</strong> | Date: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Results in Plain English */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs uppercase font-bold text-blue-900 tracking-wider">Your Screening Result</p>
            <h3 className="mt-1 text-xl font-extrabold text-blue-950">{stage} Diabetic Retinopathy</h3>
            <p className="mt-2 text-sm font-semibold text-blue-900">{info.plainText}</p>
            <p className="mt-1 text-xs text-blue-800 leading-relaxed">{info.meaning}</p>
          </div>

          {/* Action Steps */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              What You Should Do Next
            </h4>
            <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs text-emerald-950 font-medium">
              {info.actionPlan}
            </div>
          </div>

          {/* Emergency Warning Signs */}
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <h4 className="font-extrabold text-rose-950 text-xs flex items-center gap-1.5 uppercase tracking-wide">
              <AlertTriangle size={15} className="text-rose-600" />
              Urgent Warning Signs — Call an Eye Clinic Immediately If You Experience:
            </h4>
            <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-900">
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600"></span>
                Sudden shower of new dark spots / floaters
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600"></span>
                Flashes of light in either eye
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600"></span>
                A dark shadow or "curtain" pulling across vision
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600"></span>
                Sudden blurriness or loss of vision
              </li>
            </ul>
          </div>

          {/* Daily Eye Protection Habits */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">The "ABC" Habits to Protect Your Vision</h4>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                <strong className="text-slate-900">A — A1c (Blood Sugar)</strong>
                <p className="mt-1 text-slate-600">Aim for HbA1c &lt; 7.0%. Every 1% drop reduces eye disease risk by 35%.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                <strong className="text-slate-900">B — Blood Pressure</strong>
                <p className="mt-1 text-slate-600">Keep BP below 130/80 mmHg to prevent fragile capillaries from leaking.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                <strong className="text-slate-900">C — Checkups</strong>
                <p className="mt-1 text-slate-600">Never skip your scheduled retinal eye exams even if your vision feels fine.</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 text-center">
            RetinaAI Clinical Education Program • For questions regarding your eye care plan, contact your ophthalmology clinic.
          </div>
        </div>
      </div>
    </div>
  );
}
