import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Investors.tsx — mobile optimized, desktop untouched
import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Send, MessageCircle, X, PieChart as PieIcon } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Pie, Cell, PieChart as RePieChart } from "recharts";
import ChatMessage from "../components/ChatMessage";
import QuestionChips from "../components/QuestionChips";
import { askLLM, downloadReport } from "../lib/chatClient";
function n(x, d = 2) {
    const num = typeof x === "number" ? x : parseFloat(x);
    return Number.isFinite(num) ? parseFloat(num.toFixed(d)) : 0;
}
async function loadLocalContext() {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const r = await fetch(`${apiUrl}/context`);
        if (r.ok)
            return await r.json();
    }
    catch { }
    const ctx = {};
    try {
        const a = await fetch(`${apiUrl}/sector-summary`);
        if (a.ok)
            ctx.sectors = await a.json();
    }
    catch { }
    try {
        const b = await fetch(`${apiUrl}/scores`);
        if (b.ok)
            ctx.issuers = await b.json();
    }
    catch { }
    return ctx;
}
const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
const SUGGESTIONS = [
    "Which sector is safest to invest in 2025?",
    "What are the top 3 performing IPOs in Technology?",
    "Summarize risk trends across sectors.",
    "How does inflation impact IPO performance?",
];
export default function Investors() {
    const [context, setContext] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loadingChat, setLoadingChat] = useState(false);
    const [openChat, setOpenChat] = useState(false);
    const listRef = useRef(null);
    function pushMessage(role, content) {
        setMessages(prev => [...prev, { id: crypto.randomUUID(), role, content }]);
    }
    async function handleSend(e) {
        e?.preventDefault();
        const text = input.trim();
        if (!text)
            return;
        setInput("");
        pushMessage("user", text);
        setLoadingChat(true);
        try {
            const reply = await askLLM(text);
            pushMessage("assistant", reply);
        }
        catch {
            pushMessage("assistant", "⚠️ Unable to reach the model.");
        }
        finally {
            setLoadingChat(false);
            queueMicrotask(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));
        }
    }
    useEffect(() => {
        (async () => setContext(await loadLocalContext()))();
    }, []);
    const sectors = context?.sectors || [];
    const issuers = context?.issuers || [];
    const topSectors = useMemo(() => ([...sectors]
        .filter((s) => Number.isFinite(s.sector_priority))
        .sort((a, b) => b.sector_priority - a.sector_priority)
        .slice(0, 4)), [sectors]);
    const avgRiskMix = useMemo(() => {
        const total = Math.max(sectors.length, 1);
        return [
            { name: "Low Risk", value: sectors.reduce((s, x) => s + (x.Low_pct || 0), 0) / total },
            { name: "Moderate Risk", value: sectors.reduce((s, x) => s + (x.Moderate_pct || 0), 0) / total },
            { name: "High Risk", value: sectors.reduce((s, x) => s + (x.High_pct || 0), 0) / total },
        ];
    }, [sectors]);
    const sectorReturns = useMemo(() => (sectors
        .filter((s) => Number.isFinite(s.mean_return))
        .map((s) => ({
        name: s.sector,
        priority: n(s.sector_priority),
        return: n(s.mean_return)
    }))), [sectors]);
    const ipoLeaders = useMemo(() => ([...issuers]
        .filter((x) => Number.isFinite(x.priority_score_0_100))
        .sort((a, b) => b.priority_score_0_100 - a.priority_score_0_100)
        .slice(0, 6)), [issuers]);
    return (_jsxs("div", { className: "min-h-screen bg-black text-white", children: [_jsx("div", { className: "sticky top-0 bg-black/80 backdrop-blur-xl px-4 sm:px-6 py-4 sm:py-6 border-b border-white/5 z-10", children: _jsxs("div", { className: "max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-4xl font-bold", children: "Investor Dashboard" }), _jsx("p", { className: "text-white/60 text-xs sm:text-sm", children: "Sector health \u2022 Market signals \u2022 IPO performance" })] }), _jsxs("button", { className: "bg-white text-black px-4 py-2 rounded-xl font-semibold flex items-center gap-2 text-sm sm:text-base", onClick: () => downloadReport("investor"), children: [_jsx(Download, { size: 18 }), "Report"] })] }) }), _jsxs("main", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10", children: [_jsx("section", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: topSectors.map((s, i) => (_jsxs("div", { className: "bg-neutral-900 p-5 rounded-2xl border border-white/5 space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-sm text-white/60", children: s.sector }), _jsx(PieIcon, { size: 16, className: "text-cyan-300" })] }), _jsx("p", { className: "text-3xl font-bold text-cyan-300", children: n(s.sector_priority) }), _jsxs("p", { className: "text-xs text-white/50", children: ["Avg return: ", n(s.mean_return), "%"] })] }, i))) }), _jsxs("section", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-neutral-900 p-6 rounded-2xl border border-white/5", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Risk Composition" }), _jsx("div", { className: "h-56 sm:h-64", children: _jsx(ResponsiveContainer, { children: _jsxs(RePieChart, { children: [_jsx(Pie, { data: avgRiskMix, dataKey: "value", nameKey: "name", innerRadius: "50%", outerRadius: "80%", children: avgRiskMix.map((_, i) => (_jsx(Cell, { fill: COLORS[i] }, i))) }), _jsx(Tooltip, { contentStyle: { background: "#111", border: "1px solid #333" } })] }) }) })] }), _jsxs("div", { className: "bg-neutral-900 p-6 rounded-2xl border border-white/5", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Priority vs Returns" }), _jsx("div", { className: "h-56 sm:h-64", children: _jsx(ResponsiveContainer, { children: _jsxs(LineChart, { data: sectorReturns, children: [_jsx(CartesianGrid, { stroke: "#1f2937" }), _jsx(XAxis, { dataKey: "name", tick: { fill: "#cbd5e1" } }), _jsx(YAxis, { tick: { fill: "#cbd5e1" } }), _jsx(Tooltip, { contentStyle: { background: "#111", border: "1px solid #333" } }), _jsx(Line, { type: "monotone", dataKey: "priority", stroke: "#38bdf8", strokeWidth: 2, dot: false }), _jsx(Line, { type: "monotone", dataKey: "return", stroke: "#8b5cf6", strokeWidth: 2, dot: false })] }) }) })] })] }), _jsxs("section", { className: "bg-neutral-900 p-6 rounded-2xl border border-white/5", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Top Indian IPOs" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-xs sm:text-sm", children: [_jsx("thead", { className: "text-white/60", children: _jsxs("tr", { children: [_jsx("th", { className: "py-2 pr-4 text-left", children: "#" }), _jsx("th", { className: "py-2 pr-4 text-left", children: "Issuer" }), _jsx("th", { className: "py-2 pr-4 text-left", children: "Sector" }), _jsx("th", { className: "py-2 pr-4 text-left", children: "Score" })] }) }), _jsx("tbody", { children: ipoLeaders.map((r, i) => (_jsxs("tr", { className: "border-t border-white/10", children: [_jsx("td", { className: "py-2 pr-4 text-white/70", children: i + 1 }), _jsx("td", { className: "py-2 pr-4", children: r.issuer_name }), _jsx("td", { className: "py-2 pr-4 text-white/70", children: r.sector }), _jsx("td", { className: "py-2 pr-4 font-semibold text-cyan-300", children: n(r.priority_score_0_100) })] }, i))) })] }) })] })] }), _jsxs("button", { onClick: () => setOpenChat(true), className: "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white text-black px-3 sm:px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-sm sm:text-base font-semibold hover:bg-neutral-200 transition z-50", children: [_jsx(MessageCircle, { size: 18 }), "Insight Advisor"] }), openChat && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, className: "bg-neutral-950 w-[95%] sm:w-[700px] max-h-[90vh] sm:max-h-[80vh] rounded-2xl border border-white/10 p-4 sm:p-6 flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h2", { className: "text-lg font-semibold", children: "AI Insights Assistant" }), _jsx("button", { onClick: () => setOpenChat(false), children: _jsx(X, { size: 22, className: "text-white/60 hover:text-white" }) })] }), _jsx(QuestionChips, { suggestions: SUGGESTIONS, onPick: (q) => setInput(q) }), _jsxs("div", { ref: listRef, className: "mt-4 p-4 flex-1 overflow-y-auto bg-neutral-900 rounded-xl border border-white/5 space-y-3", children: [messages.length === 0 ? (_jsx("p", { className: "text-white/50", children: "Ask anything about sectors, returns, or IPO signals." })) : (messages.map((m) => _jsx(ChatMessage, { msg: m }, m.id))), loadingChat && _jsx("p", { className: "text-white/60", children: "Thinking\u2026" })] }), _jsxs("form", { onSubmit: handleSend, className: "mt-4 flex items-end gap-2", children: [_jsx("textarea", { value: input, onChange: (e) => setInput(e.target.value), className: "w-full resize-none bg-neutral-900 border border-white/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-white/20 outline-none", rows: 2, placeholder: "Ask a question\u2026" }), _jsxs("button", { type: "submit", disabled: !input.trim() || loadingChat, className: "bg-white text-black px-4 py-2 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-40", children: [_jsx(Send, { size: 18 }), "Send"] })] })] }) }))] }));
}
