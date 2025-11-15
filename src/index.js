// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import Portfolio from './Portfolio';
import './index.css';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found. Make sure your public/index.html contains <div id="root"></div>');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Portfolio />
  </React.StrictMode>
);

// Optional: measure performance (keeps default create-react-app hook)
reportWebVitals();
