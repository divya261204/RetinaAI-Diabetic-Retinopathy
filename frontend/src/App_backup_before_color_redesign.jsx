import { useState } from "react";
import {
  Activity,
  BarChart3,
  Brain,
  CheckCircle2,
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

const navigation = [
  { name: "Dashboard", icon: Home },
  { name: "New Screening", icon: ScanLine },
  { name: "Results", icon: FileText },
  { name: "Explainable AI", icon: Brain },
  { name: "Analytics", icon: BarChart3 },
  { name: "History", icon: History },
];

const stats = [
  {
    label: "Total Screenings",
    value: "128",
    detail: "+12 this week",
  },
  {
    label: "Model Accuracy",
    value: "70.36%",
    detail: "Fine-tuned MobileNetV2",
  },
  {
    label: "Avg. Confidence",
    value: "84.7%",
    detail: "Across recent screenings",
  },
  {
    label: "System Status",
    value: "Healthy",
    detail: "API & model online",
  },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const showPage = (page) => {
    setActivePage(page);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* SIDEBAR */}
      <aside
        className={
          sidebarOpen
            ? "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-slate-950 text-white"
            : "fixed left-0 top-0 z-40 flex h-screen w-20 flex-col bg-slate-950 text-white"
        }
      >
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-slate-800 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Activity size={22} />
          </div>

          {sidebarOpen && (
            <div className="ml-3">
              <div className="text-lg font-bold tracking-tight">RetinaAI</div>
              <div className="text-xs text-slate-400">AI Screening Platform</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {sidebarOpen ? "Workspace" : ""}
          </div>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => showPage(item.name)}
                  className={
                    active
                      ? "flex w-full items-center rounded-xl bg-blue-600 px-3 py-3 text-left text-white"
                      : "flex w-full items-center rounded-xl px-3 py-3 text-left text-slate-400 hover:bg-slate-900 hover:text-white"
                  }
                >
                  <Icon size={19} />

                  {sidebarOpen && (
                    <span className="ml-3 text-sm font-medium">
                      {item.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-slate-800 p-4">
          <button className="flex w-full items-center rounded-xl px-3 py-3 text-slate-400 hover:bg-slate-900 hover:text-white">
            <Settings size={19} />

            {sidebarOpen && (
              <span className="ml-3 text-sm font-medium">Settings</span>
            )}
          </button>

          {sidebarOpen && (
            <div className="mt-4 rounded-xl bg-slate-900 p-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />

                <div>
                  <p className="text-xs font-semibold text-white">
                    Prototype Mode
                  </p>

                  <p className="text-xs text-slate-500">
                    Academic project
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <main
        className={
          sidebarOpen
            ? "ml-64 min-h-screen"
            : "ml-20 min-h-screen"
        }
      >
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-sm font-medium text-slate-500">
                RetinaAI
              </p>

              <h1 className="text-xl font-bold text-slate-900">
                {activePage}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-medium text-emerald-700">
                System Online
              </span>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              R
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-8">
          {activePage === "Dashboard" && <Dashboard />}

          {activePage !== "Dashboard" && (
            <PlaceholderPage page={activePage} />
          )}
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={18} />

            <span className="text-sm font-semibold uppercase tracking-wider text-blue-100">
              Explainable AI Screening
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight">
            Intelligent retinal screening,
            <br />
            designed for clarity.
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">
            Analyze fundus images using a lightweight deep-learning model
            with transparent AI explanations through Grad-CAM.
          </p>

          <button className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 shadow-lg hover:bg-blue-50">
            <ScanLine size={18} />
            Start New Screening
          </button>
        </div>

        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white opacity-10"></div>
        <div className="absolute -bottom-24 right-20 h-72 w-72 rounded-full bg-cyan-300 opacity-10"></div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {stat.label}
            </p>

            <div className="mt-3 flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-900">
                {stat.value}
              </h3>

              {stat.label === "System Status" && (
                <CheckCircle2
                  size={25}
                  className="text-emerald-500"
                />
              )}
            </div>

            <p className="mt-2 text-xs text-slate-500">
              {stat.detail}
            </p>
          </div>
        ))}
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* UPLOAD */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Start New Screening
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Upload a retinal fundus image for AI analysis.
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Upload size={22} />
            </div>
          </div>

          <div className="mt-7 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center hover:border-blue-400 hover:bg-blue-50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Upload size={28} />
            </div>

            <h4 className="mt-5 text-lg font-semibold text-slate-900">
              Upload retinal image
            </h4>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Choose a JPG, JPEG, or PNG fundus image. The image will be
              processed by the RetinaAI screening model.
            </p>

            <button className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
              Select Image
            </button>

            <p className="mt-3 text-xs text-slate-400">
              Recommended image size: 224 × 224 or higher
            </p>
          </div>
        </div>

        {/* RECENT OUTPUT */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Recent Model Output
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Latest screening
              </p>
            </div>

            <Brain size={23} className="text-indigo-600" />
          </div>

          <div className="mt-7 rounded-2xl bg-emerald-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-700">
                Predicted class
              </span>

              <CheckCircle2
                size={20}
                className="text-emerald-600"
              />
            </div>

            <h4 className="mt-3 text-3xl font-bold text-emerald-800">
              No DR
            </h4>

            <p className="mt-1 text-sm text-emerald-700">
              Model confidence: 92.14%
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <Probability label="No DR" value="92.14%" width="92%" />
            <Probability label="Mild" value="4.21%" width="4%" />
            <Probability label="Moderate" value="2.81%" width="3%" />
            <Probability label="Severe" value="0.52%" width="1%" />
            <Probability
              label="Proliferative"
              value="0.32%"
              width="1%"
            />
          </div>

          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            View Full Result
          </button>
        </div>
      </section>

      {/* BOTTOM CARDS */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Brain size={22} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                AI Model
              </h3>

              <p className="text-sm text-slate-500">
                Fine-tuned MobileNetV2
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <InfoBox title="Accuracy" value="70.36%" />
            <InfoBox title="Input" value="224 × 224" />
            <InfoBox title="Classes" value="5" />
            <InfoBox title="Explainability" value="Grad-CAM" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                System Status
              </h3>

              <p className="text-sm text-slate-500">
                All core services operational
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <StatusRow name="FastAPI Backend" status="Operational" />
            <StatusRow name="AI Model" status="Loaded" />
            <StatusRow name="Grad-CAM" status="Ready" />
            <StatusRow name="Image Processing" status="Ready" />
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 shrink-0 text-amber-600" />

          <div>
            <h4 className="font-semibold text-amber-900">
              Academic Prototype
            </h4>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              RetinaAI is an academic screening prototype and is not a
              medical diagnostic system. Model outputs should be reviewed
              by a qualified healthcare professional.
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-200 pt-6 text-center text-sm text-slate-400">
        RetinaAI · Lightweight CNN · Multi-Class Classification ·
        Explainable AI
      </footer>
    </div>
  );
}

function Probability({ label, value, width }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold text-slate-700">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: width }}
        ></div>
      </div>
    </div>
  );
}

function InfoBox({ title, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StatusRow({ name, status }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{name}</span>

      <span className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
        {status}
      </span>
    </div>
  );
}

function PlaceholderPage({ page }) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <FileText size={25} />
        </div>

        <h2 className="mt-6 text-3xl font-bold text-slate-900">
          {page}
        </h2>

        <p className="mt-3 max-w-2xl text-slate-500">
          This module is ready for integration with the RetinaAI
          backend. The dashboard navigation is separated into
          independent application screens.
        </p>

        <div className="mt-8 rounded-2xl bg-slate-50 p-6">
          <p className="text-sm font-medium text-slate-700">
            Module status
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Frontend screen created successfully.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;