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

  if (!isAmenitasPage && !isEkowisataPage) return null;

  const amenitasBounds: L.LatLngBoundsExpression = [
    [4.149369, 117.273433],
    [4.160875, 117.283953],
  ];

  const ekowisataBounds: L.LatLngBoundsExpression = [
    [4.144652, 117.293802],
    [4.162727, 117.305044],
  ];

  useEffect(() => {
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

      const satelliteTile = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, opacity: basemap === 'satellite' ? 1 : 0 }
      ).addTo(map);

      const streetTile = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19, opacity: basemap === 'street' ? 1 : 0 }
      ).addTo(map);

      satelliteTileRef.current = satelliteTile;
      streetTileRef.current = streetTile;
    }

    if (satelliteTileRef.current && streetTileRef.current) {
      satelliteTileRef.current.setOpacity(basemap === 'satellite' ? 1 : 0);
      streetTileRef.current.setOpacity(basemap === 'street' ? 1 : 0);
    }

    if (rectangleRef.current && mapRef.current) {
      mapRef.current.removeLayer(rectangleRef.current);
      rectangleRef.current = null;
    }

    const boundsToShow = isAmenitasPage ? ekowisataBounds : amenitasBounds;
    const targetPage = isAmenitasPage ? '/peta-ekowisata' : '/peta-amenitas';
    const accentColor = isAmenitasPage ? '#14b8a6' : '#a855f7';

    if (mapRef.current) {
      const rectangle = L.rectangle(boundsToShow, {
        color: accentColor,
        weight: 2,
        fillColor: accentColor,
        fillOpacity: 0.15,
        className: 'minimap-rectangle',
      }).addTo(mapRef.current);

      rectangleRef.current = rectangle;

      rectangle.on('click', () => navigate(targetPage));

      rectangle.on('mouseover', function (this: L.Rectangle) {
        this.setStyle({ weight: 3, fillOpacity: 0.28 });
      });

      rectangle.on('mouseout', function (this: L.Rectangle) {
        this.setStyle({ weight: 2, fillOpacity: 0.15 });
      });
    }

    return () => {
      if (rectangleRef.current && mapRef.current) {
        mapRef.current.removeLayer(rectangleRef.current);
        rectangleRef.current = null;
      }
    };
  }, [basemap, isAmenitasPage, navigate]);

  const accentClass = isAmenitasPage
    ? 'from-teal-600 to-blue-600'
    : 'from-purple-600 to-pink-600';

  const accentText = isAmenitasPage ? 'text-teal-300' : 'text-purple-300';

  const destinationLabel = isAmenitasPage
    ? 'Peta Ekowisata Mangrove'
    : 'Peta Amenitas Wisata';

  const rectColorLabel = isAmenitasPage ? 'hijau' : 'ungu';

  return (
    <div
      className="absolute z-[20]"
      style={{
        /* Posisi: di bawah basemap switcher, beri jarak dari tepi kanan */
        top: 'calc(3rem + 52px + 12px)', /* tinggi navbar relatif = 80px, basemap switcher ~52px, gap 12px */
        right: '1.5rem',
        width: 'clamp(140px, 18vw, 220px)',
      }}
    >
      <div className="bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Header strip */}
        <div className={`px-3 py-2 bg-gradient-to-r ${accentClass} border-b border-white/10`}>
          <div className="flex items-center gap-1.5">
            {/* Map pin icon */}
            <svg
              className="w-3 h-3 text-white/80 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <span className="text-white font-semibold tracking-wide" style={{ fontSize: '10px' }}>
              Peta Lainnya
            </span>
          </div>
        </div>

        {/* Minimap */}
        <div className="relative">
          <div
            id="minimap-inset"
            className="w-full cursor-pointer"
            style={{ aspectRatio: '1 / 1', background: '#1e293b' }}
          />

          {/* Bottom overlay hint */}
          <div className="absolute bottom-0 left-0 right-0 bg-slate-900/75 backdrop-blur-sm px-2 py-1.5">
            <p className="text-white text-center leading-tight" style={{ fontSize: '9px' }}>
              Klik area{' '}
              <span className={`font-bold ${accentText}`}>{rectColorLabel}</span>{' '}
              untuk berpindah
            </p>
          </div>
        </div>

        {/* Footer label */}
        <div className="px-3 py-2 bg-slate-900/50 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            {/* Destination icon */}
            <svg
              className={`w-3 h-3 flex-shrink-0 ${isAmenitasPage ? 'text-teal-400' : 'text-purple-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isAmenitasPage ? (
                /* tree / nature icon for ekowisata */
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              ) : (
                /* pin / amenitas icon */
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              )}
            </svg>
            <p
              className={`font-medium truncate ${isAmenitasPage ? 'text-teal-300' : 'text-purple-300'}`}
              style={{ fontSize: '10px' }}
            >
              {destinationLabel}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .minimap-rectangle {
          cursor: pointer;
          transition: opacity 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MapInset;