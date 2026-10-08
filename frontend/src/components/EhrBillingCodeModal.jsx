import React, { useState } from "react";
import { FileCode, Copy, Check, X, ShieldAlert, BookOpen, Stethoscope, Layers } from "lucide-react";

export default function EhrBillingCodeModal({ isOpen, onClose, screeningResult }) {
  const [copiedSection, setCopiedSection] = useState(null);
  const [laterality, setLaterality] = useState("OU"); // OD (Right), OS (Left), OU (Bilateral)
  const [macularEdemaPresent, setMacularEdemaPresent] = useState(false);

  if (!isOpen || !screeningResult) return null;

  const stage = screeningResult.prediction || "No DR";

  // ICD-10 Code Calculation Logic based on CMS / WHO guidelines
  const getIcd10Details = () => {
    switch (stage) {
      case "No DR":
        return {
          code: "E11.9",
          desc: "Type 2 diabetes mellitus without complications (Retinal exam negative for diabetic retinopathy)",
          snomed: "422034002",
          hcpcs: "G0402 / Q0091",
          cpt: "92250 (Fundus photography with interpretation)"
        };
      case "Mild":
        return {
          code: macularEdemaPresent
            ? laterality === "OD" ? "E11.3211" : laterality === "OS" ? "E11.3212" : "E11.3213"
            : laterality === "OD" ? "E11.3291" : laterality === "OS" ? "E11.3292" : "E11.3293",
          desc: `Type 2 diabetes mellitus with mild nonproliferative diabetic retinopathy ${
            macularEdemaPresent ? "with macular edema" : "without macular edema"
          }, ${laterality === "OD" ? "right eye" : laterality === "OS" ? "left eye" : "bilateral"}`,
          snomed: "312903001",
          cpt: "92228 (Remote imaging for detection/monitoring of DR with point-of-care analysis)"
        };
      case "Moderate":
        return {
          code: macularEdemaPresent
            ? laterality === "OD" ? "E11.3311" : laterality === "OS" ? "E11.3312" : "E11.3313"
            : laterality === "OD" ? "E11.3391" : laterality === "OS" ? "E11.3392" : "E11.3393",
          desc: `Type 2 diabetes mellitus with moderate nonproliferative diabetic retinopathy ${
            macularEdemaPresent ? "with macular edema" : "without macular edema"
          }, ${laterality === "OD" ? "right eye" : laterality === "OS" ? "left eye" : "bilateral"}`,
          snomed: "312904007",
          cpt: "92250 (Fundus photography with physician interpretation & report)"
        };
      case "Severe":
        return {
          code: macularEdemaPresent
            ? laterality === "OD" ? "E11.3411" : laterality === "OS" ? "E11.3412" : "E11.3413"
            : laterality === "OD" ? "E11.3491" : laterality === "OS" ? "E11.3492" : "E11.3493",
          desc: `Type 2 diabetes mellitus with severe nonproliferative diabetic retinopathy ${
            macularEdemaPresent ? "with macular edema" : "without macular edema"
          }, ${laterality === "OD" ? "right eye" : laterality === "OS" ? "left eye" : "bilateral"}`,
          snomed: "312905008",
          cpt: "92250 + 99214 (Level 4 Established Patient Ophthalmic Evaluation)"
        };
      case "Proliferative":
        return {
          code: macularEdemaPresent
            ? laterality === "OD" ? "E11.3511" : laterality === "OS" ? "E11.3512" : "E11.3513"
            : laterality === "OD" ? "E11.3591" : laterality === "OS" ? "E11.3592" : "E11.3593",
          desc: `Type 2 diabetes mellitus with proliferative diabetic retinopathy ${
            macularEdemaPresent ? "with macular edema" : "without macular edema"
          }, ${laterality === "OD" ? "right eye" : laterality === "OS" ? "left eye" : "bilateral"}`,
          snomed: "59276001",
          cpt: "92250 + 67210 (Photocoagulation / Anti-VEGF Protocol Referral)"
        };
      default:
        return {
          code: "E11.319",
          desc: "Type 2 diabetes mellitus with unspecified diabetic retinopathy",
          snomed: "4855003",
          cpt: "92228"
        };
    }
  };

  const coding = getIcd10Details();

  const fhirPayload = {
    resourceType: "DiagnosticReport",
    id: `retina-ai-${screeningResult.screening_id || Date.now()}`,
    status: "final",
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v2-0074",
            code: "RAD",
            display: "Radiology / Ophthalmic Imaging"
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: "http://snomed.info/sct",
          code: coding.snomed,
          display: coding.desc
        }
      ],
      text: `Diabetic Retinopathy Screening: ${stage}`
    },
    subject: {
      reference: `Patient/${screeningResult.patient_id || "PAT-UNKNOWN"}`,
      display: screeningResult.patient_name || "Anonymous Patient"
    },
    conclusionCode: [
      {
        coding: [
          {
            system: "http://hl7.org/fhir/sid/icd-10-cm",
            code: coding.code,
            display: coding.desc
          }
        ]
      }
    ],
    extension: [
      {
        url: "http://retinaai.health/fhir/StructureDefinition/ai-confidence",
        valueDecimal: screeningResult.confidence ? Number(screeningResult.confidence.toFixed(2)) : 0
      },
      {
        url: "http://retinaai.health/fhir/StructureDefinition/lesion-area-pct",
        valueDecimal: screeningResult.lesion_area_pct || 0
      }
    ]
  };

  const copyToClipboard = (text, sectionKey) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#081226]/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/40 text-blue-300">
              <FileCode className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                Clinical ICD-10 & EHR Coding Assistant
                <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
                  HL7 / FHIR R4
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Automated medical bill coding, SNOMED CT terminology, and CMS-1500 claims formatting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Options: Laterality & Macular Edema */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Eye Laterality
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "OD", label: "OD (Right Eye)" },
                  { id: "OS", label: "OS (Left Eye)" },
                  { id: "OU", label: "OU (Bilateral)" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setLaterality(item.id)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      laterality === item.id
                        ? "bg-cyan-600/30 border-cyan-400 text-cyan-200"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Macular Edema Modifier
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMacularEdemaPresent(false)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    !macularEdemaPresent
                      ? "bg-emerald-600/30 border-emerald-400 text-emerald-200"
                      : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Without Macular Edema
                </button>
                <button
                  onClick={() => setMacularEdemaPresent(true)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    macularEdemaPresent
                      ? "bg-amber-600/30 border-amber-400 text-amber-200"
                      : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  With Macular Edema (CSME)
                </button>
              </div>
            </div>
          </div>

          {/* Primary Diagnosis Card */}
          <div className="p-4 bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono font-bold text-sm rounded-lg">
                  {coding.code}
                </span>
                <span className="text-white font-semibold text-sm">ICD-10-CM Primary Diagnosis</span>
              </div>
              <button
                onClick={() => copyToClipboard(coding.code, "icd10")}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copiedSection === "icd10" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === "icd10" ? "Copied" : "Copy Code"}
              </button>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed bg-black/40 p-2.5 rounded-lg border border-slate-800 font-mono">
              {coding.desc}
            </p>
          </div>

          {/* Secondary Codes & Procedures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex justify-between items-center text-slate-400">
                <span className="font-semibold text-slate-200">SNOMED CT Concept:</span>
                <button
                  onClick={() => copyToClipboard(coding.snomed, "snomed")}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  {copiedSection === "snomed" ? "Copied!" : <Copy className="w-3 h-3 inline" />}
                </button>
              </div>
              <p className="font-mono text-cyan-300 text-sm">{coding.snomed}</p>
            </div>

            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex justify-between items-center text-slate-400">
                <span className="font-semibold text-slate-200">CPT / Billing Procedure:</span>
                <button
                  onClick={() => copyToClipboard(coding.cpt, "cpt")}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  {copiedSection === "cpt" ? "Copied!" : <Copy className="w-3 h-3 inline" />}
                </button>
              </div>
              <p className="font-mono text-emerald-300 text-xs">{coding.cpt}</p>
            </div>
          </div>

          {/* FHIR DiagnosticReport JSON Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" /> HL7 FHIR R4 JSON Payload (EHR Integration)
              </span>
              <button
                onClick={() => copyToClipboard(JSON.stringify(fhirPayload, null, 2), "fhir")}
                className="px-2.5 py-1 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copiedSection === "fhir" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === "fhir" ? "Copied FHIR JSON" : "Copy FHIR Payload"}
              </button>
            </div>
            <pre className="p-3.5 bg-black/60 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48 leading-tight">
              {JSON.stringify(fhirPayload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-900/90 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Close Assistant
          </button>
        </div>
      </div>
    </div>
  );
}
