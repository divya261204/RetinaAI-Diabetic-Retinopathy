import { useEffect, useState } from "react";
import { History, Search, FileText, Trash2, Download, Eye, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";

const API_BASE = typeof window !== "undefined" && window.location.port === "5173" ? "http://127.0.0.1:8000" : "";

export default function HistoryPage({ onViewResult }) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `${API_BASE}/api/history`;
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (stageFilter !== "All") params.append("stage", stageFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setHistory(data.history);
      } else {
        // Fallback to localStorage
        const saved = JSON.parse(localStorage.getItem("retina_history") || "[]");
        setHistory(saved);
      }
    } catch (err) {
      console.warn("Backend fetch failed, using local storage:", err);
      const saved = JSON.parse(localStorage.getItem("retina_history") || "[]");
      setHistory(saved);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [stageFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this screening record?")) return;

    try {
      await fetch(`${API_BASE}/api/history/${id}`, { method: "DELETE" });
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      // Remove from local state
      setHistory((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all screening history? This cannot be undone.")) return;

    try {
      await fetch(`${API_BASE}/api/history`, { method: "DELETE" });
      localStorage.removeItem("retina_history");
      setHistory([]);
    } catch (err) {
      localStorage.removeItem("retina_history");
      setHistory([]);
    }
  };

  const getStageBadgeColor = (stage) => {
    switch (stage) {
      case "No DR":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Mild":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "Moderate":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Severe":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "Proliferative":
        return "bg-rose-600/20 text-rose-300 border-rose-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  return (
    <div className="mx-auto max-w-7xl pb-12">
      <div className="rounded-[30px] border border-blue-400/10 bg-[#0d1429] p-8 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
              <History size={26} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Database Records</p>
              <h1 className="text-3xl font-extrabold text-white">Patient Screening History</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`${API_BASE}/api/export/archive-zip`}
              download
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition hover:brightness-110"
            >
              <Download size={14} />
              Download Clinical Archive (ZIP)
            </a>
            <a
              href={`${API_BASE}/api/export/csv`}
              download
              className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
            >
              <Download size={14} />
              Export CSV
            </a>
            <button
              type="button"
              onClick={fetchHistory}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={history.length === 0}
              className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-40"
            >
              <Trash2 size={15} />
              Clear All
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name, ID, or DR stage..."
              className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </form>

          {/* Stage Filter */}
          <div className="flex flex-wrap gap-1.5">
            {["All", "No DR", "Mild", "Moderate", "Severe", "Proliferative"].map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => setStageFilter(stage)}
                className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                  stageFilter === stage
                    ? "border-cyan-400 bg-cyan-400/20 text-cyan-300"
                    : "border-white/10 bg-black/20 text-slate-400 hover:text-white"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        {/* Records Table */}
        {isLoading ? (
          <div className="mt-8 rounded-2xl border border-white/10 p-12 text-center">
            <RefreshCw size={30} className="mx-auto animate-spin text-cyan-400" />
            <p className="mt-4 text-sm text-slate-400">Loading screening records...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <FileText size={28} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">No screening records found</h3>
            <p className="mt-1 text-sm text-slate-400">
              Completed screenings will automatically appear here with diagnostic details and downloadable PDF reports.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-black/40 text-xs font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">Patient / ID</th>
                  <th className="px-5 py-4">Diagnosis</th>
                  <th className="px-5 py-4">Confidence</th>
                  <th className="px-5 py-4">Lesion Area</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/10">
                {history.map((item) => (
                  <tr key={item.id} className="transition hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-medium text-white">
                      <div>{item.patient_name || item.name || "Anonymous"}</div>
                      <div className="text-xs font-mono text-slate-500">{item.patient_id || item.id}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${getStageBadgeColor(item.prediction)}`}>
                        {item.prediction}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-cyan-400">
                      {Number(item.confidence || 0).toFixed(1)}%
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-300">
                      {item.lesion_area_pct ? `${Number(item.lesion_area_pct).toFixed(1)}%` : "N/A"}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {item.created_at || item.date || "Recent"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.report_filename && (
                          <a
                            href={`${API_BASE}/api/reports/${item.id}/download`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20"
                            title="Download Clinical PDF Report"
                          >
                            <Download size={13} />
                            PDF
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => onViewResult(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10"
                        >
                          <Eye size={13} />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteItem(item.id, e)}
                          className="inline-flex items-center rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 text-xs text-red-400 hover:bg-red-500/20"
                          title="Delete Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
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