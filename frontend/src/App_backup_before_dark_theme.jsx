import { useState } from "react";
import {
  Activity,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  FileText,
  History,
  Home,
  Menu,
  ScanLine,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: Home },
  { name: "New Screening", icon: ScanLine },
  { name: "Results", icon: FileText },
  { name: "Explainable AI", icon: Brain },
  { name: "Analytics", icon: BarChart3 },
  { name: "History", icon: History },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#eef4ff]">
      {/* SIDEBAR */}
      <aside
        className={
          sidebarOpen
            ? "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gradient-to-b from-[#101a3a] via-[#162454] to-[#111936] text-white shadow-2xl"
            : "fixed inset-y-0 left-0 z-50 flex w-20 flex-col bg-gradient-to-b from-[#101a3a] via-[#162454] to-[#111936] text-white shadow-2xl"
        }
      >
        {/* BRAND */}
        <div className="flex h-20 items-center border-b border-white/10 px-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-blue-900/40">
            <Activity size={23} strokeWidth={2.5} />
          </div>

          {sidebarOpen && (
            <div className="ml-3">
              <h1 className="text-lg font-bold tracking-tight">
                RetinaAI
              </h1>

              <p className="text-[11px] text-blue-200">
                Intelligent Eye Screening
              </p>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 px-3 py-7">
          {sidebarOpen && (
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300/60">
              Main Menu
            </p>
          )}

          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => setActivePage(item.name)}
                  className={
                    active
                      ? "group flex w-full items-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-3 py-3.5 text-left text-white shadow-lg shadow-blue-950/30"
                      : "group flex w-full items-center rounded-2xl px-3 py-3.5 text-left text-blue-100/65 transition hover:bg-white/10 hover:text-white"
                  }
                >
                  <Icon size={19} />

                  {sidebarOpen && (
                    <span className="ml-3 text-sm font-semibold">
                      {item.name}
                    </span>
                  )}

                  {sidebarOpen && active && (
                    <ChevronRight
                      size={16}
                      className="ml-auto opacity-80"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SIDEBAR BOTTOM */}
        <div className="border-t border-white/10 p-4">
          <button className="flex w-full items-center rounded-2xl px-3 py-3 text-blue-100/70 transition hover:bg-white/10 hover:text-white">
            <Settings size={19} />

            {sidebarOpen && (
              <span className="ml-3 text-sm font-semibold">
                Settings
              </span>
            )}
          </button>

          {sidebarOpen && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p className="text-xs font-bold text-white">
                    Prototype Mode
                  </p>

                  <p className="mt-0.5 text-[10px] text-blue-200/60">
                    Academic project
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <main className={sidebarOpen ? "ml-64" : "ml-20"}>
        {/* TOP BAR */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-blue-100 bg-white/90 px-8 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-xl p-2.5 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                RetinaAI Platform
              </p>

              <h2 className="text-xl font-bold text-slate-800">
                {activePage}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 md:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>

              <span className="text-xs font-bold text-emerald-700">
                AI System Online
              </span>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-md">
              R
            </div>
          </div>
        </header>

        {/* PAGE */}
        <div className="p-8">
          {activePage === "Dashboard" ? (
            <Dashboard />
          ) : (
            <PlaceholderPage page={activePage} />
          )}
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1939a6] via-[#3157d9] to-[#7438d8] p-8 shadow-2xl shadow-blue-200 md:p-10">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-2xl"></div>
        <div className="absolute -bottom-32 right-40 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
            <Sparkles size={14} className="text-cyan-200" />

            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-100">
              Explainable AI Screening
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
            Smarter retinal screening
            <br />
            <span className="text-cyan-200">
              powered by AI.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-100 md:text-base">
            Analyze retinal fundus images with a lightweight deep-learning
            model and understand its predictions using Grad-CAM
            explainability.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-xl transition hover:-translate-y-0.5 hover:bg-blue-50">
              <ScanLine size={18} />
              Start New Screening
            </button>

            <button className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20">
              <Brain size={18} />
              Explore AI Model
            </button>
          </div>
        </div>
      </section>

      {/* STAT CARDS */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Screenings"
          value="128"
          detail="+12 this week"
          icon={ScanLine}
          gradient="from-blue-500 to-cyan-500"
        />

        <StatCard
          title="Model Accuracy"
          value="70.36%"
          detail="Fine-tuned MobileNetV2"
          icon={Brain}
          gradient="from-violet-500 to-purple-600"
        />

        <StatCard
          title="Avg. Confidence"
          value="84.7%"
          detail="Across recent screenings"
          icon={Zap}
          gradient="from-orange-400 to-pink-500"
        />

        <StatCard
          title="System Status"
          value="Healthy"
          detail="API & model online"
          icon={CheckCircle2}
          gradient="from-emerald-400 to-teal-500"
        />
      </section>

      {/* MAIN CONTENT */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* UPLOAD */}
        <div className="xl:col-span-3 rounded-[26px] border border-blue-100 bg-white p-7 shadow-xl shadow-blue-100/50">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>

                <p className="text-[11px] font-bold uppercase tracking-widest text-blue-500">
                  Screening
                </p>
              </div>

              <h2 className="mt-2 text-2xl font-extrabold text-slate-800">
                Start New Screening
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload a retinal fundus image for AI analysis.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <Upload size={21} />
            </div>
          </div>

          <div className="mt-7 rounded-[22px] border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-9 text-center transition hover:border-blue-400 hover:bg-blue-50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-200">
              <Upload size={28} />
            </div>

            <h3 className="mt-5 text-lg font-extrabold text-slate-800">
              Upload retinal image
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              JPG, JPEG, or PNG images are supported. The image will be
              processed by the RetinaAI screening pipeline.
            </p>

            <button className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl">
              Select Image
            </button>

            <p className="mt-3 text-[11px] font-medium text-slate-400">
              Recommended resolution: 224 × 224 or higher
            </p>
          </div>
        </div>

        {/* OUTPUT */}
        <div className="xl:col-span-2 rounded-[26px] border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/40 p-7 shadow-xl shadow-indigo-100/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500">
                Latest Analysis
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-slate-800">
                Model Output
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
              <Brain size={21} />
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white shadow-lg shadow-emerald-100">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-emerald-50">
                Predicted Class
              </p>

              <CheckCircle2 size={19} />
            </div>

            <p className="mt-3 text-3xl font-extrabold">
              No DR
            </p>

            <p className="mt-1 text-xs text-emerald-50">
              Model confidence: 92.14%
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <Probability
              label="No DR"
              value="92.14%"
              width="92%"
              gradient="from-blue-500 to-cyan-400"
            />

            <Probability
              label="Mild"
              value="4.21%"
              width="4%"
              gradient="from-violet-500 to-purple-500"
            />

            <Probability
              label="Moderate"
              value="2.81%"
              width="3%"
              gradient="from-orange-400 to-pink-500"
            />

            <Probability
              label="Severe"
              value="0.52%"
              width="1%"
              gradient="from-rose-500 to-red-500"
            />

            <Probability
              label="Proliferative"
              value="0.32%"
              width="1%"
              gradient="from-slate-500 to-slate-700"
            />
          </div>

          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700">
            View Full Result
            <ChevronRight size={17} />
          </button>
        </div>
      </section>

      {/* LOWER CARDS */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* MODEL */}
        <div className="overflow-hidden rounded-[26px] border border-purple-100 bg-white shadow-xl shadow-purple-100/40">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <Brain size={22} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-purple-100">
                  AI Engine
                </p>

                <h3 className="text-lg font-extrabold">
                  Fine-tuned MobileNetV2
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-6">
            <InfoBox title="Accuracy" value="70.36%" />
            <InfoBox title="Input Size" value="224 × 224" />
            <InfoBox title="Classes" value="5" />
            <InfoBox title="Explainability" value="Grad-CAM" />
          </div>
        </div>

        {/* STATUS */}
        <div className="overflow-hidden rounded-[26px] border border-emerald-100 bg-white shadow-xl shadow-emerald-100/40">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-50">
                  Infrastructure
                </p>

                <h3 className="text-lg font-extrabold">
                  System Status
                </h3>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-6">
            <StatusRow name="FastAPI Backend" status="Operational" />
            <StatusRow name="AI Model" status="Loaded" />
            <StatusRow name="Grad-CAM" status="Ready" />
            <StatusRow name="Image Processing" status="Ready" />
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="rounded-[22px] border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <ShieldCheck size={18} />
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-amber-900">
              Academic Prototype
            </h3>

            <p className="mt-1 text-xs leading-5 text-amber-800">
              RetinaAI is an academic screening prototype and is not a
              medical diagnostic system. Model outputs should be reviewed
              by a qualified healthcare professional.
            </p>
          </div>
        </div>
      </section>

      <footer className="pb-3 text-center text-xs font-medium text-slate-400">
        RetinaAI · Lightweight CNN · Multi-Class Classification ·
        Explainable AI · Grad-CAM
      </footer>
    </div>
  );
}

function StatCard({
  title,
  value,
  detail,
  icon: Icon,
  gradient,
}) {
  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-white bg-white p-5 shadow-xl shadow-blue-100/50 transition hover:-translate-y-1">
      <div
        className={
          "absolute right-0 top-0 h-24 w-24 rounded-bl-[60px] bg-gradient-to-br " +
          gradient +
          " opacity-10"
        }
      ></div>

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-2xl font-extrabold text-slate-800">
            {value}
          </p>

          <p className="mt-1 text-[11px] font-medium text-slate-400">
            {detail}
          </p>
        </div>

        <div
          className={
            "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br " +
            gradient +
            " text-white shadow-lg"
          }
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function Probability({
  label,
  value,
  width,
  gradient,
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600">
          {label}
        </span>

        <span className="text-xs font-bold text-slate-700">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={
            "h-full rounded-full bg-gradient-to-r " +
            gradient
          }
          style={{ width: width }}
        ></div>
      </div>
    </div>
  );
}

function InfoBox({ title, value }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-sm font-extrabold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function StatusRow({ name, status }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3">
      <span className="text-xs font-bold text-slate-700">
        {name}
      </span>

      <span className="flex items-center gap-2 text-[11px] font-bold text-emerald-600">
        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
        {status}
      </span>
    </div>
  );
}

function PlaceholderPage({ page }) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-xl shadow-blue-100/50">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-9 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-100">
            RetinaAI Module
          </p>

          <h1 className="mt-3 text-4xl font-extrabold">
            {page}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
            This module is separated from the dashboard and is ready
            for connection with the RetinaAI backend.
          </p>
        </div>

        <div className="p-9">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Activity size={22} />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-slate-800">
              Module ready
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              The frontend structure is ready. We can now connect this
              screen to the FastAPI backend without changing the AI
              model or Grad-CAM implementation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;