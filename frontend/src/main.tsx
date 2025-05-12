import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { authStore } from './stores/authStore';

authStore.checkAuth();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <>
      <App />
      <Toaster position="top-right" />
    </>
  </React.StrictMode>
);
