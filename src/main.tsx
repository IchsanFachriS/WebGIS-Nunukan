import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Memastikan element root ada sebelum rendering
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}