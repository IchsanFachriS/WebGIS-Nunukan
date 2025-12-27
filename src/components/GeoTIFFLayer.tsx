import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import 'georaster';
import 'georaster-layer-for-leaflet';

declare global {
  interface Window {
    parseGeoraster: any;
    GeoRasterLayer: any;
  }
}

interface GeoTIFFLayerProps {
  show: boolean;
  url: string;
}

const GeoTIFFLayer: React.FC<GeoTIFFLayerProps> = ({ show, url }) => {
  const map = useMap();
  const layerRef = useRef<any>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    // Jika show false, hapus layer dan return
    if (!show) {
      if (layerRef.current) {
        try {
          map.removeLayer(layerRef.current);
          layerRef.current = null;
        } catch (e) {
          console.error('Error removing GeoTIFF layer:', e);
        }
      }
      return;
    }

    // Jika sudah ada layer atau sedang loading, skip
    if (layerRef.current || isLoadingRef.current) {
      return;
    }

    // Load GeoTIFF
    const loadGeoTIFF = async () => {
      isLoadingRef.current = true;
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch GeoTIFF');
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const georaster = await window.parseGeoraster(arrayBuffer);

        // Color mapping untuk klasifikasi
        const getColor = (value: number): string | null => {
          switch (value) {
            case 1: return '#0000FF'; // Air - Biru
            case 2: return '#00FF00'; // Vegetasi - Hijau
            case 4: return '#90EE90'; // Vegetasi terendam - Hijau Pucat
            case 5: return '#32CD32'; // Tanaman - Lime Green
            case 7: return '#FF0000'; // Area Terbangun - Merah
            case 8: return '#D2691E'; // Tanah Kosong - Coklat
            case 9: return '#FFFFFF'; // Salju/Es - Putih
            case 10: return '#CCCCCC'; // Awan - Abu-abu
            case 11: return '#ADFF2F'; // Padang Rumput - Yellow Green
            default: return null; // Transparent untuk nilai lain
          }
        };

        // Buat layer hanya jika masih show=true
        if (show && !layerRef.current) {
          layerRef.current = new window.GeoRasterLayer({
            georaster: georaster,
            opacity: 0.6,
            pixelValuesToColorFn: (values: number[]) => {
              const value = values[0];
              return getColor(value);
            },
            resolution: 256,
          });

          layerRef.current.addTo(map);
          console.log('GeoTIFF layer added to map');
        }
      } catch (error) {
        console.error('Error loading GeoTIFF:', error);
      } finally {
        isLoadingRef.current = false;
      }
    };

    loadGeoTIFF();

    // Cleanup function
    return () => {
      if (layerRef.current) {
        try {
          map.removeLayer(layerRef.current);
          layerRef.current = null;
        } catch (e) {
          console.error('Error in cleanup:', e);
        }
      }
      isLoadingRef.current = false;
    };
  }, [show, url, map]);

  return null;
};

export default GeoTIFFLayer;