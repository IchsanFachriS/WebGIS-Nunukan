import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import Sidebar from '../components/Sidebar';
import Legend from '../components/Legend';
import { MangroveGeoJSON } from '../types';

const WebGISPage: React.FC = () => {
  const [geoJsonData, setGeoJsonData] = useState<MangroveGeoJSON | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    boundary: true,
    orthophoto: false, // Default OFF agar tidak langsung load
    mangrove: true,
    landcover: false,
  });
  
  const [basemap, setBasemap] = useState<'satellite' | 'street'>('satellite');

  useEffect(() => {
    fetch('./data/mangrove.geojson')
      .then((response) => {
        if (!response.ok) throw new Error('Gagal memuat data GeoJSON');
        return response.json();
      })
      .then((data: MangroveGeoJSON) => setGeoJsonData(data))
      .catch((err) => {
        console.error('Error loading GeoJSON:', err);
        setError('Gagal memuat data peta');
      });
  }, []);

  const handleLayerToggle = (layerName: string) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
    
    // Log untuk debugging
    console.log(`Layer ${layerName} toggled to:`, !visibleLayers[layerName]);
  };

  if (error) {
    return (
      <div className="w-full h-[calc(100vh-5rem)] flex items-center justify-center bg-slate-900">
        <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md text-center border border-teal-500/20">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Terjadi Kesalahan</h2>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden bg-slate-900">
      {/* Sidebar dengan Layer Controls */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        visibleLayers={visibleLayers}
        onLayerToggle={handleLayerToggle}
      />

      <div className="flex-1 relative">
        {/* Floating Basemap Switcher */}
        <div className="absolute top-6 right-6 z-[1000]">
          <div className="bg-slate-800/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-teal-500/20 flex gap-1">
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 tracking-wide ${
                basemap === 'satellite' 
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg shadow-teal-500/30' 
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              Satelit
            </button>
            <button
              onClick={() => setBasemap('street')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 tracking-wide ${
                basemap === 'street' 
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg shadow-teal-500/30' 
                  : 'text-slate-300 hover:bg-slate-700/50'
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
          showLandcover={visibleLayers.landcover}
          showBoundary={visibleLayers.boundary}
          showOrthophoto={visibleLayers.orthophoto}
        />

        {/* Legenda Dinamis */}
        <div className="fixed right-4 bottom-12 z-[900]">
          <Legend visibleLayers={visibleLayers} />
        </div>

        {/* Floating Orthofoto Info (muncul saat orthofoto aktif) */}
        {visibleLayers.orthophoto && (
          <div className="absolute bottom-6 left-6 z-[900] max-w-xs">
            <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-purple-500/20 p-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-purple-400 mb-1">Orthofoto Aktif</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Menampilkan foto udara hasil pemetaan drone. Zoom in untuk detail lebih tinggi.
                  </p>
                </div>
                <button 
                  onClick={() => handleLayerToggle('orthophoto')}
                  className="text-slate-400 hover:text-white transition-colors"
                  title="Tutup"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WebGISPage;