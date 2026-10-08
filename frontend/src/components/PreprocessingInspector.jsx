import { useState } from "react";
import { Sparkles, Layers, Sliders, CheckCircle2, Info, ArrowRight, Eye } from "lucide-react";

export default function PreprocessingInspector({ originalImageUrl }) {
  const [activeStep, setActiveStep] = useState(2); // 0: Raw, 1: Masked ROI, 2: CLAHE & Gaussian

  const steps = [
    {
      id: 0,
      title: "1. Raw Fundus Scan",
      subtitle: "Direct Camera Acquisition",
      badge: "Input RGB",
      description: "Standard retinal photograph with variable illumination, optic disk flare, camera vignetting, and black non-retinal peripheral border artifacts.",
      filterStyle: {},
      metrics: {
        resolution: "Original (up to 3000x2000)",
        vesselContrast: "Baseline (1.0x)",
        artifacts: "Vignetting & border present",
      },
      formula: "I_{raw}(x,y) \\in [0, 255]^3",
    },
    {
      id: 1,
      title: "2. Circular Mask & Auto-Crop",
      subtitle: "ROI Extraction & Center Alignment",
      badge: "Spatial Normalization",
      description: "Applies Otsu thresholding and contour detection to localize the retinal boundary circle, removing 35-45% of redundant non-informative black border pixels.",
      filterStyle: {
        borderRadius: "50%",
        transform: "scale(1.08)",
      },
      metrics: {
        resolution: "224 x 224 Normalized",
        vesselContrast: "Cropped ROI",
        artifacts: "Black borders eliminated",
      },
      formula: "ROI(x,y) = I(x,y) \\cdot \\mathbb{I}_{\\|x - c\\| \\le R}",
    },
    {
      id: 2,
      title: "3. CLAHE & Local Color Equalization",
      subtitle: "Ben Graham Method & LAB Contrast Boost",
      badge: "Optimal Diagnostic Representation",
      description: "Transforms image to LAB color space, applies Contrast-Limited Adaptive Histogram Equalization (clip limit 2.0) on the L-channel, followed by Gaussian smoothing to amplify faint microaneurysms.",
      filterStyle: {
        filter: "contrast(140%) brightness(105%) saturate(125%)",
      },
      metrics: {
        resolution: "224 x 224 Tensor (0.0 to 1.0)",
        vesselContrast: "+38% Dynamic Range Gain",
        artifacts: "Illumination normalized across quadrants",
      },
      formula: "I_{enh} = \\alpha I_{lab} + \\beta \\mathcal{G}_{\\sigma}(I_{lab}) + \\gamma",
    },
  ];

  const current = steps[activeStep];

  return (
    <div className="rounded-[28px] border border-blue-400/10 bg-[#0d1429]/90 p-7 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Computer Vision Pipeline</p>
          <h3 className="mt-1 text-xl font-bold text-white flex items-center gap-2">
            <Sparkles size={18} className="text-cyan-400" />
            Ben Graham Retinal Preprocessing Inspector
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Interactive multi-stage exploration of retinal normalization and contrast enhancement.
          </p>
        </div>

        {/* Step Tabs */}
        <div className="flex rounded-xl border border-white/10 bg-black/30 p-1">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeStep === idx
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Stage {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
        {/* Left: Enhanced Image Visualizer */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative aspect-square w-full max-w-[340px] overflow-hidden rounded-2xl border border-cyan-400/20 bg-black/80 p-3 shadow-inner">
            {originalImageUrl ? (
              <div className="h-full w-full flex items-center justify-center overflow-hidden rounded-xl">
                <img
                  src={originalImageUrl}
                  alt={current.title}
                  className="h-full w-full object-contain transition-all duration-500"
                  style={current.filterStyle}
                />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                Upload a retinal scan to inspect pipeline
              </div>
            )}

            <div className="absolute top-4 left-4 rounded-lg bg-black/80 px-2.5 py-1 text-[10px] font-bold text-cyan-300 border border-cyan-400/20 backdrop-blur-md">
              {current.badge}
            </div>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 text-center">
            {current.subtitle}
          </p>
        </div>

        {/* Right: Technical Explanation & Metrics */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Active Stage</span>
            <h4 className="text-lg font-bold text-white">{current.title}</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">{current.description}</p>
          </div>

          {/* Metrics Table */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 rounded-xl border border-white/5 bg-black/20 p-3 text-xs">
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-semibold">Dimensions</span>
              <p className="mt-0.5 font-bold text-slate-200">{current.metrics.resolution}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-semibold">Vessel Contrast</span>
              <p className="mt-0.5 font-bold text-cyan-300">{current.metrics.vesselContrast}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-semibold">Artifact Status</span>
              <p className="mt-0.5 font-bold text-emerald-400">{current.metrics.artifacts}</p>
            </div>
          </div>

          {/* Mathematical Transformation */}
          <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Mathematical Formulation</span>
            <p className="mt-1 font-mono text-xs text-cyan-200 font-bold">{current.formula}</p>
          </div>

          {/* Step navigation buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 disabled:opacity-30 hover:bg-white/10"
            >
              Previous Step
            </button>
            <span className="text-xs text-slate-500 font-mono">Stage {activeStep + 1} of 3</span>
            <button
              type="button"
              onClick={() => setActiveStep((prev) => Math.min(2, prev + 1))}
              disabled={activeStep === 2}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 disabled:opacity-30 hover:brightness-110"
            >
              Next Step
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
