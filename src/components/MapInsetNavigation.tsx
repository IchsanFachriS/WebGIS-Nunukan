import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Map, Image } from 'lucide-react';

const MapInsetNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAmenitasPage = location.pathname === '/peta-amenitas';
  const isEkowisataPage = location.pathname === '/peta-ekowisata';

  if (!isAmenitasPage && !isEkowisataPage) return null;

  return (
    <div className="absolute top-20 right-6 z-[20]">
      <div className="bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-teal-500/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-3 py-2 border-b border-white/10">
          <h3 className="text-xs font-bold text-white tracking-wide flex items-center">
            <Map className="w-3.5 h-3.5 mr-1.5" />
            Peta Lainnya
          </h3>
        </div>

        {/* Navigation Buttons */}
        <div className="p-2 space-y-1.5">
          <button
            onClick={() => navigate('/peta-ekowisata')}
            disabled={isEkowisataPage}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${
              isEkowisataPage
                ? 'bg-teal-500/20 text-teal-300 cursor-default border border-teal-500/30'
                : 'bg-slate-700/50 text-slate-200 hover:bg-teal-600/30 hover:text-white border border-slate-600/50 hover:border-teal-500/50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isEkowisataPage ? 'bg-teal-500/30' : 'bg-slate-600/50'
            }`}>
              <Map className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">Peta Ekowisata</p>
              <p className="text-[10px] opacity-75 truncate">Mangrove & Rute</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/peta-amenitas')}
            disabled={isAmenitasPage}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${
              isAmenitasPage
                ? 'bg-purple-500/20 text-purple-300 cursor-default border border-purple-500/30'
                : 'bg-slate-700/50 text-slate-200 hover:bg-purple-600/30 hover:text-white border border-slate-600/50 hover:border-purple-500/50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isAmenitasPage ? 'bg-purple-500/30' : 'bg-slate-600/50'
            }`}>
              <Image className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">Peta Amenitas</p>
              <p className="text-[10px] opacity-75 truncate">Fasilitas Wisata</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapInsetNavigation;