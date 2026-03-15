import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapInsetProps {
  basemap: 'satellite' | 'street';
}

const MapInset: React.FC<MapInsetProps> = ({ basemap }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef<L.Map | null>(null);
  const rectangleRef = useRef<L.Rectangle | null>(null);
  const satelliteTileRef = useRef<L.TileLayer | null>(null);
  const streetTileRef = useRef<L.TileLayer | null>(null);
  
  const isAmenitasPage = location.pathname === '/peta-amenitas';
  const isEkowisataPage = location.pathname === '/peta-ekowisata';

  // Jika bukan di halaman peta, jangan tampilkan
  if (!isAmenitasPage && !isEkowisataPage) return null;

  // Koordinat bounds untuk masing-masing area
  const amenitasBounds: L.LatLngBoundsExpression = [
    [4.149369, 117.273433], // Southwest
    [4.160875, 117.283953]  // Northeast
  ];

  const ekowisataBounds: L.LatLngBoundsExpression = [
    [4.144652, 117.293802],   // Southwest
    [4.162727, 117.305044]    // Northeast
  ];

  useEffect(() => {
    // Initialize map hanya sekali
    if (!mapRef.current) {
      const map = L.map('minimap-inset', {
        center: [4.154857, 117.288588],
        zoom: 13,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        attributionControl: false,
        touchZoom: false,
      });

      mapRef.current = map;

      // Add tile layers
      const satelliteTile = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          opacity: basemap === 'satellite' ? 1 : 0,
        }
      ).addTo(map);

      const streetTile = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          opacity: basemap === 'street' ? 1 : 0,
        }
      ).addTo(map);

      satelliteTileRef.current = satelliteTile;
      streetTileRef.current = streetTile;
    }

    // Update basemap opacity
    if (satelliteTileRef.current && streetTileRef.current) {
      satelliteTileRef.current.setOpacity(basemap === 'satellite' ? 1 : 0);
      streetTileRef.current.setOpacity(basemap === 'street' ? 1 : 0);
    }

    // Remove existing rectangle
    if (rectangleRef.current && mapRef.current) {
      mapRef.current.removeLayer(rectangleRef.current);
      rectangleRef.current = null;
    }

    // Determine which bounds to show based on current page
    const boundsToShow = isAmenitasPage ? ekowisataBounds : amenitasBounds;
    const targetPage = isAmenitasPage ? '/peta-ekowisata' : '/peta-amenitas';
    const labelText = isAmenitasPage ? 'Peta Ekowisata' : 'Peta Amenitas';

    if (mapRef.current) {
      // Create rectangle with enhanced styling
      const rectangle = L.rectangle(boundsToShow, {
        color: isAmenitasPage ? '#14b8a6' : '#a855f7',
        weight: 3,
        fillColor: isAmenitasPage ? '#14b8a6' : '#a855f7',
        fillOpacity: 0.15,
        className: 'minimap-rectangle-hover',
      }).addTo(mapRef.current);

      rectangleRef.current = rectangle;

      // Add tooltip
      rectangle.bindTooltip(labelText, {
        permanent: false,
        direction: 'center',
        className: 'minimap-tooltip',
      });

      // Add click handler
      rectangle.on('click', () => {
        navigate(targetPage);
      });

      // Add hover effects
      rectangle.on('mouseover', function(this: L.Rectangle) {
        this.setStyle({
          weight: 4,
          fillOpacity: 0.3,
        });
      });

      rectangle.on('mouseout', function(this: L.Rectangle) {
        this.setStyle({
          weight: 3,
          fillOpacity: 0.15,
        });
      });
    }

    // Cleanup
    return () => {
      if (rectangleRef.current && mapRef.current) {
        mapRef.current.removeLayer(rectangleRef.current);
        rectangleRef.current = null;
      }
    };
  }, [basemap, isAmenitasPage, navigate]);

  return (
    <div className="absolute top-20 right-4 sm:right-6 z-[20]">
      <div className="bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-teal-500/30 overflow-hidden">
        {/* Header */}
        <div 
          className={`px-3 py-2 border-b border-white/10 ${
            isAmenitasPage 
              ? 'bg-gradient-to-r from-teal-600 to-blue-600' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600'
          }`}
        >
          <h3 className="text-[10px] sm:text-xs font-bold text-white tracking-wide flex items-center">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Peta Lainnya
          </h3>
        </div>

        {/* Minimap Container */}
        <div className="relative">
          <div 
            id="minimap-inset" 
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 cursor-pointer"
            style={{ background: '#1e293b' }}
          />
          
          {/* Click instruction overlay */}
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-white/10">
            <p className="text-[9px] sm:text-[10px] text-white font-semibold text-center leading-tight">
              Klik area 
              <span className={isAmenitasPage ? 'text-teal-300' : 'text-purple-300'}>
                {' '}{isAmenitasPage ? 'hijau' : 'ungu'}{' '}
              </span>
              untuk berpindah
            </p>
          </div>
        </div>

        {/* Label */}
        <div className="px-3 py-2 bg-slate-900/50 border-t border-white/5">
          <p className="text-[10px] sm:text-xs text-slate-300 font-medium text-center">
            {isAmenitasPage ? '📍 Peta Ekowisata Mangrove' : '🏖️ Peta Amenitas Wisata'}
          </p>
        </div>
      </div>

      <style>{`
        .minimap-rectangle-hover {
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .minimap-tooltip {
          background: rgba(15, 23, 42, 0.95) !important;
          border: 1px solid rgba(20, 184, 166, 0.3) !important;
          border-radius: 8px !important;
          padding: 6px 10px !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }

        .minimap-tooltip::before {
          display: none !important;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .minimap-tooltip {
            font-size: 10px !important;
            padding: 4px 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MapInset;