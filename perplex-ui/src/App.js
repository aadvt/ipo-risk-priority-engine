import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Investors from './pages/Investors';
import Regulators from './pages/Regulators';
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/investors", element: _jsx(Investors, {}) }), _jsx(Route, { path: "/regulators", element: _jsx(Regulators, {}) })] }));
}
