import { jsx as _jsx } from "react/jsx-runtime";
export default function ChatMessage({ msg }) {
    const isUser = msg.role === 'user';
    return (_jsx("div", { className: `w-full flex ${isUser ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl border ${isUser ? 'bg-white/20 border-white/20' : 'bg-white/10 border-white/15'} `, children: _jsx("p", { className: "whitespace-pre-wrap leading-relaxed text-white/90", children: msg.content }) }) }));
}
