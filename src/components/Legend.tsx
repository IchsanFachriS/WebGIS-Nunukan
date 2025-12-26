import React, { useState } from 'react';

const Legend: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col items-end">
      <div 
        className={`bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-teal-500/20 transition-all duration-300 ease-in-out overflow-hidden ${
          isCollapsed ? 'w-12 h-12' : 'w-64 sm:w-72'
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
          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-3 group">
              <div className="w-4 h-4 rounded shadow-sm group-hover:scale-110 transition-transform bg-gradient-to-br from-teal-500 to-emerald-600" />
              <span className="text-sm font-medium text-slate-200">Hutan Mangrove</span>
            </div>
            
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
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