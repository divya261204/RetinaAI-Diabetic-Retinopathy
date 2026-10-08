import React, { useState } from "react";
import { Eye, EyeOff, Sliders, AlertCircle, Info, RefreshCw, X, Sparkles } from "lucide-react";

export default function PatientVisionSimulator({ isOpen, onClose, currentStage = "Moderate" }) {
  const [selectedStage, setSelectedStage] = useState(currentStage);
  const [hba1cLevel, setHba1cLevel] = useState(8.2);
  const [sceneMode, setSceneMode] = useState("reading"); // "reading" (text/book), "driving" (street scene), "amsler" (Amsler Grid)

  if (!isOpen) return null;

  // Distortion and visual impairment parameters based on stage
  const getStageEffects = (stage) => {
    switch (stage) {
      case "No DR":
        return {
          blurPx: 0,
          scotomaCount: 0,
          contrast: 100,
          amslerWarp: 0,
          description: "Clear 20/20 visual acuity with no diabetic macular distortion or visual field defects.",
          symptoms: "Normal vision, no floaters or blind spots."
        };
      case "Mild":
        return {
          blurPx: 1,
          scotomaCount: 2,
          contrast: 95,
          amslerWarp: 2,
          description: "Mild microvascular leakage causing subtle contrast reduction and occasional tiny floaters.",
          symptoms: "Occasional faint floaters, slight eye fatigue when reading in low light."
        };
      case "Moderate":
        return {
          blurPx: 3,
          scotomaCount: 5,
          contrast: 85,
          amslerWarp: 6,
          description: "Moderate macular edema and retinal hemorrhages creating noticeable central blurriness.",
          symptoms: "Blurred small print, patchy contrast loss, noticeable dark spots floating in field of view."
        };
      case "Severe":
        return {
          blurPx: 6,
          scotomaCount: 9,
          contrast: 70,
          amslerWarp: 12,
          description: "Significant retinal ischemia with multiple dark visual field patches (scotomas) and maculopathy.",
          symptoms: "Difficulty recognizing faces, dark patches obstructing central vision, night vision difficulty."
        };
      case "Proliferative":
        return {
          blurPx: 10,
          scotomaCount: 16,
          contrast: 55,
          amslerWarp: 20,
          description: "Critical neovascularization and vitreous hemorrhage causing dense visual curtain blockage and severe vision loss.",
          symptoms: "Sudden dark visual curtain, dense black floaters shower, severe central distortion, blindness risk."
        };
      default:
        return { blurPx: 2, scotomaCount: 3, contrast: 90, amslerWarp: 4, description: "", symptoms: "" };
    }
  };

  const effects = getStageEffects(selectedStage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#081226]/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/70 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-blue-950/50 via-cyan-950/40 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/40 text-cyan-300">
              <Eye className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                Patient Vision Perspective Simulator
                <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-mono">
                  Clinical Empathy Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Interactive optical simulation demonstrating how diabetic retinopathy degrades daily vision
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col lg:flex-row gap-6">
          {/* Visual Simulation Canvas */}
          <div className="flex-1 flex flex-col items-center justify-center bg-black/80 rounded-2xl border border-slate-700/80 p-4 relative overflow-hidden min-h-[380px]">
            {/* Scene Selector Pill */}
            <div className="absolute top-4 left-4 z-20 flex gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setSceneMode("reading")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  sceneMode === "reading" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
                }`}
              >
                Reading Chart
              </button>
              <button
                onClick={() => setSceneMode("driving")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  sceneMode === "driving" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
                }`}
              >
                Street & Faces
              </button>
              <button
                onClick={() => setSceneMode("amsler")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  sceneMode === "amsler" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
                }`}
              >
                Amsler Grid
              </button>
            </div>

            {/* Active Simulated View */}
            <div className="relative w-full max-w-md h-72 rounded-xl overflow-hidden border border-slate-700 shadow-inner flex items-center justify-center bg-slate-900">
              {sceneMode === "reading" && (
                <div
                  className="w-full h-full p-6 text-slate-900 bg-amber-50 flex flex-col justify-center select-none transition-all duration-500"
                  style={{
                    filter: `blur(${effects.blurPx}px) contrast(${effects.contrast}%)`
                  }}
                >
                  <h3 className="text-xl font-black mb-2 tracking-tight">Snellen Eye Examination</h3>
                  <p className="text-sm font-semibold mb-1">E F P T O Z L P E D</p>
                  <p className="text-xs text-slate-700 leading-relaxed mb-3">
                    Diabetic macular edema causes capillary leakage into the fovea, leading to central distortion of printed letters.
                  </p>
                  <div className="text-[10px] text-slate-600 font-mono">
                    Standard 20/20 line • Good lighting condition
                  </div>
                </div>
              )}

              {sceneMode === "driving" && (
                <div
                  className="w-full h-full relative flex items-center justify-center transition-all duration-500 overflow-hidden"
                  style={{
                    filter: `blur(${effects.blurPx}px) contrast(${effects.contrast}%)`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-sky-900 via-indigo-950 to-slate-900"></div>
                  <div className="relative z-10 text-center p-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-cyan-400/20 border-2 border-cyan-300/40 flex items-center justify-center mb-2 shadow-lg">
                      <Eye className="w-10 h-10 text-cyan-200" />
                    </div>
                    <p className="text-white font-bold text-sm">Approaching Pedestrian / Street Signs</p>
                    <p className="text-slate-300 text-xs">Simulated outdoor day/dusk vision</p>
                  </div>
                </div>
              )}

              {sceneMode === "amsler" && (
                <div
                  className="w-full h-full bg-white relative flex items-center justify-center transition-all duration-500"
                  style={{
                    filter: `blur(${effects.blurPx * 0.7}px)`
                  }}
                >
                  {/* Grid Lines */}
                  <div
                    className="w-56 h-56 border-2 border-black grid grid-cols-8 grid-rows-8 relative"
                    style={{
                      transform: `scale(${1 + effects.amslerWarp * 0.01})`
                    }}
                  >
                    {[...Array(64)].map((_, i) => (
                      <div key={i} className="border border-black/40"></div>
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-3.5 h-3.5 bg-black rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Vitreous Floaters & Scotoma Hemorrhage Patches */}
              {effects.scotomaCount > 0 && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(effects.scotomaCount)].map((_, i) => {
                    const top = (i * 23 + 17) % 80 + 10;
                    const left = (i * 37 + 19) % 80 + 10;
                    const size = selectedStage === "Proliferative" ? 40 + (i % 3) * 20 : 12 + (i % 4) * 8;
                    const opacity = selectedStage === "Proliferative" ? 0.85 : 0.45;
                    return (
                      <div
                        key={i}
                        className="absolute rounded-full bg-slate-950/90 blur-sm animate-pulse"
                        style={{
                          top: `${top}%`,
                          left: `${left}%`,
                          width: `${size}px`,
                          height: `${size}px`,
                          opacity: opacity,
                          animationDuration: `${3 + (i % 3)}s`
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Severity Status Banner */}
            <div className="mt-4 w-full max-w-md p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-400">Simulated Vision Status for: </span>
              <strong className="text-sm font-bold text-cyan-300 ml-1">{selectedStage} Diabetic Retinopathy</strong>
            </div>
          </div>

          {/* Right Controls Panel */}
          <div className="w-full lg:w-80 flex flex-col justify-between space-y-4 text-xs">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                  Select Disease Severity Stage
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {["No DR", "Mild", "Moderate", "Severe", "Proliferative"].map((stage) => (
                    <button
                      key={stage}
                      onClick={() => setSelectedStage(stage)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all ${
                        selectedStage === stage
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/40"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>{stage}</span>
                      {selectedStage === stage && <Sparkles className="w-3.5 h-3.5 text-cyan-300" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* HbA1c Glycemic Slider */}
              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-semibold">Patient HbA1c:</span>
                  <span className="font-mono text-amber-400 font-bold">{hba1cLevel}%</span>
                </div>
                <input
                  type="range"
                  min="5.5"
                  max="12.0"
                  step="0.1"
                  value={hba1cLevel}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setHba1cLevel(val);
                    if (val < 6.5) setSelectedStage("No DR");
                    else if (val < 7.5) setSelectedStage("Mild");
                    else if (val < 9.0) setSelectedStage("Moderate");
                    else if (val < 10.5) setSelectedStage("Severe");
                    else setSelectedStage("Proliferative");
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500">
                  Target: &lt; 7.0%. Every 1% reduction lowers microvascular damage by 35%.
                </p>
              </div>

              {/* Clinical Pathology Description */}
              <div className="p-3.5 bg-blue-950/30 border border-blue-500/20 rounded-xl space-y-1.5">
                <p className="font-bold text-blue-300 text-[11px] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" /> Clinical Presentation
                </p>
                <p className="text-slate-300 text-[11px] leading-relaxed">{effects.description}</p>
              </div>
            </div>

            {/* Bottom Close Button */}
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-xs transition-colors"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
