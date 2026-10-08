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
    <div className="min-h-screen bg-[#070b18] text-white">
      <aside
        className={
          sidebarOpen
            ? "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-blue-500/10 bg-[#0b1022]"
            : "fixed left-0 top-0 z-50 flex h-screen w-20 flex-col border-r border-blue-500/10 bg-[#0b1022]"
        }
      >
        <div className="flex h-20 items-center border-b border-white/5 px-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
            <Activity size={23} />
          </div>

          {sidebarOpen && (
            <div className="ml-3">
              <h1 className="text-lg font-bold">RetinaAI</h1>
              <p className="text-[10px] text-blue-300/60">
                AI Screening Platform
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-7">
          {sidebarOpen && (
            <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300/40">
              Workspace
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
                      ? "flex w-full items-center rounded-2xl border border-blue-400/20 bg-gradient-to-r from-blue-600/80 to-violet-600/80 px-3 py-3.5 text-left text-white shadow-lg shadow-blue-950/30"
                      : "flex w-full items-center rounded-2xl px-3 py-3.5 text-left text-slate-400 transition hover:bg-white/5 hover:text-white"
                  }
                >
                  <Icon size={19} />

                  {sidebarOpen && (
                    <span className="ml-3 text-sm font-semibold">
                      {item.name}
                    </span>
                  )}

                  {sidebarOpen && active && (
                    <ChevronRight size={16} className="ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/5 p-4">
          <button className="flex w-full items-center rounded-2xl px-3 py-3 text-slate-400 hover:bg-white/5 hover:text-white">
            <Settings size={19} />

            {sidebarOpen && (
              <span className="ml-3 text-sm font-semibold">
                Settings
              </span>
            )}
          </button>

          {sidebarOpen && (
            <div className="mt-4 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p className="text-xs font-bold">Prototype Mode</p>
                  <p className="text-[10px] text-slate-500">
                    Academic project
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className={sidebarOpen ? "ml-64" : "ml-20"}>
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-blue-500/10 bg-[#070b18]/90 px-8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-xl p-2.5 text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                RetinaAI
              </p>

              <h2 className="text-xl font-bold">
                {activePage}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-4 py-2 md:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>

              <span className="text-xs font-semibold text-emerald-400">
                AI System Online
              </span>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 font-bold shadow-lg shadow-blue-500/20">
              R
            </div>
          </div>
        </header>

        <div className="relative min-h-[calc(100vh-80px)] overflow-hidden p-8">
          <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"></div>

          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl"></div>

          <div className="relative">
            {activePage === "Dashboard" ? (
              <Dashboard />
            ) : (
              <PlaceholderPage page={activePage} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[30px] border border-blue-400/20 bg-gradient-to-br from-[#10265a] via-[#14296c] to-[#24105a] p-9 shadow-2xl shadow-blue-950/40">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"></div>

        <div className="absolute -bottom-32 right-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl"></div>

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5">
            <Sparkles size={14} className="text-cyan-300" />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
              Explainable AI Screening
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Intelligent retinal
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
              screening with AI.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
            Analyze retinal fundus images using a lightweight deep-learning
            model and visualize model attention using Grad-CAM.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-110">
              <ScanLine size={18} />
              Start New Screening
            </button>

            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
              <Brain size={18} />
              Explore AI Model
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DarkStat
          title="Total Screenings"
          value="128"
          detail="+12 this week"
          icon={ScanLine}
          color="blue"
        />

        <DarkStat
          title="Model Accuracy"
          value="70.36%"
          detail="Fine-tuned MobileNetV2"
          icon={Brain}
          color="violet"
        />

        <DarkStat
          title="Avg. Confidence"
          value="84.7%"
          detail="Across recent screenings"
          icon={Zap}
          color="orange"
        />

        <DarkStat
          title="System Status"
          value="Healthy"
          detail="API & model online"
          icon={CheckCircle2}
          color="green"
        />
      </section>

      {/* MAIN */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* UPLOAD */}
        <div className="xl:col-span-3 rounded-[28px] border border-blue-400/10 bg-[#0d1429]/90 p-7 shadow-2xl shadow-black/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                Screening
              </p>

              <h2 className="mt-2 text-2xl font-extrabold">
                Start New Screening
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload a retinal fundus image for AI analysis.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-cyan-400">
              <Upload size={21} />
            </div>
          </div>

          <div className="mt-7 rounded-[24px] border border-dashed border-blue-400/20 bg-gradient-to-br from-blue-500/5 to-violet-500/5 p-10 text-center transition hover:border-cyan-400/40 hover:bg-blue-500/10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-xl shadow-blue-500/20">
              <Upload size={28} />
            </div>

            <h3 className="mt-5 text-lg font-bold">
              Upload retinal image
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              JPG, JPEG, or PNG images are supported for the AI
              screening pipeline.
            </p>

            <button className="mt-6 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/30 hover:brightness-110">
              Select Image
            </button>

            <p className="mt-3 text-[10px] text-slate-600">
              Recommended resolution: 224 × 224 or higher
            </p>
          </div>
        </div>

        {/* OUTPUT */}
        <div className="xl:col-span-2 rounded-[28px] border border-violet-400/10 bg-[#0d1429]/90 p-7 shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
                Latest Analysis
              </p>

              <h2 className="mt-2 text-2xl font-extrabold">
                Model Output
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
              <Brain size={21} />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-400/10 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-emerald-400">
                Predicted Class
              </p>

              <CheckCircle2
                size={19}
                className="text-emerald-400"
              />
            </div>

            <p className="mt-3 text-3xl font-extrabold text-emerald-300">
              No DR
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Model confidence: 92.14%
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <DarkProbability
              label="No DR"
              value="92.14%"
              width="92%"
              gradient="from-cyan-400 to-blue-500"
            />

            <DarkProbability
              label="Mild"
              value="4.21%"
              width="4%"
              gradient="from-violet-400 to-purple-500"
            />

            <DarkProbability
              label="Moderate"
              value="2.81%"
              width="3%"
              gradient="from-orange-400 to-pink-500"
            />

            <DarkProbability
              label="Severe"
              value="0.52%"
              width="1%"
              gradient="from-red-400 to-rose-500"
            />

            <DarkProbability
              label="Proliferative"
              value="0.32%"
              width="1%"
              gradient="from-slate-400 to-slate-600"
            />
          </div>

          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/30 hover:brightness-110">
            View Full Result
            <ChevronRight size={17} />
          </button>
        </div>
      </section>

      {/* LOWER */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DarkInfoCard
          title="AI Model"
          subtitle="Fine-tuned MobileNetV2"
          icon={Brain}
          gradient="from-violet-500/20 to-blue-500/5"
          items={[
            ["Accuracy", "70.36%"],
            ["Input Size", "224 × 224"],
            ["Classes", "5"],
            ["Explainability", "Grad-CAM"],
          ]}
        />

        <DarkInfoCard
          title="System Status"
          subtitle="All core services operational"
          icon={ShieldCheck}
          gradient="from-emerald-500/20 to-cyan-500/5"
          status
        />
      </section>

      {/* DISCLAIMER */}
      <section className="rounded-2xl border border-amber-400/10 bg-amber-400/5 p-5">
        <div className="flex gap-3">
          <ShieldCheck className="shrink-0 text-amber-400" size={19} />

          <div>
            <h3 className="text-sm font-bold text-amber-300">
              Academic Prototype
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              RetinaAI is an academic screening prototype and is not a
              medical diagnostic system. Model outputs should be reviewed
              by a qualified healthcare professional.
            </p>
          </div>
        </div>
      </section>

      <footer className="pb-3 text-center text-[11px] text-slate-600">
        RetinaAI · Lightweight CNN · Multi-Class Classification ·
        Explainable AI · Grad-CAM
      </footer>
    </div>
  );
}

function DarkStat({
  title,
  value,
  detail,
  icon: Icon,
  color,
}) {
  const colors = {
    blue: "from-cyan-400 to-blue-500",
    violet: "from-violet-400 to-purple-600",
    orange: "from-orange-400 to-pink-500",
    green: "from-emerald-400 to-teal-500",
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/5 bg-[#0d1429] p-5 shadow-2xl shadow-black/20">
      <div
        className={
          "absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br " +
          colors[color] +
          " opacity-10 blur-xl"
        }
      ></div>

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-2xl font-extrabold">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-slate-600">
            {detail}
          </p>
        </div>

        <div
          className={
            "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br " +
            colors[color] +
            " text-white shadow-lg"
          }
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function DarkProbability({
  label,
  value,
  width,
  gradient,
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between">
        <span className="text-xs font-semibold text-slate-400">
          {label}
        </span>

        <span className="text-xs font-bold text-slate-300">
          {value}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
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

function DarkInfoCard({
  title,
  subtitle,
  icon: Icon,
  gradient,
  items,
  status,
}) {
  return (
    <div className="overflow-hidden rounded-[26px] border border-white/5 bg-[#0d1429] shadow-2xl shadow-black/20">
      <div className={"bg-gradient-to-r " + gradient + " p-6"}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-cyan-300">
            <Icon size={22} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              RetinaAI
            </p>

            <h3 className="mt-1 text-lg font-extrabold">
              {title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {status ? (
        <div className="space-y-3 p-6">
          <StatusRow name="FastAPI Backend" status="Operational" />
          <StatusRow name="AI Model" status="Loaded" />
          <StatusRow name="Grad-CAM" status="Ready" />
          <StatusRow name="Image Processing" status="Ready" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 p-6">
          {items.map((item) => (
            <div
              key={item[0]}
              className="rounded-2xl border border-white/5 bg-white/[0.025] p-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                {item[0]}
              </p>

              <p className="mt-2 text-sm font-extrabold text-slate-200">
                {item[1]}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusRow({ name, status }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-emerald-400/5 bg-emerald-400/[0.025] px-4 py-3">
      <span className="text-xs font-semibold text-slate-400">
        {name}
      </span>

      <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        {status}
      </span>
    </div>
  );
}

function PlaceholderPage({ page }) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="overflow-hidden rounded-[30px] border border-blue-400/10 bg-[#0d1429] shadow-2xl shadow-black/30">
        <div className="bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-cyan-500/10 p-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
            RetinaAI Module
          </p>

          <h1 className="mt-3 text-4xl font-extrabold">
            {page}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            This screen is separated from the main dashboard and is
            ready for backend integration.
          </p>
        </div>

        <div className="p-8">
          <div className="rounded-2xl border border-blue-400/10 bg-blue-500/5 p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600">
              <Activity size={22} />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Module ready
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Frontend structure is ready. The next step is to connect
              this screen with the FastAPI backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;