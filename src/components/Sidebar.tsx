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
      name: 'Batas Wilayah Administrasi',
      shortName: 'Batas Wilayah',
      description: 'Desa SriNanti',
      source: 'Sumber: Google Satellite',
      color: 'text-amber-400'
    },
    { 
      id: 'mangrove', 
      name: 'Kawasan Hutan Mangrove',
      shortName: 'Hutan Mangrove',
      description: 'di Kabupaten Nunukan',
      source: 'Sumber: Badan Informasi Geospasial (BIG)',
      color: 'text-teal-400'
    },
    { 
      id: 'landcover', 
      name: 'Tutupan Lahan 2024',
      shortName: 'Tutupan Lahan 2024',
      description: 'Klasifikasi penggunaan lahan',
      source: 'Sumber: Esri Living Atlas',
      color: 'text-blue-400'
    },
  ];

  return (
    <>
      {/* Toggle Button - Mobile Only */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-24 left-4 z-[1001] bg-slate-800/90 backdrop-blur-md rounded-xl shadow-2xl p-3 hover:bg-slate-700 transition-all duration-200 border border-teal-500/30"
      >
        <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay - Mobile Only */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/80 z-[999] backdrop-blur-sm" onClick={onToggle} />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static 
          top-20 left-0 
          h-[calc(100vh-5rem)] 
          w-full sm:w-96 lg:w-[380px] 
          bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
          z-[1000]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto 
          border-r border-teal-500/20
          shadow-2xl lg:shadow-none
        `}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Layer Peta</h2>
            </div>
            
            {/* Close button - Mobile Only */}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Layer Controls */}
          <div className="space-y-3">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className="group relative bg-slate-800/40 border-2 border-slate-700/50 rounded-xl p-4 hover:border-teal-500/40 hover:bg-slate-700/40 transition-all duration-200"
              >
                <label className="flex items-start cursor-pointer">
                  {/* Toggle Switch */}
                  <div className="relative flex items-center flex-shrink-0 mr-4">
                    <input
                      type="checkbox"
                      checked={visibleLayers[layer.id]}
                      onChange={() => onLayerToggle(layer.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-teal-500 peer-checked:to-blue-600 transition-all duration-200 shadow-inner"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-5 shadow-md"></div>
                  </div>
                  
                  {/* Layer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-white text-sm tracking-tight leading-tight pr-2">
                        {layer.shortName}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mb-1 leading-relaxed">
                      {layer.description}
                    </p>
                    <p className="text-[10px] text-slate-500 italic">
                      {layer.source}
                    </p>
                  </div>
                </label>

                {/* Active Indicator */}
                {visibleLayers[layer.id] && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-teal-400 rounded-full animate-pulse shadow-lg shadow-teal-400/50" />
                )}
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-gradient-to-br from-blue-900/30 to-teal-900/30 rounded-xl border border-blue-500/20">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-blue-300 mb-1">Tips Penggunaan</h4>
                <p className="text-xs text-blue-200/80 leading-relaxed">
                  Aktifkan atau nonaktifkan layer untuk melihat informasi yang berbeda. Klik pada peta untuk detail lebih lanjut.
                </p>
              </div>
            </div>
          </div>

          {/* Layer Count */}
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Layer:</span>
              <span className="font-bold text-teal-400">{layers.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
              <span>Layer Aktif:</span>
              <span className="font-bold text-emerald-400">
                {Object.values(visibleLayers).filter(v => v).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;