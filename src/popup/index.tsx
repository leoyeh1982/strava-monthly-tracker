import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { mockChromeAPI } from './dev-mock';

// Initialize Chrome API mocks for local development
mockChromeAPI();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);