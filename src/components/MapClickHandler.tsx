import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { getNDVIColor } from './NDVILayer';

declare global {
  interface Window {
    L: any;
    geoblaze: any;
  }
}

interface MapClickHandlerProps {
  landcoverGeoRaster: any | null;
  ndviGeoRaster: any | null;
  ndviYear: number;
  showLandcover: boolean;
  showNDVI: boolean;
}

// ─── Landcover helpers ───────────────────────────────────────────────────────

const getLandcoverName = (value: number): string => {
  switch (value) {
    case 1:  return 'Air';
    case 2:  return 'Vegetasi';
    case 4:  return 'Vegetasi Terendam Air';
    case 5:  return 'Tanaman';
    case 7:  return 'Area Terbangun';
    case 8:  return 'Tanah Kosong';
    case 9:  return 'Salju / Es';
    case 10: return 'Awan';
    case 11: return 'Padang Rumput';
    default: return 'Tidak Diketahui';
  }
};

const getLandcoverColor = (value: number): string | null => {
  switch (value) {
    case 1:  return '#0000FF';
    case 2:  return '#00FF00';
    case 4:  return '#90EE90';
    case 5:  return '#32CD32';
    case 7:  return '#FF0000';
    case 8:  return '#D2691E';
    case 9:  return '#FFFFFF';
    case 10: return '#CCCCCC';
    case 11: return '#ADFF2F';
    default: return null;
  }
};

// ─── NDVI helpers ────────────────────────────────────────────────────────────

const getNDVIKategori = (value: number): { kategori: string; keterangan: string } => {
  if (value < 0)    return { kategori: 'Air / Tidak Ada Vegetasi', keterangan: 'Permukaan air, awan, atau area non-vegetasi' };
  if (value < 0.1)  return { kategori: 'Lahan Terbuka / Tanah Kosong', keterangan: 'Tanah gundul, area terbangun, atau pasir' };
  if (value < 0.2)  return { kategori: 'Vegetasi Sangat Jarang', keterangan: 'Padang rumput kering atau semak sangat renggang' };
  if (value < 0.3)  return { kategori: 'Vegetasi Jarang', keterangan: 'Semak atau padang rumput renggang' };
  if (value < 0.4)  return { kategori: 'Vegetasi Sedang', keterangan: 'Vegetasi cukup lebat, semak dan hutan sekunder' };
  if (value < 0.5)  return { kategori: 'Vegetasi Cukup Lebat', keterangan: 'Hutan sekunder atau mangrove muda' };
  if (value < 0.6)  return { kategori: 'Vegetasi Lebat', keterangan: 'Mangrove atau hutan tropis lebat' };
  return              { kategori: 'Vegetasi Sangat Lebat', keterangan: 'Hutan mangrove atau hutan tropis sangat lebat' };
};

// ─── Popup builders ──────────────────────────────────────────────────────────

const buildLandcoverPopup = (value: number): string => {
  const name  = getLandcoverName(value);
  const color = getLandcoverColor(value) ?? '#888';
  return `
    <div style="font-family:sans-serif;min-width:180px;">
      <h3 style="margin:0 0 10px;color:#0d9488;font-size:14px;font-weight:bold;">
        Tutupan Lahan 2024
      </h3>
      <div style="display:flex;align-items:center;gap:10px;background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;padding:10px;margin-bottom:10px;">
        <div style="width:26px;height:26px;background:${color};border:1px solid rgba(0,0,0,.15);border-radius:5px;flex-shrink:0;"></div>
        <div>
          <div style="font-size:14px;font-weight:bold;color:#134e4a;">${name}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">Kode kelas: ${value}</div>
        </div>
      </div>
      <p style="margin:8px 0 0;font-size:10px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:6px;">
        Sumber: Esri Living Atlas
      </p>
    </div>
  `;
};

const buildNDVIPopup = (rawValue: number, year: number): string => {
  const value    = parseFloat(rawValue.toFixed(4));
  const color    = getNDVIColor(value) ?? 'rgb(100,100,100)';
  const { kategori, keterangan } = getNDVIKategori(value);
  return `
    <div style="font-family:sans-serif;min-width:200px;">
      <h3 style="margin:0 0 10px;color:#0d9488;font-size:14px;font-weight:bold;">
        NDVI Tahun ${year}
      </h3>
      <div style="display:flex;align-items:center;gap:10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px;margin-bottom:10px;">
        <div style="width:28px;height:28px;background:${color};border:1px solid rgba(0,0,0,.15);border-radius:6px;flex-shrink:0;"></div>
        <div>
          <div style="font-size:20px;font-weight:bold;color:#064e3b;line-height:1;">${value}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">Nilai NDVI</div>
        </div>
      </div>
      <div style="font-size:12px;line-height:1.6;">
        <p style="margin:4px 0;">
          <strong style="color:#374151;">Kategori:</strong>
          <span style="color:#059669;"> ${kategori}</span>
        </p>
        <p style="margin:4px 0;color:#6b7280;font-size:11px;font-style:italic;">${keterangan}</p>
      </div>
      <p style="margin:10px 0 0;font-size:10px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:6px;">
        Sumber: Sentinel-2 / Landsat | Tahun ${year}
      </p>
    </div>
  `;
};

// ─── Identify value from georaster at latlng ─────────────────────────────────

const identifyRaster = (georaster: any, lng: number, lat: number): number | null => {
  try {
    // geoblaze.identify bisa sync atau async tergantung versi
    const result = window.geoblaze.identify(georaster, [lng, lat]);
    if (result === null || result === undefined) return null;
    // Beberapa versi mengembalikan array, beberapa scalar
    const raw = Array.isArray(result) ? result[0] : result;
    if (raw === null || raw === undefined || isNaN(Number(raw))) return null;
    // Cek nodata
    if (georaster.noDataValue !== null && Number(raw) === georaster.noDataValue) return null;
    return Number(raw);
  } catch {
    return null;
  }
};

// ─── Component ───────────────────────────────────────────────────────────────

const MapClickHandler: React.FC<MapClickHandlerProps> = ({
  landcoverGeoRaster,
  ndviGeoRaster,
  ndviYear,
  showLandcover,
  showNDVI,
}) => {
  const map = useMap();

  // Gunakan ref agar handler selalu baca state terbaru tanpa re-register
  const stateRef = useRef({
    landcoverGeoRaster,
    ndviGeoRaster,
    ndviYear,
    showLandcover,
    showNDVI,
  });

  useEffect(() => {
    stateRef.current = { landcoverGeoRaster, ndviGeoRaster, ndviYear, showLandcover, showNDVI };
  });

  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      const { landcoverGeoRaster, ndviGeoRaster, ndviYear, showLandcover, showNDVI } =
        stateRef.current;

      // Tidak ada layer TIF yang aktif — biarkan event lain menangani
      if (!showLandcover && !showNDVI) return;

      const { lng, lat } = e.latlng;
      let popupHtml: string | null = null;

      // Prioritas: NDVI lebih spesifik, tampilkan jika aktif
      if (showNDVI && ndviGeoRaster) {
        const value = identifyRaster(ndviGeoRaster, lng, lat);
        if (value !== null) {
          popupHtml = buildNDVIPopup(value, ndviYear);
        }
      }

      // Fallback ke landcover jika NDVI tidak menghasilkan nilai
      if (!popupHtml && showLandcover && landcoverGeoRaster) {
        const value = identifyRaster(landcoverGeoRaster, lng, lat);
        if (value !== null) {
          const color = getLandcoverColor(Math.round(value));
          if (color) {
            popupHtml = buildLandcoverPopup(Math.round(value));
          }
        }
      }

      if (popupHtml) {
        // stopPropagation agar GeoJSON popup di bawah tidak ikut muncul
        window.L.popup({ maxWidth: 280 })
          .setLatLng(e.latlng)
          .setContent(popupHtml)
          .openOn(map);
      }
    };

    // Gunakan priority tinggi: daftar di fase capture sebelum layer GeoJSON
    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map]); // hanya register sekali; state dibaca via ref

  return null;
};

export default MapClickHandler;