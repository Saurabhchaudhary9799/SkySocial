import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
createRoot(document.getElementById('root')).render(_jsxs(BrowserRouter, { children: [_jsx(App, {}), _jsx(Toaster, {})] }));
