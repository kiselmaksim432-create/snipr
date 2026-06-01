import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/** basename должно совпадать с base в vite.config.js */}
    <BrowserRouter basename="/snipr">
      <App />
    </BrowserRouter>
  </StrictMode>
);
