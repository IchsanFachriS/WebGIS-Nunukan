import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import WebGISPage from './pages/WebGISPage';
import DocumentPage from './pages/DocumentPage';
import AboutPage from './pages/AboutPage';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter basename="/WebGIS-Nunukan">
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Default route langsung ke WebGISPage */}
            <Route index element={<WebGISPage />} />
            <Route path="webgis" element={<WebGISPage />} />
            <Route path="dokumen" element={<DocumentPage />} />
            <Route path="tentang" element={<AboutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
  );
}