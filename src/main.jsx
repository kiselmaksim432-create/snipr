import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/** basename должно совпадать с base в vite.config.js */}
    <HashRouter basename="/snipr">
      <App />
    </HashRouter>
  </StrictMode>
);
