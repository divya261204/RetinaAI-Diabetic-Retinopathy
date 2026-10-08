import { useState } from "react";
import {
  Activity,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  History,
  Home,
  Menu,
  ScanLine,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

const pages = [
  { name: "Dashboard", icon: Home },
  { name: "New Screening", icon: ScanLine },
  { name: "Results", icon: FileText },
  { name: "Explainable AI", icon: Brain },
  { name: "Analytics", icon: BarChart3 },
  { name: "History", icon: History },
];

function App() {
  const [page, setPage] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (name) => {
    setPage(name);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
            <Activity size={21} />
          </div>

          <div>
            <div className="font-bold">RetinaAI</div>
            <div className="text-xs text-slate-400">AI Screening</div>
          </div>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl border border-slate-200 p-2"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-b border-slate-200 bg-white p-4 lg:hidden">
          <div className="space-y-1">
            {pages.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.name)}
                  className={
                    page === item.name
                      ? "flex w-full items-center gap-3 rounded-xl bg-teal-500 px-4 py-3 text-left text-sm font-semibold text-white"
                      : "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-600 hover:bg-teal-50"
                  }
                >
                  <Icon size={18} />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-500 text-white shadow-lg">
                <Activity size={25} />
              </div>

              <div>
                <div className="text-xl font-extrabold">RetinaAI</div>
                <div className="text-xs text-slate-400">
                  AI Screening Platform
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <div className="mb-3 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Workspace
            </div>

            <div className="space-y-1">
              {pages.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.name)}
                    className={
                      page === item.name
                        ? "flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-md"
                        : "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-teal-50 hover:text-teal-700"
                    }
                  >
                    <Icon size={18} />
                    {item.name}
                  </button>
                );
              })}
            </div>

            <div className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              System
            </div>

            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50">
              <Settings size={18} />
              Settings
            </button>
          </nav>

          <div className="border-t border-slate-200 p-5">
            <div className="rounded-2xl bg-slate-900 p-5 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck size={18} />
                Academic Prototype
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                AI-assisted retinal screening and explainability research
                platform.
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                System operational
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {/* Top bar */}
          <div className="hidden items-center justify-between border-b border-slate-200 bg-white px-8 py-5 lg:flex">
            <div>
              <div className="text-xs font-medium text-slate-400">
                RetinaAI / Workspace
              </div>

              <h1 className="mt-1 text-2xl font-bold">{page}</h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="rounded-xl border border-slate-200 p-2.5 text-slate-500">
                <Clock3 size={18} />
              </button>

              <div className="h-8 w-px bg-slate-200" />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 font-bold text-white">
                  R
                </div>

                <div>
                  <div className="text-sm font-semibold">
                    Research Workspace
                  </div>
                  <div className="text-xs text-slate-400">
                    Student Project
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard */}
          {page === "Dashboard" && (
            <Dashboard navigate={navigate} />
          )}

          {/* Placeholder pages */}
          {page !== "Dashboard" && (
            <PlaceholderPage page={page} navigate={navigate} />
          )}
        </main>
      </div>
    </div>
  );
}

function Dashboard({ navigate }) {
  return (
    <div className="p-5 sm:p-7 lg:p-9">
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-600 p-7 text-white shadow-xl sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
              <Sparkles size={14} />
              Lightweight CNN + Grad-CAM
            </div>

            <h2 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
              Intelligent retinal screening with explainable AI.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-cyan-50 sm:text-base">
              Analyze retinal fundus images using a lightweight deep-learning
              pipeline and visualize regions contributing to the model output.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("New Screening")}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-700 shadow-lg"
              >
                <ScanLine size={18} />
                Start Screening
                <ChevronRight size={17} />
              </button>

              <button
                onClick={() => navigate("Explainable AI")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white"
              >
                <Brain size={18} />
                Explore Grad-CAM
              </button>
            </div>
          </div>

          <div className="hidden justify-center lg:flex">
            <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-white/20">
              <div className="absolute inset-6 rounded-full border border-white/20" />
              <div className="absolute inset-12 rounded-full border border-white/20" />

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15">
                <Brain size={48} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          title="Total Screenings"
          value="128"
          detail="+12 this week"
          icon={<ScanLine size={20} />}
          box="bg-teal-50 text-teal-600"
        />

        <Stat
          title="Model Accuracy"
          value="70.36%"
          detail="Fine-tuned MobileNetV2"
          icon={<Brain size={20} />}
          box="bg-violet-50 text-violet-600"
        />

        <Stat
          title="Avg. Confidence"
          value="84.7%"
          detail="Recent model outputs"
          icon={<Activity size={20} />}
          box="bg-cyan-50 text-cyan-600"
        />

        <Stat
          title="System Status"
          value="Healthy"
          detail="All modules operational"
          icon={<CheckCircle2 size={20} />}
          box="bg-emerald-50 text-emerald-600"
        />
      </section>

      {/* Main cards */}
      <section className="mt-7 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold">Start New Screening</h3>
              <p className="mt-1 text-sm text-slate-500">
                Upload a retinal fundus image for analysis.
              </p>
            </div>

            <div className="rounded-xl bg-teal-50 p-3 text-teal-600">
              <Upload size={20} />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-sm">
              <Upload size={28} />
            </div>

            <h4 className="mt-5 font-bold">Upload retinal image</h4>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              JPG, JPEG and PNG images are supported.
            </p>

            <button
              onClick={() => navigate("New Screening")}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
            >
              Choose Image
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold">Recent Model Output</h3>
              <p className="mt-1 text-sm text-slate-500">
                Latest screening summary
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Model prediction
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="text-3xl font-extrabold">No DR</div>
                <div className="mt-1 text-sm text-slate-500">
                  Model confidence
                </div>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white font-extrabold text-emerald-600 shadow-sm">
                92%
              </div>
            </div>

            <div className="mt-5 h-2 rounded-full bg-white">
              <div className="h-full w-[92%] rounded-full bg-emerald-500" />
            </div>
          </div>

          <button
            onClick={() => navigate("Results")}
            className="mt-4 flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold"
          >
            View screening results
            <ChevronRight size={17} />
          </button>
        </div>
      </section>

      {/* Bottom cards */}
      <section className="mt-7 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">AI Model</h3>
              <p className="mt-1 text-sm text-slate-500">
                Current experiment
              </p>
            </div>

            <Brain className="text-violet-500" size={23} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Mini title="Architecture" value="MobileNetV2" />
            <Mini title="Input Size" value="224 × 224" />
            <Mini title="Classes" value="5" />
            <Mini title="Accuracy" value="70.36%" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-500" size={23} />

            <div>
              <h3 className="text-lg font-bold">System Status</h3>
              <p className="text-sm text-slate-500">
                Application modules
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Status title="FastAPI Backend" />
            <Status title="TensorFlow Model" />
            <Status title="Grad-CAM" />
            <Status title="Image Preprocessing" />
          </div>
        </div>
      </section>

      <footer className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
        RetinaAI · Lightweight CNN · Multi-Class Classification · Explainable AI
        · Grad-CAM
      </footer>
    </div>
  );
}

function PlaceholderPage({ page, navigate }) {
  return (
    <div className="flex min-h-[calc(100vh-90px)] items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
          <ScanLine size={30} />
        </div>

        <h2 className="mt-6 text-2xl font-bold">{page}</h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
          This screen is ready for the next development stage. We will connect
          it to the existing FastAPI, TensorFlow and Grad-CAM backend without
          replacing the working backend.
        </p>

        <button
          onClick={() => navigate("Dashboard")}
          className="mt-6 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

function Stat({ title, value, detail, icon, box }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </div>

          <div className="mt-2 text-2xl font-extrabold">{value}</div>

          <div className="mt-1 text-xs text-slate-500">{detail}</div>
        </div>

        <div className={"rounded-xl p-3 " + box}>{icon}</div>
      </div>
    </div>
  );
}

function Mini({ title, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs text-slate-400">{title}</div>
      <div className="mt-1 text-sm font-bold">{value}</div>
    </div>
  );
}

function Status({ title }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        <span className="text-sm font-semibold">{title}</span>
      </div>

      <span className="text-xs font-semibold text-emerald-600">
        Operational
      </span>
    </div>
  );
}

export default App;