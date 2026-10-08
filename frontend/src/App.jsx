import { useState, useEffect } from "react";
import ExplainableAIPage from "./ExplainableAIPage.jsx";
import HistoryPage from "./HistoryPage.jsx";
import LongitudinalTrackerPage from "./LongitudinalTrackerPage.jsx";
import PathologyAtlasPage from "./PathologyAtlasPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import ImageComparisonSlider from "./components/ImageComparisonSlider.jsx";
import ReferralLetterModal from "./components/ReferralLetterModal.jsx";
import RiskProgressionCalculator from "./components/RiskProgressionCalculator.jsx";
import EtdrsGridOverlay from "./components/EtdrsGridOverlay.jsx";
import ClinicalAnnotationTool from "./components/ClinicalAnnotationTool.jsx";
import PatientEducationModal from "./components/PatientEducationModal.jsx";
import ImageQualityQAInspector from "./components/ImageQualityQAInspector.jsx";
import MultiModelConsensusInspector from "./components/MultiModelConsensusInspector.jsx";
import TreatmentPrognosisSimulator from "./components/TreatmentPrognosisSimulator.jsx";
import VoiceAssistant from "./components/VoiceAssistant.jsx";
import DigitalOphthalmoscopeCaptureModal from "./components/DigitalOphthalmoscopeCaptureModal.jsx";
import EhrBillingCodeModal from "./components/EhrBillingCodeModal.jsx";
import PatientVisionSimulator from "./components/PatientVisionSimulator.jsx";
import RetinaCopilotChat from "./components/RetinaCopilotChat.jsx";
import VascularVesselAnalyzerModal from "./components/VascularVesselAnalyzerModal.jsx";
import cyberEyeBg from "./assets/cyber_eye_bg.jpg";
import {
  Activity,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  History,
  Home,
  Layers,
  Menu,
  RotateCcw,
  ScanLine,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
  Zap,
  AlertTriangle,
  Eye,
  Clock,
  ArrowRight,
  Printer,
  Sliders,
  GitCompare,
  Crosshair,
  Edit3,
  BookOpen,
  HeartPulse,
  LogOut,
  Camera,
  FileCode,
  GitBranch
} from "lucide-react";

const BACKEND_URL = typeof window !== "undefined" && window.location.port === "5173"
  ? "http://127.0.0.1:8000"
  : "";

const navigation = [
  { name: "Dashboard", icon: Home },
  { name: "New Screening", icon: ScanLine },
  { name: "Batch Triage", icon: Layers },
  { name: "Results", icon: FileText },
  { name: "Explainable AI", icon: Brain },
  { name: "Longitudinal", icon: GitCompare },
  { name: "Pathology Atlas", icon: BookOpen },
  { name: "Analytics", icon: BarChart3 },
  { name: "History", icon: History },
];

function Formula({ formula, calculation, result }) {
  return (
    <div className="mt-3 rounded-xl border border-white/10 bg-black/30 px-3 py-3 font-mono text-xs">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Formula</p>
      <p className="mt-1 text-cyan-300">{formula}</p>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Calculation</p>
      <p className="mt-1 text-violet-300">{calculation}</p>
      <p className="mt-2 font-bold text-emerald-400">Result: {result}</p>
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("retina_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("retina_user");
  };

  // Single Screening State
  const [selectedFile, setSelectedFile] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("Unknown");
  const [useTTA, setUseTTA] = useState(false);
  const [modelChoice, setModelChoice] = useState("ensemble");
  const [predictionResult, setPredictionResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCameraCaptureModal, setShowCameraCaptureModal] = useState(false);

  // Batch Screening State
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchResults, setBatchResults] = useState([]);
  const [isBatchAnalyzing, setIsBatchAnalyzing] = useState(false);

  // Dashboard Live Stats & Demo Samples State
  const [stats, setStats] = useState({
    total_screenings: 128,
    average_confidence: 84.7,
    urgent_cases: 14,
    stage_breakdown: {}
  });
  const [samples, setSamples] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/stats`);
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (e) {
      console.warn("Could not fetch stats, using default values");
    }
  };

  useEffect(() => {
    fetchStats();
    fetch(`${BACKEND_URL}/api/samples`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSamples(d.samples);
      })
      .catch(() => {});
  }, []);

  const handleSelectSample = async (sample) => {
    try {
      const res = await fetch(`${BACKEND_URL}${sample.url}`);
      const blob = await res.blob();
      const file = new File([blob], sample.filename, { type: "image/png" });
      setSelectedFile(file);
      setPatientName(`Demo Patient (${sample.stage_name})`);
      setPatientId(`DEMO-${sample.id_code}`);
      setPredictionResult(null);
    } catch (err) {
      console.error("Sample load error:", err);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      alert("Please select a retinal fundus image first.");
      return;
    }

    setIsAnalyzing(true);
    setPredictionResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("patient_name", patientName || "Anonymous");
      formData.append("patient_id", patientId || `PAT-${Date.now().toString().slice(-6)}`);
      formData.append("patient_age", patientAge || "");
      formData.append("patient_gender", patientGender);
      formData.append("use_tta", useTTA.toString());
      formData.append("model_choice", modelChoice);

      const response = await fetch(`${BACKEND_URL}/api/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Prediction failed.");
      }

      setPredictionResult(data);
      setActivePage("Results");
      fetchStats();
    } catch (error) {
      console.error("Prediction error:", error);
      alert(`Unable to analyze the image: ${error.message}. Please check that the FastAPI server is running at ${BACKEND_URL}.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBatchAnalyze = async () => {
    if (batchFiles.length === 0) {
      alert("Please select multiple retinal fundus images first.");
      return;
    }

    setIsBatchAnalyzing(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < batchFiles.length; i++) {
        formData.append("files", batchFiles[i]);
      }

      const response = await fetch(`${BACKEND_URL}/api/batch-predict`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Batch screening failed.");
      }

      setBatchResults(data.results);
      fetchStats();
    } catch (err) {
      console.error("Batch error:", err);
      alert(`Batch screening error: ${err.message}`);
    } finally {
      setIsBatchAnalyzing(false);
    }
  };

  if (!currentUser) {
    return (
      <LoginPage
        onLogin={(user) => {
          setCurrentUser(user);
          localStorage.setItem("retina_user", JSON.stringify(user));
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#040816] text-white selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Fixed Cyber Background Eye Layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25 pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `url(${cyberEyeBg})`,
          backgroundAttachment: "fixed",
        }}
      />
      {/* Futuristic Deep Overlay for Crisp Contrast & Readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-tr from-[#040816]/95 via-[#06112c]/88 to-[#09173e]/90 pointer-events-none backdrop-blur-[1px]" />

      {/* Sidebar */}
      <aside
        className={
          sidebarOpen
            ? "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-cyan-500/20 bg-[#070e24]/90 backdrop-blur-2xl transition-all duration-300 shadow-2xl"
            : "fixed left-0 top-0 z-50 flex h-screen w-20 flex-col border-r border-cyan-500/20 bg-[#070e24]/90 backdrop-blur-2xl transition-all duration-300 shadow-2xl"
        }
      >
        <div className="flex h-20 items-center border-b border-cyan-500/15 px-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Activity size={23} className="text-slate-950 font-black" />
          </div>

          {sidebarOpen && (
            <div className="ml-3">
              <h1 className="text-lg font-black text-white flex items-center gap-1.5">
                Retina<span className="text-cyan-400">AI</span>
                <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-1.5 py-0.2 text-[8px] font-bold text-cyan-300">v2.2</span>
              </h1>
              <p className="text-[10px] text-cyan-300/70 font-semibold tracking-wider uppercase">AI Diagnostic Suite</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          {sidebarOpen && (
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/40">
              Workspace Modules
            </p>
          )}

          <div className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => setActivePage(item.name)}
                  className={
                    active
                      ? "flex w-full items-center rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/20 via-blue-600/30 to-violet-600/20 px-3.5 py-3 text-left text-cyan-300 shadow-lg shadow-cyan-950/40 font-bold"
                      : "flex w-full items-center rounded-2xl px-3.5 py-3 text-left text-slate-400 transition hover:bg-white/5 hover:text-white"
                  }
                >
                  <Icon size={19} className={active ? "text-cyan-400" : ""} />
                  {sidebarOpen && <span className="ml-3 text-sm">{item.name}</span>}
                  {sidebarOpen && active && <ChevronRight size={16} className="ml-auto text-cyan-400" />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Clinician Info Card */}
        <div className="border-t border-cyan-500/15 p-4">
          {sidebarOpen ? (
            <div className="rounded-2xl border border-cyan-500/20 bg-[#0a1433]/80 p-3 shadow-inner">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold text-white truncate">{currentUser?.name || "Dr. Sarah Jenkins"}</p>
                  <p className="text-[9px] text-cyan-300/70 truncate">{currentUser?.role || "Consultant"}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center text-cyan-400">
              <ShieldCheck size={18} />
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={sidebarOpen ? "ml-64 transition-all duration-300 relative z-10" : "ml-20 transition-all duration-300 relative z-10"}>
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-cyan-500/20 bg-[#070e24]/90 px-8 backdrop-blur-xl shadow-lg shadow-cyan-950/20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-xl p-2.5 text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">RetinaAI Diagnostic Suite</p>
              <h2 className="text-xl font-extrabold text-white">{activePage}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 shadow-inner">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
              <span className="text-xs font-semibold text-cyan-300">Ensemble Engine Online (72.91%)</span>
            </div>

            {/* Logged in Clinician Profile & Log Out Action */}
            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-extrabold text-white">{currentUser?.name || "Dr. Clinician"}</span>
                <span className="text-[10px] text-cyan-300 font-semibold">{currentUser?.badge || currentUser?.role || "Lead Clinician"}</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 font-black text-slate-950 shadow-md shadow-cyan-500/30">
                {(currentUser?.name || "D").replace("Dr. ", "")[0]}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Log Out & Switch Clinician"
                className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20"
              >
                <LogOut size={14} />
                <span className="hidden md:inline">Log Out</span>
              </button>
            </div>
          </div>
        </header>

        <div className="relative min-h-[calc(100vh-80px)] p-8">
          {activePage === "Dashboard" ? (
            <Dashboard
              stats={stats}
              setSelectedFile={setSelectedFile}
              setActivePage={setActivePage}
              onOpenLiveCamera={() => setShowCameraCaptureModal(true)}
            />
          ) : activePage === "New Screening" ? (
            <NewScreeningPage
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              patientName={patientName}
              setPatientName={setPatientName}
              patientId={patientId}
              setPatientId={setPatientId}
              patientAge={patientAge}
              setPatientAge={setPatientAge}
              patientGender={patientGender}
              setPatientGender={setPatientGender}
              useTTA={useTTA}
              setUseTTA={setUseTTA}
              modelChoice={modelChoice}
              setModelChoice={setModelChoice}
              samples={samples}
              onSelectSample={handleSelectSample}
              isAnalyzing={isAnalyzing}
              analyzeImage={analyzeImage}
              onOpenLiveCamera={() => setShowCameraCaptureModal(true)}
            />
          ) : activePage === "Batch Triage" ? (
            <BatchScreeningPage
              batchFiles={batchFiles}
              setBatchFiles={setBatchFiles}
              batchResults={batchResults}
              isBatchAnalyzing={isBatchAnalyzing}
              handleBatchAnalyze={handleBatchAnalyze}
              onViewItem={(item) => {
                setPredictionResult(item);
                setActivePage("Results");
              }}
            />
          ) : activePage === "Results" ? (
            <ResultsPage
              predictionResult={predictionResult}
              selectedFile={selectedFile}
              setActivePage={setActivePage}
            />
          ) : activePage === "Explainable AI" ? (
            <ExplainableAIPage
              predictionResult={predictionResult}
              selectedFile={selectedFile}
            />
          ) : activePage === "Longitudinal" ? (
            <LongitudinalTrackerPage />
          ) : activePage === "Pathology Atlas" ? (
            <PathologyAtlasPage />
          ) : activePage === "Analytics" ? (
            <AnalyticsPage />
          ) : activePage === "History" ? (
            <HistoryPage
              onViewResult={(item) => {
                setPredictionResult(item);
                setActivePage("Results");
              }}
            />
          ) : null}

          {/* WebRTC Digital Ophthalmoscope Live Stream / Capture Modal */}
          <DigitalOphthalmoscopeCaptureModal
            isOpen={showCameraCaptureModal}
            onClose={() => setShowCameraCaptureModal(false)}
            onCapture={(file) => {
              setSelectedFile(file);
              setActivePage("New Screening");
            }}
          />
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   DASHBOARD VIEW
   ============================================================ */
function Dashboard({ stats, setSelectedFile, setActivePage, onOpenLiveCamera }) {
  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-[30px] border border-blue-400/20 bg-gradient-to-br from-[#10265a] via-[#14296c] to-[#24105a] p-9 shadow-2xl shadow-blue-950/40">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"></div>
        <div className="absolute -bottom-32 right-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl"></div>

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5">
            <Sparkles size={14} className="text-cyan-300" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
              Deep Learning + Grad-CAM Explainability
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Diabetic Retinopathy
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
              Automated Screening & XAI
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Rapid fundus examination across 5 retinopathy stages with Test-Time Augmentation (TTA), clinical risk stratification, and Grad-CAM lesion interpretability.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => setActivePage("New Screening")}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
            >
              <ScanLine size={18} />
              Start New Screening
            </button>

            <button
              onClick={() => setActivePage("Batch Triage")}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Layers size={18} />
              Batch Screening Triage
            </button>

            <button
              onClick={() => setActivePage("Analytics")}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <BarChart3 size={18} />
              Model Performance
            </button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DarkStat
          title="Total Screenings"
          value={stats.total_screenings || 128}
          detail="Stored in database"
          icon={ScanLine}
          color="blue"
        />
        <DarkStat
          title="Model Test Accuracy"
          value="70.36%"
          detail="Fine-tuned MobileNetV2"
          icon={Brain}
          color="violet"
        />
        <DarkStat
          title="Avg. Confidence"
          value={`${stats.average_confidence || 84.7}%`}
          detail="Across evaluated scans"
          icon={Zap}
          color="orange"
        />
        <DarkStat
          title="High Priority / Urgent"
          value={stats.urgent_cases || 0}
          detail="Severe & Proliferative cases"
          icon={AlertTriangle}
          color="green"
        />
      </section>

      {/* Quick Launch Actions */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-blue-400/10 bg-[#0d1429]/90 p-7 shadow-2xl">
          <h3 className="text-xl font-bold text-white">Quick Upload & Screen</h3>
          <p className="mt-1 text-sm text-slate-400">Directly drop a fundus photograph to initiate AI screening.</p>

          <div
            onClick={() => document.getElementById("dash-file-input").click()}
            className="mt-6 cursor-pointer rounded-2xl border border-dashed border-blue-400/20 bg-blue-500/5 p-6 text-center transition hover:border-cyan-400/40 hover:bg-blue-500/10"
          >
            <Upload size={28} className="mx-auto text-cyan-400" />
            <p className="mt-2 text-sm font-semibold text-white">Click or drop fundus image</p>
            <p className="mt-0.5 text-xs text-slate-500">Supports JPG, JPEG, PNG (224x224+)</p>
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={onOpenLiveCamera}
              className="w-full py-2.5 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 hover:from-cyan-900/60 hover:to-blue-900/60 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-950/40"
            >
              <Camera size={16} className="text-cyan-400 animate-pulse" />
              Live Ophthalmoscope Direct Capture (WebRTC)
            </button>
          </div>
          <input
            id="dash-file-input"
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setSelectedFile(e.target.files[0]);
                setActivePage("New Screening");
              }
            }}
          />
        </div>

        <div className="rounded-[28px] border border-violet-400/10 bg-[#0d1429]/90 p-7 shadow-2xl">
          <h3 className="text-xl font-bold text-white">Screening System Architecture</h3>
          <p className="mt-1 text-sm text-slate-400">Integrated modules in this deployment.</p>

          <div className="mt-5 space-y-3">
            <StatusRow name="Inference Engine (MobileNetV2 Fine-Tuned)" status="Operational (70.36%)" />
            <StatusRow name="Grad-CAM Explainability Backend" status="Ready (Conv_1 Layer)" />
            <StatusRow name="Test-Time Augmentation (TTA)" status="Enabled" />
            <StatusRow name="Clinical PDF Report Generator" status="ReportLab Ready" />
            <StatusRow name="SQLite Database Persistence" status="Connected" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   NEW SCREENING VIEW
   ============================================================ */
function NewScreeningPage({
  selectedFile,
  setSelectedFile,
  patientName,
  setPatientName,
  patientId,
  setPatientId,
  patientAge,
  setPatientAge,
  patientGender,
  setPatientGender,
  useTTA,
  setUseTTA,
  modelChoice,
  setModelChoice,
  samples,
  onSelectSample,
  isAnalyzing,
  analyzeImage,
  onOpenLiveCamera,
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-12">
      <section className="overflow-hidden rounded-[30px] border border-violet-400/10 bg-gradient-to-br from-[#10265a] via-[#14296c] to-[#24105a] p-8 shadow-2xl shadow-blue-950/40">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">RetinaAI Screening Engine</p>
        <h1 className="mt-2 text-3xl font-extrabold text-white">Patient Retinal Screening</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
          Enter patient clinical metadata, select image preprocessing/TTA options, and upload fundus photographs for diagnostic grading.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-5">
        {/* Left: Patient Metadata & Options */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[28px] border border-blue-400/10 bg-[#0d1429]/90 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User size={18} className="text-cyan-400" />
              Patient Information (Optional)
            </h3>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-400">Patient Full Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Patient ID / MRN</label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="PAT-1049"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Age</label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="58"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Gender</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                >
                  <option value="Unknown">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Model Options */}
          <div className="rounded-[28px] border border-blue-400/10 bg-[#0d1429]/90 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              Inference Mode & Architecture
            </h3>

            {/* Architecture Selector */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-400">Model Architecture</label>
              <div className="mt-2 space-y-2">
                {[
                  { id: "ensemble", name: "Ensemble (Multi-Model)", badge: "Recommended (High Accuracy)" },
                  { id: "efficientnet", name: "EfficientNet-B0", badge: "71.77% Validation Peak" },
                  { id: "mobilenet", name: "Fine-Tuned MobileNetV2", badge: "70.36% Test Accuracy" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setModelChoice(m.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                      modelChoice === m.id
                        ? "border-cyan-400 bg-cyan-400/15 text-white"
                        : "border-white/10 bg-black/20 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{m.name}</p>
                      <p className="text-[10px] text-cyan-300">{m.badge}</p>
                    </div>
                    {modelChoice === m.id && <CheckCircle2 size={16} className="text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4">
              <div>
                <p className="text-sm font-semibold text-white">Test-Time Augmentation (TTA)</p>
                <p className="text-xs text-slate-400">Averages multi-angle rotation and flips for maximum clinical accuracy.</p>
              </div>
              <button
                type="button"
                onClick={() => setUseTTA(!useTTA)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  useTTA ? "bg-cyan-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    useTTA ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Upload & Action Panel */}
        <div className="lg:col-span-3">
          <div className="rounded-[28px] border border-violet-400/10 bg-[#0d1429]/90 p-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Step 02</p>
                <h3 className="text-2xl font-extrabold text-white">Upload Fundus Image</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                <Upload size={22} />
              </div>
            </div>

            {/* Preloaded Demo Samples */}
            {samples && samples.length > 0 && (
              <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Quick Test: Load Pre-Verified Demo Scans
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">Click any stage below to test the AI model instantly:</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {samples.map((s) => (
                    <button
                      key={s.stage}
                      type="button"
                      onClick={() => onSelectSample(s)}
                      className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-400 hover:bg-cyan-400/10"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      Stage {s.stage}: {s.stage_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 rounded-[24px] border border-dashed border-blue-400/20 bg-blue-500/5 p-8 text-center transition hover:border-cyan-400/40">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-xl shadow-blue-500/20">
                <Upload size={28} />
              </div>

              <h4 className="mt-4 text-lg font-bold text-white">Select Retinal Fundus Scan</h4>
              <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400">Supported formats: JPG, JPEG, PNG.</p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => document.getElementById("new-scan-file").click()}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-110"
                >
                  <Upload size={17} />
                  Choose File
                </button>

                <button
                  type="button"
                  onClick={onOpenLiveCamera}
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-950/60 hover:bg-cyan-900/80 px-6 py-3 text-sm font-bold text-cyan-200 shadow-lg shadow-cyan-950/50 hover:brightness-110 transition-all"
                >
                  <Camera size={17} className="text-cyan-400 animate-pulse" />
                  Live Ophthalmoscope Capture
                </button>
              </div>

              <input
                id="new-scan-file"
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
            </div>

            {selectedFile && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-xs font-semibold text-slate-400">Image Preview: {selectedFile.name}</p>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Fundus preview"
                  className="mx-auto mt-3 max-h-64 rounded-xl object-contain shadow-lg"
                />

                <button
                  type="button"
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ScanLine size={18} />
                  {isAnalyzing ? "Processing AI Screening & Grad-CAM..." : "Execute AI Screening"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   BATCH SCREENING & TRIAGE VIEW
   ============================================================ */
function BatchScreeningPage({
  batchFiles,
  setBatchFiles,
  batchResults,
  isBatchAnalyzing,
  handleBatchAnalyze,
  onViewItem
}) {
  const getBadge = (stage) => {
    switch (stage) {
      case "Proliferative":
        return "bg-rose-600/20 text-rose-300 border-rose-500/30";
      case "Severe":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Moderate":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Mild":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-12">
      <section className="overflow-hidden rounded-[30px] border border-blue-400/10 bg-gradient-to-br from-[#10265a] via-[#14296c] to-[#24105a] p-8 shadow-2xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Clinical Workflow</p>
        <h1 className="mt-2 text-3xl font-extrabold text-white">Batch Screening & Clinical Triage</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
          Upload multiple retinal images simultaneously. RetinaAI grades each scan and automatically prioritizes urgent cases for ophthalmic referral.
        </p>
      </section>

      <div className="rounded-[28px] border border-blue-400/10 bg-[#0d1429]/90 p-7 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Multi-Scan Upload</h3>
            <p className="text-xs text-slate-400">Select multiple fundus photographs for automated batch processing.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => document.getElementById("batch-files-input").click()}
              className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/20"
            >
              <Upload size={16} />
              Choose Files ({batchFiles.length} selected)
            </button>
            <input
              id="batch-files-input"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              className="hidden"
              onChange={(e) => setBatchFiles(Array.from(e.target.files || []))}
            />

            <button
              type="button"
              onClick={handleBatchAnalyze}
              disabled={batchFiles.length === 0 || isBatchAnalyzing}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-40"
            >
              <Zap size={16} />
              {isBatchAnalyzing ? "Processing Batch..." : "Run Batch Triage"}
            </button>

            {batchResults.length > 0 && (
              <a
                href={`${BACKEND_URL}/api/export/archive-zip`}
                download
                className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 text-sm font-bold text-emerald-300 transition hover:bg-emerald-400/20"
              >
                <Download size={16} />
                Export Batch Archive (ZIP)
              </a>
            )}
          </div>
        </div>

        {batchResults.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-black/40 text-xs font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">Triage Priority</th>
                  <th className="px-5 py-4">Scan File</th>
                  <th className="px-5 py-4">Prediction</th>
                  <th className="px-5 py-4">Confidence</th>
                  <th className="px-5 py-4">Clinical Urgency</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/10">
                {batchResults.map((item, idx) => (
                  <tr key={idx} className="transition hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-mono font-bold text-cyan-400">#{idx + 1}</td>
                    <td className="px-5 py-4 text-white font-medium">{item.filename}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${getBadge(item.prediction)}`}>
                        {item.prediction}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-cyan-300">{item.confidence.toFixed(1)}%</td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-300">{item.urgency || item.risk_level}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onViewItem(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10"
                      >
                        <Eye size={13} />
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   RESULTS VIEW
   ============================================================ */
function ResultsPage({ predictionResult, selectedFile, setActivePage }) {
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showPatientEduModal, setShowPatientEduModal] = useState(false);
  const [showEhrBillingModal, setShowEhrBillingModal] = useState(false);
  const [showVisionSimulatorModal, setShowVisionSimulatorModal] = useState(false);
  const [showVesselAnalyzerModal, setShowVesselAnalyzerModal] = useState(false);

  if (!predictionResult) {
    return (
      <div className="mx-auto max-w-7xl rounded-[28px] border border-blue-400/10 bg-[#0d1429]/90 p-12 text-center shadow-2xl">
        <FileText size={45} className="mx-auto text-violet-400" />
        <h2 className="mt-4 text-xl font-bold">No Active Screening Result</h2>
        <p className="mt-2 text-sm text-slate-400">
          Upload and analyze a retinal fundus image from "New Screening" to view detailed diagnostic results.
        </p>
      </div>
    );
  }

  let originalImageUrl = null;
  if (selectedFile) {
    originalImageUrl = URL.createObjectURL(selectedFile);
  } else if (predictionResult?.uploaded_image) {
    originalImageUrl = predictionResult.uploaded_image.startsWith("http")
      ? predictionResult.uploaded_image
      : `${BACKEND_URL}${predictionResult.uploaded_image}`;
  } else if (predictionResult?.original_image_url) {
    originalImageUrl = predictionResult.original_image_url.startsWith("http")
      ? predictionResult.original_image_url
      : `${BACKEND_URL}${predictionResult.original_image_url}`;
  }

  const heatmapUrl = predictionResult?.heatmap_base64 ||
    (predictionResult?.heatmap_image ? `${BACKEND_URL}${predictionResult.heatmap_image}` : null) ||
    (predictionResult?.heatmap_image_url ? `${BACKEND_URL}${predictionResult.heatmap_image_url}` : null);

  const overlayUrl = predictionResult?.overlay_base64 ||
    (predictionResult?.result_image ? `${BACKEND_URL}${predictionResult.result_image}` : null) ||
    (predictionResult?.overlay_image_url ? `${BACKEND_URL}${predictionResult.overlay_image_url}` : null);

  const reportDownloadUrl = predictionResult.report_url ||
    (predictionResult.screening_id ? `${BACKEND_URL}/api/reports/${predictionResult.screening_id}/download` : null);

  const getRiskBadge = (stage) => {
    switch (stage) {
      case "Proliferative":
        return "bg-rose-600/20 text-rose-300 border-rose-500/30";
      case "Severe":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Moderate":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Mild":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-12">
      {/* Header with Download & Referral Letter Actions */}
      <section className="flex flex-col justify-between gap-4 rounded-[30px] border border-violet-400/10 bg-gradient-to-br from-[#10265a] via-[#14296c] to-[#24105a] p-8 shadow-2xl lg:flex-row lg:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Screening Diagnostic Report</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white">Retinopathy Classification</h1>
          <p className="mt-1 text-sm text-slate-300">
            Patient: <strong className="text-white">{predictionResult.patient_name || "Anonymous"}</strong> (MRN: {predictionResult.patient_id || "N/A"})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <VoiceAssistant predictionResult={predictionResult} />

          <button
            type="button"
            onClick={() => setShowReferralModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
          >
            <Printer size={15} />
            Specialist Referral Letter
          </button>

          <button
            type="button"
            onClick={() => setShowPatientEduModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 px-4 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-blue-500/20 transition hover:brightness-110"
          >
            <HeartPulse size={15} />
            Patient Education Leaflet
          </button>

          <button
            type="button"
            onClick={() => setShowEhrBillingModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-4 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
          >
            <FileCode size={15} />
            ICD-10 & EHR Coding
          </button>

          <button
            type="button"
            onClick={() => setShowVisionSimulatorModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-400 to-purple-400 px-4 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-purple-500/20 transition hover:brightness-110"
          >
            <Eye size={15} />
            Patient Vision Simulator
          </button>

          <button
            type="button"
            onClick={() => setShowVesselAnalyzerModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 px-4 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:brightness-110"
          >
            <GitBranch size={15} />
            Vessel & Tortuosity
          </button>

          {reportDownloadUrl && (
            <a
              href={reportDownloadUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
            >
              <Download size={15} />
              Clinical PDF Report
            </a>
          )}

          <button
            type="button"
            onClick={() => setActivePage("Explainable AI")}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            <Brain size={15} />
            Grad-CAM Analysis
          </button>
        </div>
      </section>

      {/* Main Diagnostic Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Prediction & Confidence */}
        <div className="rounded-[28px] border border-emerald-400/10 bg-[#0d1429]/90 p-7 shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Diagnostic Grading</p>
          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold text-emerald-300">{predictionResult.prediction}</h2>
            <span className={`rounded-xl border px-3 py-1 text-xs font-bold ${getRiskBadge(predictionResult.prediction)}`}>
              {predictionResult.risk_level || "Classified"}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-white/5 bg-black/20 p-4">
              <p className="text-xs text-slate-400">Model Confidence</p>
              <p className="mt-1 text-2xl font-extrabold text-cyan-300">{Number(predictionResult.confidence).toFixed(2)}%</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/20 p-4">
              <p className="text-xs text-slate-400">Lesion Coverage Area</p>
              <p className="mt-1 text-2xl font-extrabold text-violet-300">
                {predictionResult.lesion_area_pct ? `${Number(predictionResult.lesion_area_pct).toFixed(1)}%` : "Calculated"}
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Guidance */}
        <div className="lg:col-span-2 rounded-[28px] border border-blue-400/10 bg-[#0d1429]/90 p-7 shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Clinical Recommendation & Urgency</p>
          <h3 className="mt-2 text-xl font-bold text-white">Recommended Clinical Action</h3>
          <p className="mt-3 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 text-sm leading-relaxed text-blue-200">
            {predictionResult.recommendation ||
              "Evaluate patient retinal scan with a dilated eye examination. Monitor blood pressure and glycemic index control."}
          </p>

          {/* Quality check stats */}
          {predictionResult.quality && (
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/5 bg-black/20 p-3 text-center">
                <p className="text-[10px] uppercase text-slate-500 font-bold">Image Quality</p>
                <p className="mt-1 font-bold text-emerald-400">{predictionResult.quality.status}</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/20 p-3 text-center">
                <p className="text-[10px] uppercase text-slate-500 font-bold">Sharpness</p>
                <p className="mt-1 font-bold text-slate-200">{predictionResult.quality.sharpness}</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/20 p-3 text-center">
                <p className="text-[10px] uppercase text-slate-500 font-bold">Resolution</p>
                <p className="mt-1 font-bold text-slate-200">{predictionResult.quality.resolution}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ISO 10940 Retinal Image Quality QA Inspector */}
      <ImageQualityQAInspector
        quality={predictionResult.quality}
        imageUrl={originalImageUrl || overlayUrl}
      />

      {/* Multi-Model Consensus & Discrepancy Inspector */}
      {predictionResult.model_breakdown && (
        <MultiModelConsensusInspector modelBreakdown={predictionResult.model_breakdown} />
      )}

      {/* Interactive Comparison Slider & 2.5x Magnifier */}
      {(originalImageUrl || overlayUrl) && (
        <ImageComparisonSlider
          originalImage={originalImageUrl}
          overlayImage={overlayUrl}
          heatmapImage={heatmapUrl}
          stageName={predictionResult.prediction}
          confidence={predictionResult.confidence}
        />
      )}

      {/* Probability Distribution */}
      <div className="rounded-[28px] border border-white/10 bg-[#0d1429]/90 p-8 shadow-2xl">
        <h3 className="text-xl font-bold text-white">5-Class Softmax Probability Breakdown</h3>
        <div className="mt-6 space-y-4">
          {(predictionResult.class_names || ["No DR", "Mild", "Moderate", "Severe", "Proliferative"]).map((name, idx) => {
            const prob = predictionResult.probabilities ? Number(predictionResult.probabilities[idx]) : 0;
            const isTop = name === predictionResult.prediction;

            return (
              <div key={name} className="rounded-xl border border-white/5 bg-black/20 p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className={`font-semibold ${isTop ? "text-cyan-300" : "text-slate-300"}`}>{name}</span>
                  <span className="font-bold text-cyan-300">{prob.toFixed(2)}%</span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isTop ? "bg-gradient-to-r from-cyan-400 to-blue-500" : "bg-slate-600"
                    }`}
                    style={{ width: `${Math.max(prob, 1)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ETDRS 9-Zone Retinal Grid & CSME Macular Edema Analyzer */}
      <EtdrsGridOverlay
        imageUrl={originalImageUrl || overlayUrl}
        lesionAreaPct={predictionResult.lesion_area_pct}
        stage={predictionResult.prediction}
      />

      {/* Interactive Clinician Annotation Tool */}
      <ClinicalAnnotationTool
        imageUrl={originalImageUrl || overlayUrl}
        patientName={predictionResult.patient_name}
      />

      {/* Interactive Risk Progression Simulator */}
      <RiskProgressionCalculator initialStage={predictionResult.prediction} />

      {/* Treatment Response & Visual Acuity Prognosis Simulator */}
      <TreatmentPrognosisSimulator stage={predictionResult.prediction} />

      {/* RetinaCopilot AI Clinical Chat Assistant */}
      <RetinaCopilotChat predictionResult={predictionResult} />

      {/* Specialist Referral Letter Modal */}
      <ReferralLetterModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        predictionResult={predictionResult}
      />

      {/* Patient Education Discharge Guide Modal */}
      <PatientEducationModal
        isOpen={showPatientEduModal}
        onClose={() => setShowPatientEduModal(false)}
        predictionResult={predictionResult}
      />

      {/* Clinical ICD-10 & EHR Coding Assistant Modal */}
      <EhrBillingCodeModal
        isOpen={showEhrBillingModal}
        onClose={() => setShowEhrBillingModal(false)}
        screeningResult={predictionResult}
      />

      {/* Patient Vision Perspective Impairment Simulator Modal */}
      <PatientVisionSimulator
        isOpen={showVisionSimulatorModal}
        onClose={() => setShowVisionSimulatorModal(false)}
        currentStage={predictionResult.prediction}
      />

      {/* Automated Retinal Vessel & Tortuosity Analyzer Modal */}
      <VascularVesselAnalyzerModal
        isOpen={showVesselAnalyzerModal}
        onClose={() => setShowVesselAnalyzerModal(false)}
        imageUrl={originalImageUrl || overlayUrl}
        stage={predictionResult.prediction}
      />
    </div>
  );
}

/* ============================================================
   ANALYTICS VIEW
   ============================================================ */
function AnalyticsPage() {
  const models = [
    { name: "Balanced Custom CNN", testAcc: "65.09%", precision: "33.89%", recall: "40.50%", f1: "35.54%", bestVal: "61.20%" },
    { name: "MobileNetV2 (Transfer Learning)", testAcc: "55.09%", precision: "40.75%", recall: "31.41%", f1: "29.68%", bestVal: "61.02%" },
    { name: "Fine-Tuned MobileNetV2", testAcc: "66.73%", precision: "55.12%", recall: "50.45%", f1: "47.84%", bestVal: "62.30%" },
    { name: "EfficientNet-B0", testAcc: "67.64%", precision: "52.94%", recall: "49.24%", f1: "46.58%", bestVal: "71.77%" },
    { name: "Ensemble Multi-Model (Active Champion)", testAcc: "72.91%", precision: "60.10%", recall: "55.99%", f1: "54.70%", bestVal: "76.17% (Wtd)" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-12">
      <section className="rounded-[30px] border border-blue-400/10 bg-gradient-to-br from-[#10265a] via-[#14296c] to-[#24105a] p-8 shadow-2xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Benchmark Diagnostics</p>
        <h1 className="mt-2 text-3xl font-extrabold text-white">Model Comparison & Clinical Metrics</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Empirical evaluation results across five deep learning architectures and ensembles evaluated on 550 held-out test fundus scans.
        </p>
      </section>

      {/* Model Benchmark Table */}
      <div className="rounded-[28px] border border-white/10 bg-[#0d1429]/90 p-7 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-5">Comparative Architecture Benchmarks</h3>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-black/40 text-xs font-bold uppercase text-slate-400">
              <tr>
                <th className="px-5 py-4">Architecture</th>
                <th className="px-5 py-4">Test Accuracy</th>
                <th className="px-5 py-4">Macro Precision</th>
                <th className="px-5 py-4">Macro Recall</th>
                <th className="px-5 py-4">Macro F1</th>
                <th className="px-5 py-4">Best Val Acc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/10">
              {models.map((m, idx) => (
                <tr key={idx} className={idx === 4 ? "bg-cyan-500/10 font-semibold text-white" : ""}>
                  <td className="px-5 py-4 text-white">
                    {m.name}
                    {idx === 4 && <span className="ml-2 rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] text-cyan-300 font-bold">Top Performer</span>}
                  </td>
                  <td className="px-5 py-4 text-cyan-400 font-bold">{m.testAcc}</td>
                  <td className="px-5 py-4 text-slate-300">{m.precision}</td>
                  <td className="px-5 py-4 text-slate-300">{m.recall}</td>
                  <td className="px-5 py-4 text-violet-400 font-bold">{m.f1}</td>
                  <td className="px-5 py-4 text-slate-400">{m.bestVal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DarkStat({ title, value, detail, icon: Icon, color }) {
  const colors = {
    blue: "from-cyan-400 to-blue-500",
    violet: "from-violet-400 to-purple-600",
    orange: "from-orange-400 to-pink-500",
    green: "from-emerald-400 to-teal-500",
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/5 bg-[#0d1429] p-5 shadow-2xl">
      <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${colors[color]} opacity-10 blur-xl`}></div>
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>
          <p className="mt-1 text-[10px] text-slate-500">{detail}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${colors[color]} text-white shadow-lg`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function StatusRow({ name, status }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-emerald-400/5 bg-emerald-400/[0.025] px-4 py-3">
      <span className="text-xs font-semibold text-slate-300">{name}</span>
      <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        {status}
      </span>
    </div>
  );
}

export default App;
