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

interface GeoTIFFLayerProps {
  show: boolean;
  url: string;
  onGeoRasterReady?: (georaster: any | null) => void;
}

const GeoTIFFLayer: React.FC<GeoTIFFLayerProps> = ({ show, url, onGeoRasterReady }) => {
  const map = useMap();
  const layerRef = useRef<any>(null);
  const isLoadingRef = useRef(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup layer sebelumnya
    if (layerRef.current) {
      try {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      } catch (e) {
        console.error('Error removing GeoTIFF layer:', e);
      }
    }

    if (!show) {
      isLoadingRef.current = false;
      onGeoRasterReady?.(null);
      return;
    }

    if (layerRef.current || isLoadingRef.current) return;

    if (!window.parseGeoraster || !window.GeoRasterLayer) {
      console.error('GeoRaster libraries not loaded');
      setError('GeoRaster libraries tidak tersedia');
      return;
    }

    const loadGeoTIFF = async () => {
      isLoadingRef.current = true;
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        const georaster = await window.parseGeoraster(arrayBuffer);

        if (show && !layerRef.current) {
          const getColor = (value: number): string | null => {
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

          layerRef.current = new window.GeoRasterLayer({
            georaster,
            opacity: 1,
            pixelValuesToColorFn: (values: number[]) => getColor(values[0]),
            resolution: 256,
          });

          layerRef.current.addTo(map);

          // Ekspor georaster ke parent agar click handler terpusat bisa menggunakannya
          onGeoRasterReady?.(georaster);
        }
      } catch (error: any) {
        console.error('Error loading GeoTIFF:', error);
        setError(error.message || 'Gagal memuat layer GeoTIFF');
        onGeoRasterReady?.(null);
      } finally {
        isLoadingRef.current = false;
      }
    };

    loadGeoTIFF();

    return () => {
      if (layerRef.current) {
        try {
          map.removeLayer(layerRef.current);
          layerRef.current = null;
        } catch (e) {
          console.error('Error in GeoTIFF cleanup:', e);
        }
      }
      isLoadingRef.current = false;
      onGeoRasterReady?.(null);
    };
  }, [show, url, map]);

  return null;
};

export default GeoTIFFLayer;