import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  visibleLayers: { [key: string]: boolean };
  onLayerToggle: (layerName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, visibleLayers, onLayerToggle }) => {
  const layers = [
    { 
      id: 'mangrove', 
      name: 'Kawasan Hutan Mangrove',
      description: 'Sumber: Badan Informasi Geospasial (BIG)',
      color: 'text-emerald-600'
    },
    // Placeholder untuk layer lain yang akan ditambahkan
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-[1001] bg-white rounded-xl shadow-lg p-3 hover:bg-gray-50 transition-all duration-200 hover:shadow-xl"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[999] backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static top-0 left-0 h-full w-full sm:w-96 lg:w-[400px] xl:w-[450px] bg-gradient-to-br from-white to-gray-50 z-[1000]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto shadow-2xl lg:shadow-none border-r border-gray-200
        `}
      >
        <div className="p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 rounded-2xl p-8 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative">
              <div className="flex items-center space-x-4 mb-3">
                <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">WebGIS Mangrove</h1>
                  <p className="text-emerald-100 text-sm lg:text-base mt-1">Nunukan, Kalimantan Utara</p>
                </div>
              </div>
            </div>
          </div>

          {/* Layer Control Panel */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg lg:text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Layer Peta
              </h2>
            </div>
            
            <div className="p-4 space-y-2">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className="group relative bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl p-4 hover:border-emerald-400 transition-all duration-200 hover:shadow-md"
                >
                  <label className="flex items-center cursor-pointer">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={visibleLayers[layer.id]}
                        onChange={() => onLayerToggle(layer.id)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-emerald-600 transition-colors duration-200"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-6 shadow-md"></div>
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-800 text-base">{layer.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{layer.description}</p>
                    </div>
                  </label>
                </div>
              ))}
              
            </div>
          </div>

          {/* About Panel */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tentang Aplikasi
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                Platform WebGIS untuk memetakan persebaran hutan mangrove di wilayah Nunukan, 
                Kalimantan Utara. WebGIS ini menyediakan visualisasi interaktif dengan data spasial yang 
                terintegrasi untuk mendukung monitoring dan konservasi ekosistem mangrove.
              </p>
              
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
            <p className="font-medium">© 2024 WebGIS Mangrove Nunukan</p>
            <p className="mt-1">Pengabdian Masyarakat</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;