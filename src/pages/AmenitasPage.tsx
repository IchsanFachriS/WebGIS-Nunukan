import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ScaleControl, GeoJSON, useMap } from 'react-leaflet';
import OrthophotoLayer from '../components/OrthophotoLayer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapInsetNavigation from '../components/MapInsetNavigation'; 

// Custom marker icons untuk amenitas
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Component untuk auto-zoom ke layer yang aktif
const AutoZoom: React.FC<{ data: any }> = ({ data }) => {
  const map = useMap();
  
  useEffect(() => {
    if (data && data.features && data.features.length > 0) {
      const geoJsonLayer = L.geoJSON(data);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    }
  }, [data, map]);
  
  return null;
};

const AmenitasPage: React.FC = () => {
  const [basemap, setBasemap] = useState<'satellite' | 'street'>('satellite');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orthophotoOpacity, setOrthophotoOpacity] = useState(1);
  const [amenitasData, setAmenitasData] = useState<any>(null);
  const [showAmenitas, setShowAmenitas] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load amenitas GeoJSON data
  useEffect(() => {
    fetch('./data/amenitas.geojson')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Gagal memuat data amenitas');
        }
        return response.json();
      })
      .then((data) => {
        setAmenitasData(data);
      })
      .catch((err) => {
        console.error('Error loading amenitas GeoJSON:', err);
        setError('Gagal memuat data amenitas. Pastikan file ada di public/data/');
      });
  }, []);

  // Function untuk mendapatkan warna marker berdasarkan tipe amenitas
  const getMarkerColor = (description: string): string => {
    const desc = description.toLowerCase();
    
    // Kategorisasi berdasarkan jenis fasilitas
    if (desc.includes('warung') || desc.includes('toko') || desc.includes('sembako')) {
      return '#f59e0b'; // Orange - Warung/Toko
    } else if (desc.includes('masjid') || desc.includes('musholla') || desc.includes('gereja') || desc.includes('tpq')) {
      return '#8b5cf6'; // Purple - Tempat Ibadah
    } else if (desc.includes('sekolah') || desc.includes('paud') || desc.includes('tk') || desc.includes('sd') || desc.includes('mi')) {
      return '#3b82f6'; // Blue - Pendidikan
    } else if (desc.includes('kantor') || desc.includes('balai') || desc.includes('gedung') || desc.includes('sekretariat') || desc.includes('bumdes') || desc.includes('kecamatan') || desc.includes('desa')) {
      return '#ef4444'; // Red - Pemerintahan
    } else if (desc.includes('kesehatan') || desc.includes('puskesmas') || desc.includes('posyandu') || desc.includes('apotek')) {
      return '#10b981'; // Green - Kesehatan
    } else if (desc.includes('cafe') || desc.includes('kopi') || desc.includes('boba')) {
      return '#ec4899'; // Pink - Kafe
    } else if (desc.includes('bengkel') || desc.includes('salon') || desc.includes('pangkas') || desc.includes('counter') || desc.includes('barbershop')) {
      return '#06b6d4'; // Cyan - Jasa
    } else if (desc.includes('lapangan') || desc.includes('playground') || desc.includes('playstation')) {
      return '#84cc16'; // Lime - Olahraga/Rekreasi
    } else if (desc.includes('pelabuhan') || desc.includes('speed boat')) {
      return '#6366f1'; // Indigo - Transportasi
    } else if (desc.includes('penginapan') || desc.includes('hotel')) {
      return '#f97316'; // Deep Orange - Penginapan
    } else if (desc.includes('tpu') || desc.includes('pemakaman')) {
      return '#64748b'; // Slate - Pemakaman
    } else if (desc.includes('pasar')) {
      return '#eab308'; // Yellow - Pasar
    } else if (desc.includes('bank')) {
      return '#14b8a6'; // Teal - Bank
    } else if (desc.includes('polisi') || desc.includes('pos')) {
      return '#dc2626'; // Red Dark - Keamanan
    }
    
    return '#64748b'; // Slate - Default
  };

  // Function untuk membuat konten popup dengan foto
  const createPopupContent = (props: any): string => {
    const photos = props.photos || [];
    const hasPhotos = photos.length > 0;

    // Generate photo gallery HTML
    let photoGalleryHTML = '';
    if (hasPhotos) {
      photoGalleryHTML = `
        <div style="margin-top: 12px;">
          <div style="display: flex; gap: 8px; overflow-x: auto; padding: 4px 0;">
            ${photos.map((photo: string) => `
              <div style="flex-shrink: 0;">
                <img 
                  src="./images/amenitas/${photo}" 
                  alt="${props.Name}"
                  style="
                    width: 120px;
                    height: 90px;
                    object-fit: cover;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.2s;
                    border: 2px solid #e5e7eb;
                  "
                  onmouseover="this.style.transform='scale(1.05)'"
                  onmouseout="this.style.transform='scale(1)'"
                  onclick="window.open('./images/amenitas/${photo}', '_blank')"
                  onerror="this.style.display='none'; this.parentElement.style.display='none';"
                />
              </div>
            `).join('')}
          </div>
          <p style="
            font-size: 10px;
            color: #9ca3af;
            margin-top: 8px;
            text-align: center;
            font-style: italic;
          ">
            Klik foto untuk memperbesar
          </p>
        </div>
      `;
    }

    return `
      <div style="font-family: sans-serif; min-width: 250px; max-width: 320px;">
        <h3 style="margin: 0 0 8px 0; color: #8b5cf6; font-size: 16px; font-weight: bold;">
          ${props.descriptio || 'Amenitas'}
        </h3>
        <div style="font-size: 13px; line-height: 1.6;">
          <p style="margin: 4px 0; color: #475569;">
            ${props.descriptio || '-'}
          </p>
        </div>
        ${photoGalleryHTML}
      </div>
    `;
  };

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
                      Orthofoto hasil pemetaan drone menampilkan titik lokasi amenitas wisata di Desa Srinanti. Klik marker untuk melihat foto tempat.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenitas Layer Toggle */}
            <div className="p-4 border-t border-slate-700/50">
              <label className="flex items-center cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={showAmenitas}
                    onChange={() => setShowAmenitas(!showAmenitas)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-600 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-600 transition-all duration-200 shadow-inner"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-6 shadow-md"></div>
                </div>
                <span className="ml-4 text-sm font-semibold text-white">Tampilkan Amenitas Wisata</span>
              </label>
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-red-400 mb-1">Error</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapInsetNavigation />
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

            {/* Auto Zoom Component */}
            {showAmenitas && amenitasData && <AutoZoom data={amenitasData} />}

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

            {/* Amenitas GeoJSON Layer */}
            {showAmenitas && amenitasData && (
              <GeoJSON
                data={amenitasData}
                pointToLayer={(feature, latlng) => {
                  const color = getMarkerColor(feature.properties.descriptio || '');
                  return L.marker(latlng, {
                    icon: createCustomIcon(color)
                  });
                }}
                onEachFeature={(feature, layer) => {
                  if (feature.properties) {
                    const popupContent = createPopupContent(feature.properties);
                    layer.bindPopup(popupContent, {
                      maxWidth: 350,
                      className: 'amenitas-popup'
                    });
                  }
                }}
              />
            )}
          </MapContainer>

          {/* Legend - Fixed relatif terhadap map container */}
          <div className="absolute right-4 bottom-4 z-[10]">
            <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-purple-500/20 p-4 max-w-xs">
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
                
                {showAmenitas && amenitasData && (
                  <>
                    <div className="border-t border-slate-700 my-2 pt-2">
                      <p className="text-xs font-bold text-purple-400 mb-2">Kategori Amenitas:</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{background: '#f59e0b'}}></div>
                        <span className="text-slate-300">Warung/Toko</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{background: '#8b5cf6'}}></div>
                        <span className="text-slate-300">Ibadah</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{background: '#3b82f6'}}></div>
                        <span className="text-slate-300">Pendidikan</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{background: '#ef4444'}}></div>
                        <span className="text-slate-300">Pemerintahan</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{background: '#10b981'}}></div>
                        <span className="text-slate-300">Kesehatan</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{background: '#ec4899'}}></div>
                        <span className="text-slate-300">Kafe</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{background: '#06b6d4'}}></div>
                        <span className="text-slate-300">Jasa</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{background: '#84cc16'}}></div>
                        <span className="text-slate-300">Olahraga</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenitasPage;