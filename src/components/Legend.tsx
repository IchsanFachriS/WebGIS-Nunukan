import React, { useState } from 'react';

interface LegendProps {
  visibleLayers: Record<string, boolean>;
}

const Legend: React.FC<LegendProps> = ({ visibleLayers }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Definisi legenda untuk setiap layer
  const legendItems = {
    boundary: {
      title: 'Batas Wilayah',
      items: [
        { 
          color: '#f97316', 
          label: 'Batas Administrasi Desa Srinanti', 
          pattern: 'dashed' as const,
          weight: 3,
          isImage: false
        }
      ]
    },
    mangrove: {
      title: 'Hutan Mangrove',
      items: [
        { 
          color: 'linear-gradient(to bottom right, #14b8a6, #059669)', 
          label: 'Kawasan Mangrove', 
          pattern: undefined,
          weight: 1,
          isImage: false
        }
      ]
    },
    landcover: {
      title: 'Tutupan Lahan 2024',
      items: [
        { color: '#0000FF', label: 'Air', pattern: undefined, isImage: false },
        { color: '#00FF00', label: 'Vegetasi', pattern: undefined, isImage: false },
        { color: '#90EE90', label: 'Vegetasi Terendam Air', pattern: undefined, isImage: false },
        { color: '#32CD32', label: 'Tanaman', pattern: undefined, isImage: false },
        { color: '#FF0000', label: 'Area Terbangun', pattern: undefined, isImage: false },
        { color: '#D2691E', label: 'Tanah Kosong', pattern: undefined, isImage: false },
        { color: '#FFFFFF', label: 'Salju/Es', pattern: undefined, isImage: false },
        { color: '#CCCCCC', label: 'Awan', pattern: undefined, isImage: false },
        { color: '#ADFF2F', label: 'Padang Rumput', pattern: undefined, isImage: false }
      ]
    }
  };

  // Filter hanya layer yang aktif
  const activeLegends = Object.entries(legendItems).filter(
    ([key]) => visibleLayers[key]
  );

  // Jika tidak ada layer aktif, tampilkan versi collapsed
  if (activeLegends.length === 0) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-teal-500/20 w-12 h-12">
        <div className="flex items-center justify-center w-full h-full text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end">
      <div 
        className={`bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-teal-500/20 transition-all duration-300 ease-in-out overflow-hidden ${
          isCollapsed ? 'w-12 h-12' : 'w-64 sm:w-80'
        }`}
      >
        {/* Header / Toggle Button */}
        <div className={`flex items-center justify-between ${isCollapsed ? 'p-0' : 'p-4 border-b border-slate-700/50 bg-slate-900/30'}`}>
          {!isCollapsed && (
            <h3 className="text-xs font-bold text-white tracking-widest flex items-center uppercase">
              <span className="w-2 h-2 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full mr-2"></span>
              Legenda
            </h3>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`flex items-center justify-center transition-all duration-200 ${
              isCollapsed 
              ? 'w-12 h-12 hover:bg-teal-500/10 text-teal-400' 
              : 'p-1.5 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-teal-400'
            }`}
            aria-label="Toggle legend"
          >
            {isCollapsed ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>

        {/* Legend Content */}
        {!isCollapsed && (
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {activeLegends.map(([key, legend]) => (
              <div key={key} className="space-y-2">
                <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  {legend.title}
                </h4>
                <div className="space-y-2">
                  {legend.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 group">
                      {item.isImage ? (
                        // Untuk orthofoto, tampilkan icon khusus
                        <div className="w-5 h-5 rounded shadow-sm group-hover:scale-110 transition-transform flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      ) : (
                        <div 
                          className={`w-5 h-5 rounded shadow-sm group-hover:scale-110 transition-transform flex-shrink-0`}
                          style={{
                            background: item.color,
                            ...(item.pattern === 'dashed' && {
                              backgroundImage: 'repeating-linear-gradient(90deg, #f97316 0, #f97316 8px, transparent 8px, transparent 16px)',
                              backgroundSize: '100% 3px',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'repeat-x',
                              border: 'none'
                            })
                          }}
                        />
                      )}
                      <span className="text-xs font-medium text-slate-200 leading-tight">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 mt-4">
              <p className="text-[10px] text-blue-400 font-medium leading-relaxed italic text-center">
                Klik area peta untuk detail data
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Legend;