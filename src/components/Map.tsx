import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import omnivore from 'leaflet-omnivore';
import { MangroveGeoJSON } from '../types';
import GeoTIFFLayer from './GeotiffLayer';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  geoJsonData: MangroveGeoJSON | null;
  basemap: 'satellite' | 'street';
  showLandcover?: boolean;
  showBoundary?: boolean;
}

const KMLLayer: React.FC<{ show: boolean }> = ({ show }) => {
  const map = useMap();
  const kmlLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (show) {
      if (!map.getPane('boundaryPane')) {
        map.createPane('boundaryPane');
        const pane = map.getPane('boundaryPane');
        if (pane) pane.style.zIndex = '650'; 
      }

      const customLayer = L.geoJson(null, {
        pane: 'boundaryPane',
        style: {
          color: '#f97316',
          weight: 4,
          dashArray: '5, 10',
          fillOpacity: 0,
          interactive: false
        }
      });

      kmlLayerRef.current = omnivore.kml('./data/batas_wilayah.kml', null, customLayer)
        .on('ready', function(this: any) {
          // Opsional: map.fitBounds(this.getBounds()); 
        })
        .addTo(map);
    }

    return () => {
      if (kmlLayerRef.current) {
        map.removeLayer(kmlLayerRef.current);
      }
    };
  }, [show, map]);

  return null;
};

const Map: React.FC<MapProps> = ({ geoJsonData, basemap, showLandcover, showBoundary }) => {
  return (
    <div className="w-full h-full bg-gray-200">
      <MapContainer
        center={[4.08, 117.67]}
        zoom={11}
        className="w-full h-full"
        zoomControl={false}
      >
        {/* Base Layers (zIndex rendah) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={basemap === 'street' ? 1 : 0}
          zIndex={1}
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          opacity={basemap === 'satellite' ? 1 : 0}
          zIndex={1}
        />

        {/* GeoTIFF Landcover Layer (zIndex 2) */}
        <GeoTIFFLayer 
          show={!!showLandcover} 
          url="./data/landcover.tif"
        />

        {/* Mangrove GeoJSON (zIndex default ~400) */}
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData as any}
            style={() => ({
              fillColor: '#059669',
              weight: 1,
              opacity: 1,
              color: '#fff',
              fillOpacity: 0.6,
            })}
          />
        )}

        {/* Boundary KML (zIndex 650 via Pane - Paling Atas) */}
        <KMLLayer show={!!showBoundary} />
      </MapContainer>
    </div>
  );
};

export default Map;