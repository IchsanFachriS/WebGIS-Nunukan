import React, { useEffect, useState } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import Legend from './components/Legend';
import { MangroveGeoJSON } from './types';

const App: React.FC = () => {
  const [geoJsonData, setGeoJsonData] = useState<MangroveGeoJSON | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleLayers, setVisibleLayers] = useState({
    mangrove: true,
  });
  const [basemap, setBasemap] = useState<'satellite' | 'street'>('satellite');

  useEffect(() => {
    // Memuat data GeoJSON dari folder public/data/
    fetch('/data/mangrove.geojson')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Gagal memuat data GeoJSON');
        }
        return response.json();
      })
      .then((data: MangroveGeoJSON) => {
        setGeoJsonData(data);
      })
      .catch((err) => {
        console.error('Error loading GeoJSON:', err);
        setError('Gagal memuat data peta. Pastikan file mangrove.geojson ada di folder public/data/');
      });
  }, []);

  const handleLayerToggle = (layerName: string) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans">
      {/* Sidebar Kontrol */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        visibleLayers={visibleLayers}
        onLayerToggle={handleLayerToggle}
      />

      <div className="flex-1 relative">
        {/* Floating Basemap Switcher (Kanan Atas) */}
        <div className="absolute top-6 right-6 z-[1000]">
          <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-white/50 flex gap-1">
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                basemap === 'satellite'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Satelit
            </button>
            <button
              onClick={() => setBasemap('street')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                basemap === 'street'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              OSM
            </button>
          </div>
        </div>

        {/* Komponen Peta Utama */}
        <Map 
          geoJsonData={visibleLayers.mangrove ? geoJsonData : null} 
          basemap={basemap}
        />

        {/* Komponen Legenda (Ditempatkan di atas atribusi Leaflet) */}
        <div className="fixed right-4 bottom-12 z-[900]">
          <Legend />
        </div>
      </div>
    </div>
  );
};

export default App;