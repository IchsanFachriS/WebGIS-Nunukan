import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import Sidebar from '../components/Sidebar';
import Legend from '../components/Legend';
import { MangroveGeoJSON } from '../types';

const WebGISPage: React.FC = () => {
  const [geoJsonData, setGeoJsonData] = useState<MangroveGeoJSON | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Menambahkan 'boundary' ke dalam state visibleLayers
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    boundary: true,
    mangrove: true,
    landcover: true,
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
  };

  if (error) {
    return (
      <div className="w-full h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden bg-white">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        visibleLayers={visibleLayers}
        onLayerToggle={handleLayerToggle}
      />

      <div className="flex-1 relative">
        <div className="absolute top-6 right-6 z-[1000]">
          <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-xl flex gap-1">
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                basemap === 'satellite' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
              }`}
            > Satelit </button>
            <button
              onClick={() => setBasemap('street')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                basemap === 'street' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
              }`}
            > OSM </button>
          </div>
        </div>

        <Map 
          geoJsonData={visibleLayers.mangrove ? geoJsonData : null} 
          basemap={basemap}
          showLandcover={visibleLayers.landcover}
          showBoundary={visibleLayers.boundary} // Meneruskan state ke Map
        />

        <div className="fixed right-4 bottom-12 z-[900]">
          <Legend />
        </div>
      </div>
    </div>
  );
};

export default WebGISPage;