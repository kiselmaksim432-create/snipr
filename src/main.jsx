// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // Используем HashRouter
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter> {/* <-- Уберите basename, если он там есть! */}
      <App />
    </HashRouter>
  </StrictMode>
);
