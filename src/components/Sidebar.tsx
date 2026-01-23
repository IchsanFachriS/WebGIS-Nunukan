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
      id: 'boundary', 
      name: 'Rekomendasi Rute Ekowisata Susur Mangrove',
      description: 'Sumber: Hasil Observasi',
      color: 'text-amber-400',
    },
    { 
      id: 'mangrove', 
      name: 'Kawasan Hutan Mangrove yang dikelola Desa Srinanti',
      description: 'Sumber: Badan Informasi Geospasial (BIG)',
      color: 'text-teal-400',
    },
    { 
      id: 'landcover', 
      name: 'Tutupan Lahan 2024',
      description: 'Sumber: Esri Living Atlas',
      color: 'text-blue-400',
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-24 left-4 z-[40] bg-slate-800 rounded-xl shadow-2xl p-3 hover:bg-slate-700 transition-all duration-200 border border-teal-500/20"
      >
        <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/80 z-[30] backdrop-blur-sm" onClick={onToggle} />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static top-20 left-0 h-[calc(100vh-5rem)] w-full sm:w-96 lg:w-[400px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-[35]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto border-r border-teal-500/20
        `}
      >
        <div className="p-6 lg:p-8 space-y-6">
          {/* Header Card */}
          <div className="bg-slate-800/50 rounded-2xl shadow-2xl border border-teal-500/20 overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 border-b border-teal-500/20">
              <h2 className="text-lg font-bold text-white flex items-center tracking-tight">
                <svg className="w-6 h-6 mr-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Layer Peta
              </h2>
            </div>
            
            {/* Layer Controls */}
            <div className="p-4 space-y-2">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className="group relative bg-slate-700/30 border-2 border-slate-600/50 rounded-xl p-4 hover:border-teal-500/50 hover:bg-slate-700/50 transition-all duration-200"
                >
                  <label className="flex items-center cursor-pointer">
                    {/* Toggle Switch */}
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={visibleLayers[layer.id]}
                        onChange={() => onLayerToggle(layer.id)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-slate-600 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-teal-500 peer-checked:to-blue-600 transition-all duration-200 shadow-inner"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-6 shadow-md"></div>
                    </div>
                    
                    {/* Layer Info */}
                    <div className="ml-4 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={layer.color}>
                        </span>
                        <span className="font-semibold text-white text-sm tracking-tight">
                          {layer.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {layer.description}
                      </p>
                    </div>
                  </label>
                  
                  {/* Active Indicator */}
                  {visibleLayers[layer.id] && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info Card
          <div className="bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-2xl p-5 border border-teal-500/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div> */}

          {/* Layer Count
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Layer Aktif</span>
              <span className="text-2xl font-bold text-teal-400">
                {Object.values(visibleLayers).filter(Boolean).length}
                <span className="text-sm text-slate-500 ml-1">/ {layers.length}</span>
              </span>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;