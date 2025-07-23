import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from 'react-dom/client';
import App from './App';
import { mockChromeAPI } from './dev-mock';
// Initialize Chrome API mocks for local development
mockChromeAPI();
var container = document.getElementById('root');
var root = createRoot(container);
root.render(_jsx(App, {}));
