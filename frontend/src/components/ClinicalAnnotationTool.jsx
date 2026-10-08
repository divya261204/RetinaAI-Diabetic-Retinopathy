import { useState, useRef } from "react";
import { Edit3, MapPin, Trash2, CheckCircle2, ShieldCheck, Download, Plus } from "lucide-react";

export default function ClinicalAnnotationTool({ imageUrl, patientName = "Patient" }) {
  const [annotations, setAnnotations] = useState([]);
  const [selectedLesionType, setSelectedLesionType] = useState("Microaneurysm");
  const [notes, setNotes] = useState("");
  const imageRef = useRef(null);

  const lesionTypes = [
    { label: "Microaneurysm (MA)", color: "bg-red-500", text: "text-red-400", code: "MA" },
    { label: "Intraretinal Hemorrhage (IRH)", color: "bg-rose-600", text: "text-rose-400", code: "IRH" },
    { label: "Hard Exudate (HE)", color: "bg-yellow-400", text: "text-yellow-300", code: "HE" },
    { label: "Cotton Wool Spot (CWS)", color: "bg-sky-400", text: "text-sky-300", code: "CWS" },
    { label: "Neovascularization (NV)", color: "bg-purple-500", text: "text-purple-300", code: "NV" },
  ];

  const handleImageClick = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const currentType = lesionTypes.find((t) => t.label.startsWith(selectedLesionType)) || lesionTypes[0];

    const newAnnotation = {
      id: Date.now(),
      x: x.toFixed(1),
      y: y.toFixed(1),
      type: currentType.label,
      code: currentType.code,
      color: currentType.color,
      text: currentType.text,
    };

    setAnnotations([...annotations, newAnnotation]);
  };

  const removeAnnotation = (id) => {
    setAnnotations(annotations.filter((a) => a.id !== id));
  };

  const clearAll = () => {
    setAnnotations([]);
  };

  // Lesion counts
  const counts = annotations.reduce((acc, a) => {
    acc[a.code] = (acc[a.code] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 shadow-2xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Edit3 size={16} className="text-cyan-400" />
            Interactive Clinician Lesion Annotation & Diagnostic Notes
          </h4>
          <p className="text-xs text-slate-400">
            Click directly on the fundus photograph to pin localized pathological findings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {annotations.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-500/20"
            >
              <Trash2 size={13} />
              Clear Markers ({annotations.length})
            </button>
          )}
        </div>
      </div>

      {/* Tool Selector Bar */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400">Active Marker:</span>
        {lesionTypes.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setSelectedLesionType(t.label.split(" ")[0])}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold transition ${
              selectedLesionType === t.label.split(" ")[0]
                ? "border-cyan-400 bg-cyan-400/20 text-cyan-300 shadow-md"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${t.color}`}></span>
            {t.code}
          </button>
        ))}
      </div>

      {/* Main Annotation Viewport */}
      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Retinal Fundus Scan with Click-to-Pin */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div
            ref={imageRef}
            onClick={handleImageClick}
            className="relative aspect-square w-full max-w-[360px] cursor-crosshair overflow-hidden rounded-2xl border border-cyan-400/30 bg-black shadow-inner"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Fundus for Annotation"
                className="h-full w-full object-contain pointer-events-none select-none"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                Load fundus photograph to place annotations
              </div>
            )}

            {/* Placed Pins */}
            {annotations.map((a) => (
              <div
                key={a.id}
                className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center cursor-pointer group"
                style={{ left: `${a.x}%`, top: `${a.y}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeAnnotation(a.id);
                }}
                title={`Click to remove ${a.type} at (${a.x}%, ${a.y}%)`}
              >
                <div className={`flex h-6 w-6 items-center justify-center rounded-full ${a.color} text-[10px] font-black text-white shadow-[0_0_8px_rgba(0,0,0,0.8)] border border-white group-hover:scale-125 transition-transform`}>
                  {a.code.slice(0, 2)}
                </div>
              </div>
            ))}

            <div className="absolute bottom-2 left-2 rounded-lg bg-black/80 px-2 py-0.5 text-[9px] font-bold text-slate-400 border border-white/10">
              Click anywhere on scan to place marker • Click pin to delete
            </div>
          </div>
        </div>

        {/* Right: Pathological Finding Counts & Clinician Notes */}
        <div className="lg:col-span-5 space-y-4">
          {/* Lesion Counts Summary */}
          <div className="rounded-xl border border-white/5 bg-black/20 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Marked Lesion Tally</span>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {lesionTypes.map((t) => (
                <div key={t.code} className="flex items-center justify-between rounded-lg bg-white/[0.03] p-2 border border-white/5">
                  <span className="text-slate-300 font-medium">{t.code}:</span>
                  <span className={`font-mono font-bold ${t.text}`}>{counts[t.code] || 0}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-slate-500">Total Count: <strong className="text-white">{annotations.length}</strong> pathological markers</p>
          </div>

          {/* Clinician Diagnosis Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-300">Clinician Diagnostic Impression & Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Cluster of microaneurysms detected in superior temporal arcade. Foveal reflex sharp. Schedule 6-month repeat."
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-400"
            />
          </div>

          {notes && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <CheckCircle2 size={14} />
              <span>Notes recorded for clinical documentation</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
