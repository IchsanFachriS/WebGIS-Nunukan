import React, { useState } from 'react';
import { MapContainer, TileLayer, ScaleControl } from 'react-leaflet';
import OrthophotoLayer from '../components/OrthophotoLayer';
import 'leaflet/dist/leaflet.css';

const AmenitasPage: React.FC = () => {
  const [basemap, setBasemap] = useState<'satellite' | 'street'>('satellite');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orthophotoOpacity, setOrthophotoOpacity] = useState(0.85);

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden bg-slate-900">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-24 left-4 z-[40] bg-slate-800 rounded-xl shadow-2xl p-3 hover:bg-slate-700 transition-all duration-200 border border-teal-500/20"
      >
        <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/80 z-[30] backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static top-20 left-0 h-[calc(100vh-5rem)] w-full sm:w-96 lg:w-[400px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-[35]
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto border-r border-teal-500/20
        `}
      >
        <div className="p-6 lg:p-8 space-y-6">
          {/* Header Card */}
          <div className="bg-slate-800/50 rounded-2xl shadow-2xl border border-teal-500/20 overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 border-b border-teal-500/20">
              <h2 className="text-lg font-bold text-white flex items-center tracking-tight">
                <svg className="w-6 h-6 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Peta Amenitas Wisata
              </h2>
            </div>

            {/* Orthophoto Info */}
            <div className="p-4">
              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-purple-400 mb-1">Foto Udara Resolusi Tinggi</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Orthofoto hasil pemetaan drone menampilkan detail amenitas wisata di Desa Srinanti. Zoom in untuk melihat infrastruktur dengan lebih jelas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Opacity Control */}
            <div className="p-4 border-t border-slate-700/50">
              <label className="block text-sm font-semibold text-white mb-3">
                Transparansi Orthofoto
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={orthophotoOpacity * 100}
                  onChange={(e) => setOrthophotoOpacity(parseInt(e.target.value) / 100)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Transparan</span>
                  <span className="text-purple-400 font-semibold">{Math.round(orthophotoOpacity * 100)}%</span>
                  <span>Opak</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          {/* <div className="bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-2xl p-5 border border-teal-500/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-blue-400 mb-1">Informasi</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Peta ini menampilkan orthofoto untuk identifikasi lokasi amenitas wisata seperti tempat parkir, gazebo, toilet, dan jalur wisata.
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Basemap Switcher */}
        <div className="absolute top-6 right-6 z-[20]">
          <div className="bg-slate-800/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-teal-500/20 flex gap-1">
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 tracking-wide ${
                basemap === 'satellite'
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg shadow-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              Satelit
            </button>
            <button
              onClick={() => setBasemap('street')}
              className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 tracking-wide ${
                basemap === 'street'
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg shadow-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              OSM
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="w-full h-full bg-gray-200 relative">
          <MapContainer
            center={[4.08, 117.67]}
            zoom={11}
            className="w-full h-full"
            zoomControl={false}
          >
            {/* Scale Control */}
            <ScaleControl position="bottomleft" imperial={false} />

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={basemap === 'street' ? 1 : 0}
              zIndex={1}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              opacity={basemap === 'satellite' ? 1 : 0}
              zIndex={1}
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            />

            <OrthophotoLayer
              show={true}
              tileUrl="https://api.maptiler.com/tiles/019bdf3c-bab9-7f60-a89c-0eb5b3915741/{z}/{x}/{y}.png?key=eEVS9pTGeOsrG57V9SUj"
              opacity={orthophotoOpacity}
            />
          </MapContainer>

          {/* Legend - Fixed relatif terhadap map container */}
          <div className="absolute right-4 bottom-4 z-[10]">
            <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-purple-500/20 p-4">
              <h3 className="text-xs font-bold text-white tracking-widest flex items-center uppercase mb-3">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-2"></span>
                Legenda
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded shadow-sm flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-slate-200 leading-tight">
                    Foto Udara Resolusi Tinggi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenitasPage;