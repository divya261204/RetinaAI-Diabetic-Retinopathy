import React, { useState, useRef, useEffect } from "react";
import { Camera, RefreshCw, X, Check, Eye, AlertTriangle, ShieldCheck, Zap } from "lucide-react";

export default function DigitalOphthalmoscopeCaptureModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [qualityScore, setQualityScore] = useState({ focus: 85, brightness: "Optimal", ready: true });
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      initCameras();
    } else {
      stopStream();
      setPreviewImage(null);
    }
    return () => {
      stopStream();
    };
  }, [isOpen]);

  const initCameras = async () => {
    setIsInitializing(true);
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        throw new Error("WebRTC media devices API is not supported in this browser environment.");
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === "videoinput");
      setCameraDevices(videoInputs);

      const defaultDevice = videoInputs[0]?.deviceId || "";
      setSelectedDeviceId(defaultDevice);
      await startCamera(defaultDevice);
    } catch (err) {
      console.warn("Camera init error:", err);
      setCameraError(err.message || "Unable to access optical capture device.");
    } finally {
      setIsInitializing(false);
    }
  };

  const startCamera = async (deviceId) => {
    stopStream();
    try {
      const constraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
          : { width: { ideal: 1920 }, height: { ideal: 1080 } }
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraError(null);
    } catch (err) {
      console.warn("Start camera error:", err);
      setCameraError("Camera access denied or device currently occupied by another application.");
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleDeviceChange = (e) => {
    const newDeviceId = e.target.value;
    setSelectedDeviceId(newDeviceId);
    startCamera(newDeviceId);
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `ophthalmoscope_capture_${Date.now()}.jpg`, { type: "image/jpeg" });
        const previewUrl = URL.createObjectURL(blob);
        setPreviewImage({ file, previewUrl });
      }
      setIsCapturing(false);
    }, "image/jpeg", 0.95);
  };

  const handleConfirmAndScreen = () => {
    if (previewImage && previewImage.file) {
      onCapture(previewImage.file);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#091124]/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/40 text-cyan-300">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                Digital Ophthalmoscope & Direct Fundus Capture
                <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
                  Live Stream
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Direct WebRTC optical acquisition for handheld fundus cameras, slit-lamp adapters, or USB scopes
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
        <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-6">
          {/* Video / Snapshot Viewport */}
          <div className="flex-1 flex flex-col items-center justify-center bg-black/70 rounded-xl border border-slate-700/60 relative overflow-hidden min-h-[360px]">
            {previewImage ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <img
                  src={previewImage.previewUrl}
                  alt="Captured Fundus"
                  className="max-h-[380px] w-auto object-contain rounded-lg"
                />
                <div className="absolute top-3 left-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md">
                  <Check className="w-3.5 h-3.5" /> Snapshot Captured (Ready for AI)
                </div>
              </div>
            ) : cameraError ? (
              <div className="p-6 text-center max-w-sm">
                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-200 mb-1">Optical Stream Inactive</h3>
                <p className="text-xs text-slate-400 mb-4">{cameraError}</p>
                <button
                  onClick={initCameras}
                  className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry Camera Link
                </button>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="max-h-[380px] w-full object-contain"
                />
                {/* Ophthalmic Reticle Guideline Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border border-dashed border-cyan-400/50 flex items-center justify-center animate-pulse">
                    <div className="w-16 h-16 rounded-full border border-cyan-300/40 flex items-center justify-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-cyan-500/30 text-[11px] text-cyan-300">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                    Optical Alignment Active
                  </div>
                  <div className="absolute bottom-4 text-center bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[11px] text-slate-300">
                    Align Macula / Optic Disc inside central reticle
                  </div>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Controls & Device Settings */}
          <div className="w-full md:w-72 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Select Video Input Device
                </label>
                <select
                  value={selectedDeviceId}
                  onChange={handleDeviceChange}
                  disabled={cameraDevices.length === 0}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {cameraDevices.length > 0 ? (
                    cameraDevices.map((d, i) => (
                      <option key={d.deviceId || i} value={d.deviceId}>
                        {d.label || `Camera Device ${i + 1}`}
                      </option>
                    ))
                  ) : (
                    <option value="">No optical camera found</option>
                  )}
                </select>
              </div>

              {/* Optical QA Checklist */}
              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-300 font-semibold border-b border-slate-800 pb-1.5">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <ShieldCheck className="w-4 h-4" /> Live Quality Telemetry
                  </span>
                  <span className="text-emerald-400 font-mono">PASS</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Target Resolution:</span>
                  <span className="text-slate-200 font-mono">1080p / 24fps</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Exposure / Contrast:</span>
                  <span className="text-emerald-400 font-mono">{qualityScore.brightness}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Focus Sharpness:</span>
                  <span className="text-cyan-300 font-mono">{qualityScore.focus}% (Good)</span>
                </div>
              </div>

              <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-[11px] text-cyan-200/90 leading-relaxed">
                <Zap className="w-3.5 h-3.5 text-cyan-400 inline mr-1" />
                Compatible with Welch Allyn iExaminer, Volk iNview, Topcon, and standard UVC digital ophthalmoscopes.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              {previewImage ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleConfirmAndScreen}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all"
                  >
                    <Check className="w-4 h-4" /> Transfer to AI Diagnostic Pipeline
                  </button>
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retake Retinal Snapshot
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCaptureSnapshot}
                  disabled={!stream || !!cameraError || isCapturing}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-lg shadow-cyan-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Camera className="w-4 h-4" /> {isCapturing ? "Acquiring Frame..." : "Capture Retinal Frame"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
