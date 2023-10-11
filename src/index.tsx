import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './config/authConfig';

const container = document.getElementById('root')!;
const root = createRoot(container);
const msalInstance = new PublicClientApplication(msalConfig);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <MsalProvider instance={msalInstance}>
                <App />
            </MsalProvider>
        </Provider>
    </React.StrictMode>
);
