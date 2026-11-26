import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';
import { StoreProvider } from './context/StoreContext';
import { CMSProvider } from './context/CMSContext';
import { OfferProvider } from './context/OfferContext';
import { ComboProvider } from './context/ComboContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LanguageProvider>
      <StoreProvider>
        <CMSProvider>
          <OfferProvider>
            <ComboProvider>
              <App />
            </ComboProvider>
          </OfferProvider>
        </CMSProvider>
      </StoreProvider>
    </LanguageProvider>
  </React.StrictMode>
);
