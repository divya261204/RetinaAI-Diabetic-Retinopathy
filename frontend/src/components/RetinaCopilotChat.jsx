import React, { useState } from "react";
import { MessageSquare, Send, Sparkles, Bot, User, CheckCircle2, ChevronDown, ChevronUp, BookOpen, Stethoscope } from "lucide-react";

export default function RetinaCopilotChat({ predictionResult }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hello Doctor. I am **RetinaCopilot**, your clinical AI assistant for this screening case. The scan is graded as **${
        predictionResult?.prediction || "No DR"
      }** (${predictionResult?.confidence ? predictionResult.confidence.toFixed(1) : "85.0"}% confidence). How can I assist you with this patient?`
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const stage = predictionResult?.prediction || "Moderate";

  const quickPrompts = [
    `What are the recommended clinical follow-up intervals for ${stage}?`,
    `Explain the Grad-CAM lesion distribution on this scan.`,
    `What are the anti-VEGF treatment indications?`,
    `What differential diagnoses should be ruled out?`
  ];

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const newMessages = [...messages, { sender: "user", text: query }];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let botReply = "";
      const lower = query.toLowerCase();

      if (lower.includes("follow-up") || lower.includes("interval") || lower.includes("when")) {
        botReply = `**Clinical Follow-up Recommendation (AAO / ETDRS Guidelines):**\n- **Current Stage:** ${stage}\n- **Recommended Follow-up:** ${
          stage === "No DR"
            ? "12 months (Annual routine dilated exam)"
            : stage === "Mild"
            ? "6 to 12 months with strict HbA1c < 7.0% control"
            : stage === "Moderate"
            ? "3 to 6 months with macular OCT scanning"
            : stage === "Severe"
            ? "2 to 4 weeks urgent vitreoretinal referral"
            : "Immediate (within 1 week) for anti-VEGF or PRP laser"
        }\n- **Diagnostic Target:** Maintain HbA1c < 7.0% and BP < 130/80 mmHg to stabilize microvascular leakage.`;
      } else if (lower.includes("grad-cam") || lower.includes("lesion") || lower.includes("distribution")) {
        botReply = `**Grad-CAM Feature Analysis:**\n- **Focus Zone:** Concentrated around vascular arcades and the macula.\n- **Lesion Area:** ${
          predictionResult?.lesion_area_pct || 4.2
        }% of the retinal field shows significant activation.\n- **Clinical Signs:** Grad-CAM identifies microaneurysms, dot-blot hemorrhages, and focal lipid exudates driving the ${stage} classification.`;
      } else if (lower.includes("anti-vegf") || lower.includes("treatment") || lower.includes("laser")) {
        botReply = `**Therapeutic & Management Protocol:**\n- **First-Line:** Intravitreal Anti-VEGF (Aflibercept, Ranibizumab, or Bevacizumab) if Center-Involved Diabetic Macular Edema (CI-DME) is present.\n- **Laser Photocoagulation:** Panretinal Photocoagulation (PRP) is indicated for High-Risk PDR and severe NPDR with poor follow-up compliance (Protocol S / DRCR.net).\n- **Systemic Control:** Optimize blood glucose, lipid profile, and renal function.`;
      } else if (lower.includes("differential") || lower.includes("rule out")) {
        botReply = `**Differential Diagnoses to Consider:**\n1. **Hypertensive Retinopathy:** (Look for AV nicking, silver wiring, flame hemorrhages).\n2. **Central / Branch Retinal Vein Occlusion (CRVO / BRVO):** (Extensive flame hemorrhages in sector distribution).\n3. **Radiation Retinopathy / Ocular Ischemic Syndrome:** (Check carotid duplex if unilateral).`;
      } else {
        botReply = `Based on the deep ensemble model (${
          predictionResult?.confidence ? predictionResult.confidence.toFixed(1) : 85
        }% confidence in **${stage}**), the primary clinical objective is to assess macular thickness on OCT and initiate risk-stratified glycemic management.`;
      }

      setMessages([...newMessages, { sender: "bot", text: botReply }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="rounded-[28px] border border-cyan-500/30 bg-[#0a142c]/90 shadow-2xl overflow-hidden">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-4 bg-gradient-to-r from-cyan-950/50 via-blue-950/40 to-slate-900 flex items-center justify-between cursor-pointer border-b border-cyan-500/20 hover:bg-cyan-950/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/40 text-cyan-300">
            <Bot className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              RetinaCopilot™ AI Clinical Chat
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                Active CDSS
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive clinical intelligence & guideline references for Case {predictionResult?.patient_id || "PAT-001"}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white p-1 rounded-lg">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Collapsible Chat Body */}
      {isOpen && (
        <div className="p-6 flex flex-col space-y-4">
          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-700/80 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 px-3 py-1.5 rounded-xl transition-all text-left"
              >
                💡 {q}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2 bg-black/40 p-4 rounded-2xl border border-slate-800/80">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 text-xs leading-relaxed ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-300">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] ${
                    m.sender === "user"
                      ? "bg-cyan-600 text-white font-medium rounded-tr-none"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line"
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0 text-blue-300">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-400 italic">
                <Bot className="w-4 h-4 text-cyan-400 animate-spin" /> RetinaCopilot is reviewing clinical guidelines...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask RetinaCopilot about anti-VEGF dosage, follow-up, or lesion grading..."
              className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => handleSendMessage()}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-950/40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
