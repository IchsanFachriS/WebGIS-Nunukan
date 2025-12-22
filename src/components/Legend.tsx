import React, { useState } from 'react';

const Legend: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col items-end">
      <div 
        className={`bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${
          isCollapsed ? 'w-12 h-12' : 'w-64 sm:w-72'
        }`}
      >
        {/* Header / Toggle Button */}
        <div className={`flex items-center justify-between ${isCollapsed ? 'p-0' : 'p-4 border-b border-gray-100 bg-gray-50/50'}`}>
          {!isCollapsed && (
            <h3 className="text-xs font-bold text-gray-800 tracking-widest flex items-center uppercase">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              Legenda
            </h3>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`flex items-center justify-center transition-all duration-200 ${
              isCollapsed 
              ? 'w-12 h-12 hover:bg-emerald-50 text-emerald-600' 
              : 'p-1.5 hover:bg-gray-100 rounded-lg text-gray-400'
            }`}
            aria-label="Toggle legend"
          >
            {isCollapsed ? (
              /* Icon saat Minimize: Chevron Up agar mengesankan bisa dibuka ke atas */
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              /* Icon saat Expand: Chevron Down */
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>

        {/* Legend Content */}
        {!isCollapsed && (
          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-3 group">
              <div className="w-4 h-4 rounded shadow-sm group-hover:scale-110 transition-transform" style={{ backgroundColor: '#059669' }} />
              <span className="text-sm font-medium text-gray-700">Hutan Mangrove</span>
            </div>
            
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <p className="text-[10px] text-blue-600 font-medium leading-relaxed italic text-center">
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