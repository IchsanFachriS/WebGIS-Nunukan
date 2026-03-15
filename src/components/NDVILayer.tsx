import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';

declare global {
  interface Window {
    parseGeoraster: any;
    GeoRasterLayer: any;
    L: any;
    geoblaze: any;
  }
}

interface NDVILayerProps {
  show: boolean;
  year: number;
  onGeoRasterReady?: (georaster: any | null) => void;
}

export const getNDVIColor = (value: number): string | null => {
  if (value === null || value === undefined || isNaN(value)) return null;
  const v = Math.max(-1, Math.min(1, value));
  const t = (v + 1) / 2;

  let r: number, g: number, b: number;

  if (t < 0.25) {
    const s = t / 0.25;
    r = 140 + Math.round(s * 60);
    g = Math.round(s * 20);
    b = 0;
  } else if (t < 0.45) {
    const s = (t - 0.25) / 0.2;
    r = 200 + Math.round(s * 55);
    g = 20 + Math.round(s * 160);
    b = 0;
  } else if (t < 0.55) {
    const s = (t - 0.45) / 0.1;
    r = 255;
    g = 180 + Math.round(s * 40);
    b = Math.round(s * 20);
  } else if (t < 0.70) {
    const s = (t - 0.55) / 0.15;
    r = 255 - Math.round(s * 170);
    g = 220 - Math.round(s * 10);
    b = 20 - Math.round(s * 20);
  } else if (t < 0.85) {
    const s = (t - 0.70) / 0.15;
    r = 85 - Math.round(s * 40);
    g = 210 - Math.round(s * 30);
    b = 0;
  } else {
    const s = (t - 0.85) / 0.15;
    r = 45 - Math.round(s * 20);
    g = 180 - Math.round(s * 50);
    b = 0;
  }

  return `rgb(${r},${g},${b})`;
};

const NDVILayer: React.FC<NDVILayerProps> = ({ show, year, onGeoRasterReady }) => {
  const map = useMap();
  const layerRef = useRef<any>(null);
  const isLoadingRef = useRef(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    if (layerRef.current) {
      try {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      } catch (e) {
        console.error('Error removing NDVI layer:', e);
      }
    }

    if (!show) {
      isLoadingRef.current = false;
      onGeoRasterReady?.(null);
      return;
    }

    if (layerRef.current || isLoadingRef.current) return;

    if (!window.parseGeoraster || !window.GeoRasterLayer) {
      setError('GeoRaster libraries tidak tersedia');
      return;
    }

    const url = `./data/ndvi_${year}.tif`;

    const loadNDVI = async () => {
      isLoadingRef.current = true;
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        const georaster = await window.parseGeoraster(arrayBuffer);

        if (show && !layerRef.current) {
          const noDataValue = georaster.noDataValue;

          layerRef.current = new window.GeoRasterLayer({
            georaster,
            opacity: 0.8,
            pixelValuesToColorFn: (values: number[]) => {
              const value = values[0];
              if (
                value === null ||
                value === undefined ||
                isNaN(value) ||
                (noDataValue !== null && value === noDataValue)
              ) return null;
              return getNDVIColor(value);
            },
            resolution: 256,
          });

          layerRef.current.addTo(map);
          onGeoRasterReady?.(georaster);
        }
      } catch (err: any) {
        console.error(`Error loading NDVI ${year}:`, err);
        setError(err.message || `Gagal memuat NDVI ${year}`);
        onGeoRasterReady?.(null);
      } finally {
        isLoadingRef.current = false;
      }
    };

    loadNDVI();

    return () => {
      if (layerRef.current) {
        try {
          map.removeLayer(layerRef.current);
          layerRef.current = null;
        } catch (e) {
          console.error('Error in NDVI cleanup:', e);
        }
      }
      isLoadingRef.current = false;
      onGeoRasterReady?.(null);
    };
  }, [show, year, map]);

  return null;
};

export default NDVILayer;