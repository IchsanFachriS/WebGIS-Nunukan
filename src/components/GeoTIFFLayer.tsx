import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
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

  useEffect(() => {
    if (!show) {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
      return;
    }

    // Load GeoTIFF
    const loadGeoTIFF = async () => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const georaster = await window.parseGeoraster(arrayBuffer);

        // Color mapping untuk klasifikasi
        const getColor = (value: number) => {
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
      } catch (error) {
        console.error('Error loading GeoTIFF:', error);
      }
    };

    loadGeoTIFF();

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [show, url, map]);

  return null;
};

export default GeoTIFFLayer;