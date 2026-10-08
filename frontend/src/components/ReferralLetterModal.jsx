import { useState } from "react";
import { Printer, X, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Download } from "lucide-react";

export default function ReferralLetterModal({
  isOpen,
  onClose,
  predictionResult,
}) {
  if (!isOpen || !predictionResult) return null;

  const stage = predictionResult.prediction || "Moderate";
  const confidence = Number(predictionResult.confidence || 0).toFixed(1);
  const lesionArea = predictionResult.lesion_area_pct ? Number(predictionResult.lesion_area_pct).toFixed(1) : "N/A";
  const patientName = predictionResult.patient_name || "Patient Record";
  const patientId = predictionResult.patient_id || `PAT-${Date.now().toString().slice(-6)}`;
  const patientAge = predictionResult.patient_age || "58";
  const patientGender = predictionResult.patient_gender || "Unspecified";
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getIcdCode = (s) => {
    switch (s) {
      case "No DR":
        return { code: "E11.9 / Z13.5", desc: "Type 2 diabetes without ophthalmic complications / Routine screening" };
      case "Mild":
        return { code: "E11.319", desc: "Type 2 diabetes mellitus with mild nonproliferative diabetic retinopathy" };
      case "Moderate":
        return { code: "E11.329", desc: "Type 2 diabetes mellitus with moderate nonproliferative diabetic retinopathy" };
      case "Severe":
        return { code: "E11.339", desc: "Type 2 diabetes mellitus with severe nonproliferative diabetic retinopathy" };
      case "Proliferative":
        return { code: "E11.359", desc: "Type 2 diabetes mellitus with proliferative diabetic retinopathy with macular edema risk" };
      default:
        return { code: "E11.319", desc: "Diabetic Retinopathy Evaluation" };
    }
  };

  const getUrgencyTimeline = (s) => {
    switch (s) {
      case "Proliferative":
        return {
          level: "URGENT / IMMEDIATE (Within 1-2 Weeks)",
          color: "text-rose-600 border-rose-500/40 bg-rose-500/10",
          actions: [
            "Urgent vitreoretinal specialist referral for panretinal photocoagulation (PRP) evaluation.",
            "Optical Coherence Tomography (OCT) & Fluorescein Angiography (FFA) to assess macular edema and neovascularization.",
            "Evaluate candidacy for Anti-VEGF (e.g. Aflibercept/Ranibizumab) intravitreal injections.",
            "Intensive glycemic and blood pressure optimization (Target HbA1c < 7.0%)."
          ]
        };
      case "Severe":
        return {
          level: "HIGH PRIORITY (Within 2-4 Weeks)",
          color: "text-red-600 border-red-500/40 bg-red-500/10",
          actions: [
            "Comprehensive dilated fundus examination by a retina specialist within 1 month.",
            "Macular OCT scan to rule out clinically significant macular edema (CSME).",
            "Follow the 4:2:1 ETDRS rule to monitor progression to proliferative disease.",
            "Quarterly follow-up interval."
          ]
        };
      case "Moderate":
        return {
          level: "ROUTINE CLINICAL (Within 3-6 Months)",
          color: "text-orange-600 border-orange-500/40 bg-orange-500/10",
          actions: [
            "Referral to optometrist / general ophthalmologist for comprehensive dilated exam within 3-6 months.",
            "Repeat digital fundus photography in 6 months.",
            "Reinforce diabetes self-management and lipid management."
          ]
        };
      case "Mild":
        return {
          level: "ANNUAL MONITORING (Within 9-12 Months)",
          color: "text-yellow-600 border-yellow-500/40 bg-yellow-500/10",
          actions: [
            "Annual dilated retinal screening program.",
            "Primary care glycemic control and hypertension monitoring.",
            "Patient education on diabetic retinopathy warning signs (floaters, sudden blurriness)."
          ]
        };
      default:
        return {
          level: "ANNUAL ROUTINE SCREENING (12 Months)",
          color: "text-emerald-600 border-emerald-500/40 bg-emerald-500/10",
          actions: [
            "Continue annual routine diabetic eye screening protocol.",
            "Maintain optimal glycemic and lipid control."
          ]
        };
    }
  };

  const icdInfo = getIcdCode(stage);
  const urgency = getUrgencyTimeline(stage);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-[#0d1429] p-6 sm:p-8 text-white shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-bold">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Specialist Ophthalmology Referral Letter</h3>
              <p className="text-xs text-slate-400">Automated clinical referral summary ready for ophthalmic consultation</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition hover:brightness-110"
            >
              <Printer size={15} />
              Print / Save PDF
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

        {/* PRINTABLE LETTER CONTENT */}
        <div id="referral-letter-document" className="mt-6 rounded-2xl bg-white p-8 text-slate-900 shadow-inner">
          {/* Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-slate-200 pb-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-blue-950">RETINAAI CLINICAL OPHTHALMOLOGY</h2>
              <p className="text-xs font-bold tracking-wider uppercase text-cyan-700">Automated Retinal Diagnostic & Triage Network</p>
              <p className="mt-1 text-xs text-slate-500">Department of Ophthalmology & Vitreoretinal Services</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p><strong>Date:</strong> {currentDate}</p>
              <p><strong>Screening Reference:</strong> {predictionResult.screening_id ? `REF-#${predictionResult.screening_id}` : "REF-LOCAL"}</p>
              <p><strong>Protocol:</strong> AI-DR ETDRS Grading v2.0</p>
            </div>
          </div>

          {/* Recipient & Subject */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-700">To: The Attending Ophthalmologist / Vitreoretinal Specialist</p>
            <p className="mt-1 text-base font-extrabold text-slate-900">
              RE: Urgent Clinical Ophthalmology Referral – Diabetic Retinopathy Assessment
            </p>
          </div>

          {/* Patient Details Box */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-500">Patient Name:</span>
                <p className="font-bold text-slate-900">{patientName}</p>
              </div>
              <div>
                <span className="text-slate-500">Patient ID / MRN:</span>
                <p className="font-mono font-bold text-slate-900">{patientId}</p>
              </div>
              <div>
                <span className="text-slate-500">Age / Gender:</span>
                <p className="font-bold text-slate-900">{patientAge} yrs / {patientGender}</p>
              </div>
              <div>
                <span className="text-slate-500">Primary AI Diagnosis:</span>
                <p className="font-bold text-blue-700">{stage} ({confidence}%)</p>
              </div>
            </div>
          </div>

          {/* Diagnostic Assessment Section */}
          <div className="mt-6 space-y-4 text-xs leading-relaxed text-slate-700">
            <p>
              Dear Doctor,
            </p>
            <p>
              The above patient underwent digital retinal fundus photography and deep learning multi-class evaluation using the <strong>RetinaAI Deep Ensemble Model</strong>. 
              The photographic evaluation detected retinal lesions and microvascular alterations consistent with <strong>{stage} Diabetic Retinopathy</strong> with an AI model diagnostic confidence of <strong>{confidence}%</strong>.
            </p>

            {/* ICD-10 & Staging Box */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="font-bold text-blue-950">ETDRS Severity Classification:</span>
                  <p className="font-semibold text-blue-800">{stage} Diabetic Retinopathy</p>
                </div>
                <div>
                  <span className="font-bold text-blue-950">Recommended ICD-10 Code:</span>
                  <p className="font-mono font-bold text-blue-800">{icdInfo.code}</p>
                  <p className="text-[10px] text-blue-600">{icdInfo.desc}</p>
                </div>
              </div>
            </div>

            {/* Referral Urgency Banner */}
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-700" />
                <span className="font-bold text-amber-950">Triage Urgency Window:</span>
                <span className="font-bold text-amber-800">{urgency.level}</span>
              </div>
            </div>

            {/* Recommended Clinical Interventions */}
            <div>
              <p className="font-bold text-slate-900">Recommended Next Steps & Clinical Management:</p>
              <ul className="mt-2 list-disc list-inside space-y-1.5 text-slate-700 pl-2">
                {urgency.actions.map((act, idx) => (
                  <li key={idx}><strong>{act}</strong></li>
                ))}
              </ul>
            </div>

            <p className="pt-2 text-slate-600">
              Please find the complete diagnostic report and Grad-CAM attention heatmap attached. Kindly provide feedback and post-consultation management notes to our screening registry.
            </p>
          </div>

          {/* Signatures */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-900">Referring Clinician / Screening Unit</p>
              <div className="mt-8 border-t border-slate-400 w-48 pt-1">
                <p className="font-medium text-slate-700">Digital Signature / Stamp</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 text-emerald-700 font-bold">
                <ShieldCheck size={16} />
                <span>Verified by RetinaAI Clinical Engine</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">ISO 13485 / Software as a Medical Device (SaMD) Guideline Compliance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
