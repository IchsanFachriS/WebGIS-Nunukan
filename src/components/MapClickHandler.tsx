import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { getNDVIColor } from './NDVILayer';
import { LANDCOVER_COLOR } from './GeoTIFFLayer';
import L from 'leaflet';

declare global {
  interface Window {
    geoblaze: any;
  }
}

interface MapClickHandlerProps {
  landcoverGeoRaster: any | null;
  ndviGeoRaster:      any | null;
  ndviYear:           number;
  showLandcover:      boolean;
  showNDVI:           boolean;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

const LANDCOVER_NAME: Record<number, string> = {
  1: 'Air', 2: 'Vegetasi', 4: 'Vegetasi Terendam Air', 5: 'Tanaman',
  7: 'Area Terbangun', 8: 'Tanah Kosong', 9: 'Salju / Es',
  10: 'Awan', 11: 'Padang Rumput',
};

const getNDVIKategori = (v: number) => {
  if (v < 0)   return { k: 'Air / Tidak Ada Vegetasi',     d: 'Permukaan air, awan, atau area non-vegetasi' };
  if (v < 0.1) return { k: 'Lahan Terbuka / Tanah Kosong', d: 'Tanah gundul, area terbangun, atau pasir' };
  if (v < 0.2) return { k: 'Vegetasi Sangat Jarang',        d: 'Padang rumput kering atau semak sangat renggang' };
  if (v < 0.3) return { k: 'Vegetasi Jarang',               d: 'Semak atau padang rumput renggang' };
  if (v < 0.4) return { k: 'Vegetasi Sedang',               d: 'Vegetasi cukup lebat, semak dan hutan sekunder' };
  if (v < 0.5) return { k: 'Vegetasi Cukup Lebat',          d: 'Hutan sekunder atau mangrove muda' };
  if (v < 0.6) return { k: 'Vegetasi Lebat',                d: 'Mangrove atau hutan tropis lebat' };
  return         { k: 'Vegetasi Sangat Lebat',              d: 'Hutan mangrove atau hutan tropis sangat lebat' };
};

const identify = (georaster: any, lng: number, lat: number): number | null => {
  try {
    const res = window.geoblaze.identify(georaster, [lng, lat]);
    if (res === null || res === undefined) return null;
    const raw = Array.isArray(res) ? res[0] : res;
    if (raw === null || raw === undefined || isNaN(Number(raw))) return null;
    if (georaster.noDataValue !== null && Number(raw) === georaster.noDataValue) return null;
    return Number(raw);
  } catch { return null; }
};

// ─── popup HTML ───────────────────────────────────────────────────────────────

const ndviSection = (raw: number, year: number) => {
  const v     = parseFloat(raw.toFixed(4));
  const color = getNDVIColor(v) ?? 'rgb(100,100,100)';
  const { k, d } = getNDVIKategori(v);
  return `
    <div>
      <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
        <div style="width:3px;height:12px;background:#16a34a;border-radius:2px;flex-shrink:0;"></div>
        <span style="font-size:10px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:.06em;">NDVI Tahun ${year}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:7px;padding:8px;margin-bottom:4px;">
        <div style="width:22px;height:22px;background:${color};border:1px solid rgba(0,0,0,.12);border-radius:4px;flex-shrink:0;"></div>
        <div>
          <span style="font-size:16px;font-weight:700;color:#064e3b;">${v}</span>
          <div style="font-size:10px;color:#6b7280;">Nilai NDVI</div>
        </div>
      </div>
      <div style="font-size:11px;color:#374151;"><strong>Kategori:</strong> <span style="color:#059669;">${k}</span></div>
      <div style="font-size:10px;color:#9ca3af;font-style:italic;margin-top:1px;">${d}</div>
    </div>`;
};

const landcoverSection = (raw: number) => {
  const v     = Math.round(raw);
  const name  = LANDCOVER_NAME[v] ?? 'Tidak Diketahui';
  const color = LANDCOVER_COLOR[v] ?? '#888888';
  return `
    <div>
      <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
        <div style="width:3px;height:12px;background:#0891b2;border-radius:2px;flex-shrink:0;"></div>
        <span style="font-size:10px;font-weight:700;color:#164e63;text-transform:uppercase;letter-spacing:.06em;">Tutupan Lahan 2024</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;background:#f0fdfa;border:1px solid #99f6e4;border-radius:7px;padding:8px;">
        <div style="width:22px;height:22px;background:${color};border:1px solid rgba(0,0,0,.12);border-radius:4px;flex-shrink:0;"></div>
        <div>
          <div style="font-size:13px;font-weight:700;color:#134e4a;">${name}</div>
          <div style="font-size:10px;color:#6b7280;">Kode kelas: ${v}</div>
        </div>
      </div>
    </div>`;
};

// ─── Component ────────────────────────────────────────────────────────────────

const MapClickHandler: React.FC<MapClickHandlerProps> = ({
  landcoverGeoRaster,
  ndviGeoRaster,
  ndviYear,
  showLandcover,
  showNDVI,
}) => {
  const map = useMap();

  // Semua state disimpan di ref agar listener tidak perlu di-register ulang
  const stateRef = useRef({ landcoverGeoRaster, ndviGeoRaster, ndviYear, showLandcover, showNDVI });
  useEffect(() => {
    stateRef.current = { landcoverGeoRaster, ndviGeoRaster, ndviYear, showLandcover, showNDVI };
  });

  useEffect(() => {
    const container = map.getContainer();  // elemen <div> root peta

    const handleDOMClick = (ev: MouseEvent) => {
      const { landcoverGeoRaster, ndviGeoRaster, ndviYear, showLandcover, showNDVI } =
        stateRef.current;

      if (!showLandcover && !showNDVI) return;

      // Konversi koordinat pixel → LatLng menggunakan Leaflet
      const rect   = container.getBoundingClientRect();
      const point  = L.point(ev.clientX - rect.left, ev.clientY - rect.top);
      const latlng = map.containerPointToLatLng(point);
      const { lng, lat } = latlng;

      console.log('[MapClickHandler] DOM click fired', { lng, lat, showNDVI, showLandcover });

      const ndviVal = (showNDVI && ndviGeoRaster)
        ? identify(ndviGeoRaster, lng, lat)
        : null;

      const lcRaw = (showLandcover && landcoverGeoRaster)
        ? identify(landcoverGeoRaster, lng, lat)
        : null;
      const lcVal = (lcRaw !== null && LANDCOVER_COLOR[Math.round(lcRaw)] !== undefined)
        ? lcRaw
        : null;

      console.log('[MapClickHandler] identified values', { ndviVal, lcVal });

      if (ndviVal === null && lcVal === null) return;

      const parts: string[] = [];
      const sources: string[] = [];

      if (ndviVal !== null) { parts.push(ndviSection(ndviVal, ndviYear)); sources.push(`Sentinel-2 / Landsat (${ndviYear})`); }
      if (ndviVal !== null && lcVal !== null) parts.push('<div style="border-top:1px dashed #e2e8f0;margin:8px 0;"></div>');
      if (lcVal   !== null) { parts.push(landcoverSection(lcVal));         sources.push('Esri Living Atlas'); }

      const html = `
        <div style="font-family:sans-serif;min-width:200px;max-width:255px;padding:2px;">
          ${parts.join('')}
          <p style="margin:8px 0 0;font-size:9px;color:#9ca3af;border-top:1px solid #f1f5f9;padding-top:5px;">
            Sumber: ${sources.join(' &middot; ')}
          </p>
        </div>`;

      L.popup({ maxWidth: 300 })
        .setLatLng(latlng)
        .setContent(html)
        .openOn(map);
    };

    // Pasang di container DOM — tidak melewati sistem event Leaflet sama sekali
    container.addEventListener('click', handleDOMClick);

    return () => {
      container.removeEventListener('click', handleDOMClick);
    };
  }, [map]);  // hanya mount sekali; state dibaca via ref

  return null;
};

export default MapClickHandler;