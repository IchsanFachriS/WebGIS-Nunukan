import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AmenitasPage from './pages/AmenitasPage';
import EkowisataPage from './pages/EkowisataPage';
import DocumentPage from './pages/DocumentPage';
import AboutPage from './pages/AboutPage';
import SpeciesCarbonPage from './pages/SpeciesCarbonPage';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="peta-amenitas" element={<AmenitasPage />} />
            <Route path="peta-ekowisata" element={<EkowisataPage />} />
            <Route path="spesies-karbon" element={<SpeciesCarbonPage />} />
            <Route path="dokumen" element={<DocumentPage />} />
            <Route path="tentang" element={<AboutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>,
  );
}