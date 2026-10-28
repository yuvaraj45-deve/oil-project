import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';
import { StoreProvider } from './context/StoreContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LanguageProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </LanguageProvider>
  </React.StrictMode>
);
