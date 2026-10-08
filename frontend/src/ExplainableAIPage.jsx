import { useState } from "react";
import { Brain, Eye, Flame, Layers, AlertCircle, Sparkles, Sliders, Cpu, Activity, Grid, Crosshair } from "lucide-react";
import ImageComparisonSlider from "./components/ImageComparisonSlider.jsx";
import PreprocessingInspector from "./components/PreprocessingInspector.jsx";
import EtdrsGridOverlay from "./components/EtdrsGridOverlay.jsx";

export default function ExplainableAIPage({ predictionResult, selectedFile }) {
  const backendUrl = typeof window !== "undefined" && window.location.port === "5173" ? "http://127.0.0.1:8000" : "";
  const [activeTab, setActiveTab] = useState("gradcam"); // 'gradcam', 'etdrs', 'preprocessing'

  let originalImageUrl = null;
  if (selectedFile) {
    originalImageUrl = URL.createObjectURL(selectedFile);
  } else if (predictionResult?.uploaded_image) {
    originalImageUrl = predictionResult.uploaded_image.startsWith("http")
      ? predictionResult.uploaded_image
      : `${backendUrl}${predictionResult.uploaded_image}`;
  } else if (predictionResult?.original_image_url) {
    originalImageUrl = predictionResult.original_image_url.startsWith("http")
      ? predictionResult.original_image_url
      : `${backendUrl}${predictionResult.original_image_url}`;
  }

  const heatmapUrl = predictionResult?.heatmap_base64 ||
    (predictionResult?.heatmap_image ? `${backendUrl}${predictionResult.heatmap_image}` : null) ||
    (predictionResult?.heatmap_image_url ? `${backendUrl}${predictionResult.heatmap_image_url}` : null);

  const overlayUrl = predictionResult?.overlay_base64 ||
    (predictionResult?.result_image ? `${backendUrl}${predictionResult.result_image}` : null) ||
    (predictionResult?.overlay_image_url ? `${backendUrl}${predictionResult.overlay_image_url}` : null);

  return (
    <div className="mx-auto max-w-7xl pb-12 space-y-7">
      {/* Header Banner */}
      <div className="rounded-[30px] border border-blue-400/10 bg-[#0d1429] p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/20">
              <Brain size={27} className="text-white" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                RetinaAI • Explainable AI & Computer Vision
              </p>
              <h1 className="mt-1 text-3xl font-extrabold text-white">
                Grad-CAM & Interpretability Suite
              </h1>
            </div>
          </div>

          {/* Sub-tab navigation */}
          {predictionResult && (
            <div className="flex flex-wrap rounded-xl border border-white/10 bg-black/40 p-1 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("gradcam")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                  activeTab === "gradcam"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sliders size={13} />
                Interactive Grad-CAM
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("etdrs")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                  activeTab === "etdrs"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Crosshair size={13} />
                ETDRS Grid & CSME
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preprocessing")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                  activeTab === "preprocessing"
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Cpu size={13} />
                Ben Graham Pipeline
              </button>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Gradient-weighted Class Activation Mapping (Grad-CAM), ETDRS 9-zone quadrant density, and spatial normalization visualizers provide verifiable, clinician-grade transparency.
        </p>

        {!predictionResult ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-12 text-center">
            <Brain size={42} className="mx-auto text-blue-400/40" />
            <h2 className="mt-4 text-xl font-bold text-white">
              No Active Screening Result
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Analyze a retinal image from "New Screening" or select a record from "History" to visualize Grad-CAM activation, ETDRS mapping, and preprocessing stages.
            </p>
          </div>
        ) : (
          <>
            {/* Top Stat Cards */}
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Eye size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Diagnosed Stage
                    </p>
                    <p className="mt-1 text-xl font-extrabold text-cyan-400">
                      {predictionResult.prediction}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Flame size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Model Confidence
                    </p>
                    <p className="mt-1 text-xl font-extrabold text-violet-400">
                      {Number(predictionResult.confidence || 0).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Layers size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Lesion Coverage Area
                    </p>
                    <p className="mt-1 text-xl font-extrabold text-emerald-400">
                      {predictionResult.lesion_area_pct ? `${Number(predictionResult.lesion_area_pct).toFixed(1)}%` : "Calculated"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 1: GRAD-CAM */}
            {activeTab === "gradcam" && (
              <>
                {/* Interactive Split Slider with 2.5x Loupe Magnifier */}
                <div className="mt-8">
                  <ImageComparisonSlider
                    originalImage={originalImageUrl}
                    overlayImage={overlayUrl}
                    heatmapImage={heatmapUrl}
                    stageName={predictionResult.prediction}
                    confidence={predictionResult.confidence}
                  />
                </div>

                {/* Side-by-Side Static Cards */}
                <div className="mt-8">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">
                      Static Multi-Spectrum Activation Breakdown
                    </h3>
                    <p className="text-xs text-slate-400">
                      Three-way static comparison between raw input tensor, gradient activation map, and fused visual overlay.
                    </p>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-3">
                    {/* 1. ORIGINAL IMAGE */}
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                      <div className="border-b border-white/10 px-5 py-4">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-white">Original Fundus Scan</p>
                          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                            Input Tensor
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          High-resolution RGB fundus photograph.
                        </p>
                      </div>

                      <div className="flex min-h-[260px] items-center justify-center bg-black/40 p-4">
                        {originalImageUrl ? (
                          <img
                            src={originalImageUrl}
                            alt="Original retinal scan"
                            className="max-h-[280px] w-full rounded-xl object-contain shadow-md"
                          />
                        ) : (
                          <p className="text-sm text-slate-500">Original scan unavailable</p>
                        )}
                      </div>
                    </div>

                    {/* 2. GRAD-CAM HEATMAP */}
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                      <div className="border-b border-white/10 px-5 py-4">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-white">Conv_1 Heatmap</p>
                          <span className="rounded-full bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-400">
                            Gradients
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          Backpropagated gradients pooled at Conv_1 layer.
                        </p>
                      </div>

                      <div className="flex min-h-[260px] items-center justify-center bg-black/40 p-4">
                        {heatmapUrl ? (
                          <img
                            src={heatmapUrl}
                            alt="Grad-CAM heatmap"
                            className="max-h-[280px] w-full rounded-xl object-contain shadow-md"
                          />
                        ) : (
                          <p className="text-sm text-slate-500">Heatmap unavailable</p>
                        )}
                      </div>
                    </div>

                    {/* 3. GRAD-CAM OVERLAY */}
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                      <div className="border-b border-white/10 px-5 py-4">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-white">Diagnostic Overlay</p>
                          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-400">
                            60/40 Blend
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          Attention highlighted over retinal microvasculature.
                        </p>
                      </div>

                      <div className="flex min-h-[260px] items-center justify-center bg-black/40 p-4">
                        {overlayUrl ? (
                          <img
                            src={overlayUrl}
                            alt="Grad-CAM overlay"
                            className="max-h-[280px] w-full rounded-xl object-contain shadow-md"
                          />
                        ) : (
                          <p className="text-sm text-slate-500">Overlay unavailable</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clinical Interpretation Card */}
                <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-500/5 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-cyan-300">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">AI Interpretability & Pathology Insights</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {predictionResult.interpretation ||
                          `Grad-CAM activations highlight key vascular regions and microvascular abnormalities corresponding to ${predictionResult.prediction}.`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grad-CAM Mathematical Formulation */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
                    Mathematical Formulation of Grad-CAM
                  </h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                      <p className="text-xs font-bold text-slate-400">1. Neuron Importance Weights (α_k^c)</p>
                      <p className="mt-2 font-mono text-xs text-cyan-300">{"α_k^c = (1/Z) Σ_i Σ_j (∂y^c / ∂A_ij^k)"}</p>
                      <p className="mt-2 text-[11px] text-slate-500">Global average pooling of gradients with respect to feature activation map A^k.</p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                      <p className="text-xs font-bold text-slate-400">2. Heatmap Generation with Rectified Linear Unit</p>
                      <p className="mt-2 font-mono text-xs text-violet-300">{"L_GradCAM^c = ReLU( Σ_k α_k^c A^k )"}</p>
                      <p className="mt-2 text-[11px] text-slate-500">Weighted combination of forward activation maps, filtering only positive features.</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: ETDRS GRID & CSME ANALYZER */}
            {activeTab === "etdrs" && (
              <div className="mt-8">
                <EtdrsGridOverlay
                  imageUrl={originalImageUrl || overlayUrl}
                  lesionAreaPct={predictionResult.lesion_area_pct}
                  stage={predictionResult.prediction}
                />
              </div>
            )}

            {/* TAB 3: PREPROCESSING PIPELINE */}
            {activeTab === "preprocessing" && (
              <div className="mt-8">
                <PreprocessingInspector originalImageUrl={originalImageUrl} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}