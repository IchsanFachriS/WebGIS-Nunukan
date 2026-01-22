import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface OrthophotoLayerProps {
  show: boolean;
  tileUrl: string;
  opacity?: number;
}

const OrthophotoLayer: React.FC<OrthophotoLayerProps> = ({ 
  show, 
  tileUrl,
  opacity = 0.85
}) => {
  const map = useMap();
  const layerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    // Remove existing layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (!show) return;

    // Create pane untuk orthofoto (z-index antara basemap dan data lain)
    if (!map.getPane('orthophotoPane')) {
      map.createPane('orthophotoPane');
      const pane = map.getPane('orthophotoPane');
      if (pane) pane.style.zIndex = '300';
    }

    try {
      // Create tile layer dengan MapTiler URL
      layerRef.current = L.tileLayer(tileUrl, {
        pane: 'orthophotoPane',
        maxZoom: 22,
        minZoom: 10,
        attribution: '© Orthofoto Desa Srinanti | <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a>',
        opacity: opacity,
        crossOrigin: true,
      }).addTo(map);
      
      console.log('✅ Orthofoto tiles layer added successfully');

      // Event listeners untuk monitoring
      layerRef.current.on('loading', () => {
        console.log('🔄 Loading orthofoto tiles...');
      });

      layerRef.current.on('load', () => {
        console.log('✅ Orthofoto tiles loaded');
      });

      layerRef.current.on('tileerror', (error) => {
        console.error('❌ Error loading tile:', error);
      });

    } catch (error) {
      console.error('❌ Error adding orthofoto layer:', error);
    }

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [show, tileUrl, opacity, map]);

  return null;
};

export default OrthophotoLayer;