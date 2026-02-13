import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Download, PieChart as PieIcon, BarChart2 } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import { downloadReport } from "../lib/chatClient";
const ACCENT_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];
const LINE_A = "#38bdf8";
const LINE_B = "#8b5cf6";
const Card = ({ children }) => (_jsx("div", { className: "rounded-2xl bg-neutral-900 border border-white/5 p-4 sm:p-6", children: children }));
function n(x, d = 2) {
    const num = typeof x === "number" ? x : parseFloat(x);
    return Number.isFinite(num) ? parseFloat(num.toFixed(d)) : 0;
}
function safe(x, fb = "-") {
    return x === undefined || x === null ? fb : String(x);
}
function normalizeSectors(rows = []) {
    return rows.map((r) => ({
        sector: safe(r.sector),
        sector_priority: n(r.sector_priority, 1),
        mean_return: n(r.mean_return, 1),
        Low_pct: n(r.Low_pct, 1),
        Moderate_pct: n(r.Moderate_pct, 1),
        High_pct: n(r.High_pct, 1),
    }));
}
function normalizeIssuers(rows = []) {
    return rows.map((r) => ({
        issuer_name: safe(r.issuer_name),
        sector: safe(r.sector),
        issue_year: n(r.issue_year, 0),
        priority_score_0_100: n(r.priority_score_0_100, 1),
    }));
}
async function loadData() {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const r = await fetch(`${apiUrl}/context`);
        if (r.ok) {
            const ctx = await r.json();
            return {
                sectors: normalizeSectors(ctx.sectors),
                issuers: normalizeIssuers(ctx.issuers),
            };
        }
    }
    catch { }
    const [sec, iss] = await Promise.allSettled([
        fetch(`${apiUrl}/sector-summary`),
        fetch(`${apiUrl}/scores`)
    ]);
    let sectors = [];
    let issuers = [];
    if (sec.status === "fulfilled" && sec.value.ok)
        sectors = normalizeSectors(await sec.value.json());
    if (iss.status === "fulfilled" && iss.value.ok)
        issuers = normalizeIssuers(await iss.value.json());
    return { sectors, issuers };
}
export default function Regulators() {
    const [loading, setLoading] = useState(true);
    const [sectors, setSectors] = useState([]);
    const [issuers, setIssuers] = useState([]);
    const [selectedSector, setSelectedSector] = useState("All");
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { sectors, issuers } = await loadData();
                setSectors(sectors);
                setIssuers(issuers);
            }
            finally {
                setLoading(false);
            }
        })();
    }, []);
    const riskMix = useMemo(() => {
        const count = Math.max(sectors.length, 1);
        return [
            { risk: "Low", value: n(sectors.reduce((s, x) => s + (x.Low_pct ?? 0), 0) / count) },
            { risk: "Moderate", value: n(sectors.reduce((s, x) => s + (x.Moderate_pct ?? 0), 0) / count) },
            { risk: "High", value: n(sectors.reduce((s, x) => s + (x.High_pct ?? 0), 0) / count) },
        ];
    }, [sectors]);
    const pvr = useMemo(() => sectors.map((s) => ({
        name: s.sector,
        priority: s.sector_priority,
        returnPct: s.mean_return,
    })), [sectors]);
    const ipo = useMemo(() => {
        const list = selectedSector === "All"
            ? issuers
            : issuers.filter((x) => x.sector === selectedSector);
        return [...list]
            .sort((a, b) => b.priority_score_0_100 - a.priority_score_0_100)
            .slice(0, 10);
    }, [issuers, selectedSector]);
    return (_jsxs("div", { className: "min-h-screen bg-black text-white", children: [_jsx("div", { className: "sticky top-0 z-20 bg-black/80 backdrop-blur-xl px-4 sm:px-6 py-4 sm:py-6 border-b border-white/5", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-4xl font-bold tracking-tight", children: "Regulatory Dashboard" }), _jsx("p", { className: "mt-1 text-white/60 text-xs sm:text-sm", children: "Sector stability \u2022 Risk signals \u2022 Oversight metrics" })] }), _jsxs("button", { onClick: async () => {
                                try {
                                    await downloadReport("regulator");
                                }
                                catch { }
                            }, className: "bg-white text-black px-4 py-2 rounded-xl font-semibold flex items-center gap-2 text-sm sm:text-base", children: [_jsx(Download, { size: 18 }), "Report"] })] }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12", children: [_jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8", children: [_jsxs(Card, { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-lg sm:text-xl font-semibold", children: "Risk Composition" }), _jsx(PieIcon, { size: 18, className: "text-sky-300" })] }), _jsx("div", { className: "h-56 sm:h-72", children: _jsx(ResponsiveContainer, { children: _jsxs(PieChart, { children: [_jsx(Pie, { data: riskMix, dataKey: "value", nameKey: "risk", innerRadius: "55%", outerRadius: "80%", children: riskMix.map((_, i) => (_jsx(Cell, { fill: ACCENT_COLORS[i] }, i))) }), _jsx(RTooltip, { contentStyle: { background: "#111", border: "1px solid #333" } })] }) }) })] }), _jsxs(Card, { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-lg sm:text-xl font-semibold", children: "Sector Volatility" }), _jsx(BarChart2, { size: 18, className: "text-indigo-300" })] }), _jsx("div", { className: "h-56 sm:h-72", children: _jsx(ResponsiveContainer, { children: _jsxs(BarChart, { data: sectors.map((s) => ({
                                                    name: s.sector,
                                                    volatility: n(s.mean_return ?? 0),
                                                })), layout: "vertical", children: [_jsx(CartesianGrid, { stroke: "#1f2937" }), _jsx(XAxis, { type: "number", tick: { fill: "#cbd5e1" } }), _jsx(YAxis, { type: "category", dataKey: "name", tick: { fill: "#cbd5e1" }, width: 100 }), _jsx(RTooltip, { contentStyle: { background: "#111", border: "1px solid #333" } }), _jsx(Bar, { dataKey: "volatility", fill: "#38bdf8", radius: [4, 4, 4, 4] })] }) }) })] })] }), _jsxs(Card, { children: [_jsx("div", { className: "flex items-center justify-between mb-4", children: _jsx("h2", { className: "text-lg sm:text-xl font-semibold", children: "Priority vs Return" }) }), _jsx("div", { className: "h-64 sm:h-80", children: _jsx(ResponsiveContainer, { children: _jsxs(LineChart, { data: pvr, children: [_jsx(CartesianGrid, { stroke: "#1f2937" }), _jsx(XAxis, { dataKey: "name", tick: { fill: "#cbd5e1" } }), _jsx(YAxis, { tick: { fill: "#cbd5e1" } }), _jsx(RTooltip, { contentStyle: { background: "#111", border: "1px solid #333" } }), _jsx(Line, { type: "monotone", dataKey: "priority", stroke: LINE_A, strokeWidth: 3, dot: false }), _jsx(Line, { type: "monotone", dataKey: "returnPct", stroke: LINE_B, strokeWidth: 2, dot: false })] }) }) })] }), _jsxs(Card, { children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", children: [_jsx("h2", { className: "text-lg sm:text-xl font-semibold", children: "IPO Rankings" }), _jsxs("select", { value: selectedSector, onChange: (e) => setSelectedSector(e.target.value), className: "px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-xs sm:text-sm", children: [_jsx("option", { value: "All", children: "All sectors" }), Array.from(new Set(sectors.map((s) => s.sector))).map((s) => (_jsx("option", { value: s, children: s }, s)))] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-xs sm:text-sm", children: [_jsx("thead", { className: "text-white/60", children: _jsxs("tr", { className: "text-left", children: [_jsx("th", { className: "py-2 pr-4", children: "#" }), _jsx("th", { className: "py-2 pr-4", children: "Issuer" }), _jsx("th", { className: "py-2 pr-4", children: "Sector" }), _jsx("th", { className: "py-2 pr-4", children: "Year" }), _jsx("th", { className: "py-2 pr-4", children: "Score" })] }) }), _jsx("tbody", { children: ipo.map((r, i) => (_jsxs("tr", { className: "border-t border-white/10", children: [_jsx("td", { className: "py-2 pr-4 text-white/70", children: i + 1 }), _jsx("td", { className: "py-2 pr-4", children: r.issuer_name }), _jsx("td", { className: "py-2 pr-4 text-white/70", children: r.sector }), _jsx("td", { className: "py-2 pr-4 text-white/70", children: r.issue_year || "-" }), _jsx("td", { className: "py-2 pr-4 font-semibold text-cyan-300", children: r.priority_score_0_100.toFixed(1) })] }, i))) })] }) })] })] })] }));
}
