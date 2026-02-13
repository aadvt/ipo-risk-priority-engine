import { jsx as _jsx } from "react/jsx-runtime";
// ChatMessage.tsx — with Markdown rendering
import ReactMarkdown from "react-markdown";
export default function ChatMessage({ msg }) {
    const isUser = msg.role === "user";
    return (_jsx("div", { className: `flex ${isUser ? "justify-end" : "justify-start"}`, children: _jsx("div", { className: `max-w-[80%] px-4 py-3 rounded-2xl border ${isUser
                ? "bg-white text-black border-white"
                : "bg-neutral-800 text-white border-white/10"}`, children: _jsx("div", { className: "prose prose-invert prose-sm", children: _jsx(ReactMarkdown, { children: msg.content }) }) }) }));
}
