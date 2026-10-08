import { useState, useEffect } from "react";
import { Volume2, VolumeX, Play, Square, Sparkles, Activity } from "lucide-react";

export default function VoiceAssistant({ predictionResult }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
    }
  }, []);

  if (!isSupported || !predictionResult) return null;

  const stage = predictionResult.prediction || "Moderate";
  const conf = Number(predictionResult.confidence || 0).toFixed(1);
  const patient = predictionResult.patient_name || "the patient";
  const urgency = predictionResult.urgency || "Standard ophthalmic evaluation";
  const rec = predictionResult.recommendation || "Follow-up recommended.";

  const speechText = `Retina AI diagnostic briefing for ${patient}. The retinal fundus analysis classified the scan as ${stage} Diabetic Retinopathy with a diagnostic confidence of ${conf} percent. Clinical urgency is ${urgency}. Recommendation: ${rec}`;

  const handleSpeak = () => {
    if (!window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending utterance
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleSpeak}
        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition shadow-sm ${
          isPlaying
            ? "border-cyan-400 bg-cyan-400/20 text-cyan-300 animate-pulse shadow-cyan-500/20"
            : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
        }`}
        title="Listen to automated audio diagnostic briefing"
      >
        {isPlaying ? <Square size={14} className="fill-cyan-400" /> : <Volume2 size={15} />}
        <span>{isPlaying ? "Stop Audio Briefing" : "Audio Diagnostic Briefing"}</span>
      </button>
    </div>
  );
}
