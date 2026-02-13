import { jsx as _jsx } from "react/jsx-runtime";
export default function QuestionChips({ suggestions, onPick }) {
    return (_jsx("div", { className: "flex flex-wrap gap-2", children: suggestions.map((q, idx) => (_jsx("button", { className: "glass px-3 py-1 text-sm hover:bg-white/15", onClick: () => onPick(q), children: q }, idx))) }));
}
