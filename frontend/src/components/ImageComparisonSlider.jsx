import { useState, useRef, useEffect } from "react";
import { Sliders, Eye, ZoomIn, Maximize2, Sparkles, Layers } from "lucide-react";

export default function ImageComparisonSlider({
  originalImage,
  overlayImage,
  heatmapImage,
  stageName = "Diagnostic Scan",
  confidence = 0,
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState("split"); // 'split', 'original', 'overlay', 'green_channel', 'heatmap'
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [magnifierRatio, setMagnifierRatio] = useState({ rx: 0, ry: 0 });

  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMagnifierPos({ x, y });
      setMagnifierRatio({
        rx: (x / rect.width) * 100,
        ry: (y / rect.height) * 100,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  const activeOverlay = overlayImage || heatmapImage || originalImage;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 shadow-2xl backdrop-blur-md">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders size={16} className="text-cyan-400" />
            Interactive Retinal Lesion Visualizer
          </h4>
          <p className="text-xs text-slate-400">
            Swipe slider or use high-contrast filters to localize pathology.
          </p>
        </div>

        {/* View mode selector */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              viewMode === "split"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Split Slider
          </button>
          <button
            type="button"
            onClick={() => setViewMode("overlay")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              viewMode === "overlay"
                ? "bg-violet-500 text-white shadow-md shadow-violet-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Grad-CAM Overlay
          </button>
          <button
            type="button"
            onClick={() => setViewMode("green_channel")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              viewMode === "green_channel"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
            title="Red-free green channel view for clinical vessel contrast"
          >
            Red-Free (Green)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("heatmap")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              viewMode === "heatmap"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Heatmap
          </button>
          <button
            type="button"
            onClick={() => setViewMode("original")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              viewMode === "original"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Original
          </button>
        </div>

        {/* Magnifier toggle */}
        <button
          type="button"
          onClick={() => setShowMagnifier(!showMagnifier)}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
            showMagnifier
              ? "border-cyan-400/40 bg-cyan-400/20 text-cyan-300"
              : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
          }`}
        >
          <ZoomIn size={14} />
          {showMagnifier ? "2.5x Loupe: Active" : "2.5x Lesion Loupe"}
        </button>
      </div>

      {/* Main Image Viewport */}
      <div
        ref={containerRef}
        onMouseDown={() => viewMode === "split" && setIsDragging(true)}
        onTouchStart={() => viewMode === "split" && setIsDragging(true)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative mt-4 aspect-square max-h-[440px] w-full cursor-crosshair select-none overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-inner"
      >
        {/* VIEW MODE: SPLIT SLIDER */}
        {viewMode === "split" && (
          <>
            {/* Background: Grad-CAM Overlay */}
            <img
              src={activeOverlay}
              alt="Grad-CAM Overlay"
              className="absolute inset-0 h-full w-full object-contain pointer-events-none"
            />

            {/* Foreground: Original Scan clipped by slider */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={originalImage}
                alt="Original Fundus"
                className="absolute inset-0 h-full w-full object-contain max-w-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
                }}
              />
            </div>

            {/* Divider Line */}
            <div
              className="absolute top-0 bottom-0 z-20 w-0.5 bg-gradient-to-b from-cyan-400 via-white to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -left-3.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300 bg-slate-900 text-cyan-400 shadow-lg cursor-ew-resize">
                <Sliders size={14} />
              </div>
            </div>

            {/* Badges on Top */}
            <div className="absolute top-3 left-3 z-10 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-bold text-cyan-300 border border-cyan-400/20 backdrop-blur-md">
              Original Fundus Scan
            </div>
            <div className="absolute top-3 right-3 z-10 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-bold text-violet-300 border border-violet-400/20 backdrop-blur-md">
              Grad-CAM Activation
            </div>
          </>
        )}

        {/* VIEW MODE: ORIGINAL SCAN */}
        {viewMode === "original" && (
          <img
            src={originalImage}
            alt="Original Retinal Scan"
            className="h-full w-full object-contain pointer-events-none"
          />
        )}

        {/* VIEW MODE: GRAD-CAM OVERLAY */}
        {viewMode === "overlay" && (
          <img
            src={activeOverlay}
            alt="Grad-CAM Overlay"
            className="h-full w-full object-contain pointer-events-none"
          />
        )}

        {/* VIEW MODE: HEATMAP */}
        {viewMode === "heatmap" && (
          <img
            src={heatmapImage || activeOverlay}
            alt="Grad-CAM Heatmap"
            className="h-full w-full object-contain pointer-events-none"
          />
        )}

        {/* VIEW MODE: GREEN-CHANNEL / RED-FREE CLINICAL VIEW */}
        {viewMode === "green_channel" && (
          <div className="relative h-full w-full">
            <img
              src={originalImage}
              alt="Red-Free Green Channel"
              className="h-full w-full object-contain filter contrast-[1.65] brightness-[1.1] grayscale"
              style={{
                filter: "grayscale(100%) contrast(170%) brightness(105%) sepia(100%) hue-rotate(85deg) saturate(350%)",
              }}
            />
            <div className="absolute top-3 left-3 z-10 rounded-lg bg-emerald-950/80 px-2.5 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
              Red-Free (Green Channel Isolation) • High Microvascular Contrast
            </div>
          </div>
        )}

        {/* 2.5x LESION LOUPE MAGNIFIER */}
        {showMagnifier && (
          <div
            className="pointer-events-none absolute z-30 h-36 w-36 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-cyan-400 bg-black shadow-[0_0_25px_rgba(6,182,212,0.6)]"
            style={{
              left: `${magnifierPos.x}px`,
              top: `${magnifierPos.y}px`,
            }}
          >
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `url(${viewMode === "overlay" || viewMode === "heatmap" ? activeOverlay : originalImage})`,
                backgroundPosition: `${magnifierRatio.rx}% ${magnifierRatio.ry}%`,
                backgroundSize: "320%",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]"></div>
            </div>
            <span className="absolute bottom-1 right-2 text-[9px] font-mono font-bold text-cyan-300 bg-black/70 px-1 rounded">
              2.5x
            </span>
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-cyan-400" />
          {viewMode === "split" ? "Drag handle left/right to compare features." : "Select tabs above to inspect different visual spectra."}
        </span>
        <span className="text-slate-500">
          Stage: <strong className="text-slate-300">{stageName}</strong> | Conf: <strong className="text-cyan-300">{Number(confidence).toFixed(1)}%</strong>
        </span>
      </div>
    </div>
  );
}
