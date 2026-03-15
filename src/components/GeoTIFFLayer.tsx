import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';

declare global {
  interface Window {
    parseGeoraster: any;
    GeoRasterLayer: any;
    geoblaze: any;
  }
}

interface GeoTIFFLayerProps {
  show: boolean;
  url: string;
  onGeoRasterReady?: (georaster: any | null) => void;
}

export const LANDCOVER_COLOR: Record<number, string> = {
  1: '#0000FF',
  2: '#00FF00',
  4: '#90EE90',
  5: '#32CD32',
  7: '#FF0000',
  8: '#D2691E',
  9: '#FFFFFF',
  10: '#CCCCCC',
  11: '#ADFF2F',
};

const GeoTIFFLayer: React.FC<GeoTIFFLayerProps> = ({ show, url, onGeoRasterReady }) => {
  const map          = useMap();
  const layerRef     = useRef<any>(null);
  const isLoadingRef = useRef(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    if (layerRef.current) {
      try { map.removeLayer(layerRef.current); } catch (_) {}
      layerRef.current = null;
    }

    if (!show) {
      isLoadingRef.current = false;
      onGeoRasterReady?.(null);
      return;
    }

    if (isLoadingRef.current) return;

    if (!window.parseGeoraster || !window.GeoRasterLayer) {
      setError('GeoRaster libraries tidak tersedia');
      return;
    }

    const load = async () => {
      isLoadingRef.current = true;
      setError(null);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf      = await res.arrayBuffer();
        const georaster = await window.parseGeoraster(buf);

        if (!show || layerRef.current) return;

        layerRef.current = new window.GeoRasterLayer({
          georaster,
          opacity: 1,
          pixelValuesToColorFn: (values: number[]) =>
            LANDCOVER_COLOR[values[0]] ?? null,
          resolution: 256,
          interactive: false,   // jangan tangkap mouse events
        });

        layerRef.current.addTo(map);

        // Matikan pointer-events pada semua canvas di pane ini
        disableCanvasPointerEvents(map);

        onGeoRasterReady?.(georaster);
      } catch (err: any) {
        console.error('GeoTIFF load error:', err);
        setError(err.message ?? 'Gagal memuat GeoTIFF');
        onGeoRasterReady?.(null);
      } finally {
        isLoadingRef.current = false;
      }
    };

    load();

    return () => {
      if (layerRef.current) {
        try { map.removeLayer(layerRef.current); } catch (_) {}
        layerRef.current = null;
      }
      isLoadingRef.current = false;
      onGeoRasterReady?.(null);
    };
  }, [show, url, map]);

  return null;
};

/** Set pointer-events:none pada semua canvas dalam semua pane peta */
export function disableCanvasPointerEvents(map: any) {
  try {
    const container = map.getContainer() as HTMLElement;
    container.querySelectorAll('canvas').forEach((c: HTMLCanvasElement) => {
      c.style.pointerEvents = 'none';
    });
  } catch (_) {}
}

export default GeoTIFFLayer;