import React from 'react';
// Wait, React 18 uses react-dom/client
import { createRoot } from 'react-dom/client';
import './mockApi'; // Intercepts fetch requests when backend is down
import App from './App';
import './index.css';
import { AuthProvider, CartProvider, ToastProvider } from './context';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
