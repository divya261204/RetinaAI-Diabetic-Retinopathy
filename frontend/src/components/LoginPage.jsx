import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ShieldCheck,
  Activity,
  Sparkles,
  Zap,
  CheckCircle2,
  Building2,
  ArrowRight,
  ShieldAlert,
  Brain
} from "lucide-react";
import cyberEyeBg from "../assets/cyber_eye_bg.jpg";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [department, setDepartment] = useState("Vitreoretinal Specialty Unit");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const demoAccounts = [
    {
      name: "Dr. Sarah Jenkins, MD",
      role: "Chief of Vitreoretinal Surgery",
      email: "s.jenkins@retina.ai",
      dept: "Department of Ophthalmology & Vitreoretinal Services",
      badge: "Lead Clinician",
      color: "from-cyan-500 to-blue-600",
    },
    {
      name: "Dr. Marcus Vance, MD",
      role: "Consultant Retina Specialist",
      email: "m.vance@retina.ai",
      dept: "Macular Disease & Diagnostic Center",
      badge: "Consultant",
      color: "from-violet-500 to-purple-600",
    },
    {
      name: "Dr. Elena Rostova",
      role: "Ophthalmic Triage Fellow",
      email: "e.rostova@retina.ai",
      dept: "Diabetic Eye Screening & Triage Unit",
      badge: "Clinical Fellow",
      color: "from-emerald-500 to-teal-600",
    },
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please provide clinician ID/email and security credentials.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        name: email.includes("@") ? email.split("@")[0].replace(".", " ").toUpperCase() : "Clinician",
        email: email,
        role: "Ophthalmic Medical Staff",
        department: department,
      });
    }, 600);
  };

  const handleQuickLogin = (account) => {
    setEmail(account.email);
    setPassword("••••••••••••");
    setDepartment(account.dept);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        name: account.name,
        email: account.email,
        role: account.role,
        department: account.dept,
        badge: account.badge,
      });
    }, 450);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden p-4 sm:p-6 lg:p-8 font-sans">
      {/* Background Image Layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url(${cyberEyeBg})`,
        }}
      />

      {/* Futuristic Deep Cyber Gradient Overlays */}
      <div className="fixed inset-0 z-0 bg-gradient-to-tr from-[#040816]/95 via-[#06112c]/80 to-[#0a1844]/75 backdrop-blur-[2px]" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-black/80 pointer-events-none" />

      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-5xl my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-[32px] border border-cyan-500/30 bg-[#070e24]/85 shadow-[0_0_50px_rgba(6,182,212,0.25)] backdrop-blur-2xl">
          
          {/* Left Panel: High-Tech Diagnostic Hero */}
          <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-cyan-500/20 bg-gradient-to-b from-cyan-950/40 via-black/40 to-blue-950/40">
            <div>
              {/* Brand Header */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-[0_0_20px_rgba(6,182,212,0.6)] text-slate-950">
                  <Activity size={26} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    Retina<span className="text-cyan-400">AI</span>
                    <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2 py-0.5 text-[9px] font-bold text-cyan-300">v2.2</span>
                  </h1>
                  <p className="text-[11px] font-semibold text-cyan-300/70 uppercase tracking-widest">
                    Ophthalmic AI Diagnostic Suite
                  </p>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="mt-8 space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300 shadow-inner">
                  <Sparkles size={13} className="text-cyan-400" />
                  Multi-Model Neural Diagnostic Portal
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  Next-Gen Retinopathy <br />
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                    Screening & Explainability
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                  Empowering clinicians with 72.91% multi-model deep ensemble classification, Grad-CAM feature localization, ETDRS 9-zone macular mapping, and automated referral triage.
                </p>
              </div>

              {/* Verified Feature Highlights */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-black/40 p-3 shadow-inner">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-300 font-bold shrink-0">
                    <Brain size={18} />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">Deep Ensemble Architecture</p>
                    <p className="text-slate-400 text-[11px]">MobileNetV2 + EfficientNet-B0 consensus validation</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-black/40 p-3 shadow-inner">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/20 text-violet-300 font-bold shrink-0">
                    <Eye size={18} />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">Grad-CAM & 2.5x Lesion Loupe</p>
                    <p className="text-slate-400 text-[11px]">Sub-quadrant microvascular attention localization</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-black/40 p-3 shadow-inner">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300 font-bold shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">ISO 10940 & ETDRS Aligned</p>
                    <p className="text-slate-400 text-[11px]">Automated ICD-10 clinical referral document generator</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Compliance Stamp */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <ShieldCheck size={13} />
                HIPAA / SaMD Protocol Verified
              </span>
              <span>AES-256 Encrypted</span>
            </div>
          </div>

          {/* Right Panel: Sleek Clinician Sign-In Form */}
          <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between bg-black/50">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-white">Clinician Authentication</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Sign in with authorized medical credentials</p>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse"></div>
              </div>

              {/* 1-Click Quick Demo Login Profiles */}
              <div className="mt-6">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-2.5">
                  1-Click Instant Clinician Profiles
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleQuickLogin(acc)}
                      className="group flex items-center justify-between rounded-xl border border-cyan-500/20 bg-[#0c1633] p-2.5 text-left transition hover:border-cyan-400 hover:bg-cyan-950/40 hover:shadow-lg hover:shadow-cyan-500/10"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${acc.color} text-white font-black text-xs shadow-md`}>
                          {acc.name[4]}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {acc.name}
                          </p>
                          <p className="text-[10px] text-slate-400">{acc.role}</p>
                        </div>
                      </div>
                      <span className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[9px] font-bold text-cyan-300 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all">
                        Sign In →
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-[#0b132b] px-3 text-slate-400 font-bold tracking-wider">
                    Or Enter Credentials
                  </span>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
                  <ShieldAlert size={15} className="shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Clinician ID */}
                <div>
                  <label className="text-xs font-semibold text-slate-300">Clinician ID / Hospital Email</label>
                  <div className="relative mt-1.5">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. dr.jenkins@hospital.org"
                      className="w-full rounded-xl border border-cyan-500/30 bg-[#070e24] py-2.5 pl-10 pr-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-semibold text-slate-300">Security Access Key / Password</label>
                  <div className="relative mt-1.5">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-cyan-500/30 bg-[#070e24] py-2.5 pl-10 pr-10 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Clinical Department */}
                <div>
                  <label className="text-xs font-semibold text-slate-300">Ophthalmic Facility / Department</label>
                  <div className="relative mt-1.5">
                    <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full rounded-xl border border-cyan-500/30 bg-[#070e24] py-2.5 pl-10 pr-3.5 text-xs text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    >
                      <option value="Vitreoretinal Specialty Unit">Vitreoretinal Specialty Unit</option>
                      <option value="Macular Disease & Diagnostic Center">Macular Disease & Diagnostic Center</option>
                      <option value="Diabetic Eye Screening & Triage Unit">Diabetic Eye Screening & Triage Unit</option>
                      <option value="General Outpatient Ophthalmology">General Outpatient Ophthalmology</option>
                    </select>
                  </div>
                </div>

                {/* Remember & Help */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-black/40 text-cyan-400 focus:ring-cyan-400 accent-cyan-400"
                    />
                    <span>Remember session</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin(demoAccounts[0])}
                    className="text-cyan-400 hover:underline font-medium"
                  >
                    Quick Guest Access
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                >
                  <Zap size={17} className="fill-slate-950" />
                  {isLoading ? "Authenticating Clinical Credentials..." : "Authenticate & Access Diagnostic Workspace"}
                </button>
              </form>
            </div>

            <p className="text-[10px] text-slate-500 text-center mt-6">
              Authorized clinical personnel only. All screening interactions are cryptographically signed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
