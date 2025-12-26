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
    // Hapus layer lama jika ada
    if (kmlLayerRef.current) {
      map.removeLayer(kmlLayerRef.current);
      kmlLayerRef.current = null;
    }

    if (!show) return;

    // Buat pane khusus untuk boundary agar berada di atas
    if (!map.getPane('boundaryPane')) {
      map.createPane('boundaryPane');
      const pane = map.getPane('boundaryPane');
      if (pane) pane.style.zIndex = '650'; 
    }

    const customLayer = L.geoJson(null, {
      pane: 'boundaryPane',
      style: {
        color: '#f97316', // Orange
        weight: 3,
        opacity: 1,
        dashArray: '8, 12', // Pola garis putus-putus yang lebih jelas
        fillOpacity: 0,
        interactive: false
      }
    });

    kmlLayerRef.current = omnivore.kml('./data/batas_wilayah.kml', null, customLayer)
      .on('ready', function(this: any) {
        console.log('KML Boundary loaded');
      })
      .on('error', function(e: any) {
        console.error('Error loading KML:', e);
      })
      .addTo(map);

    return () => {
      if (kmlLayerRef.current) {
        map.removeLayer(kmlLayerRef.current);
        kmlLayerRef.current = null;
      }
    };
  }, [show, map]);

  return null;
};

const Map: React.FC<MapProps> = ({ geoJsonData, basemap, showLandcover = false, showBoundary = false }) => {
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          opacity={basemap === 'satellite' ? 1 : 0}
          zIndex={1}
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        />

        {/* GeoTIFF Landcover Layer - PENTING: Hanya tampil jika showLandcover true */}
        {showLandcover && (
          <GeoTIFFLayer 
            show={true} 
            url="./data/landcover.tif"
          />
        )}

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
            onEachFeature={(feature, layer) => {
              if (feature.properties) {
                const props = feature.properties;
                const popupContent = `
                  <div style="font-family: sans-serif; min-width: 200px;">
                    <h3 style="margin: 0 0 8px 0; color: #059669; font-size: 14px; font-weight: bold;">
                      ${props.NAMOBJ || 'Kawasan Mangrove'}
                    </h3>
                    <div style="font-size: 12px; line-height: 1.6;">
                      <p style="margin: 4px 0;"><strong>Luas:</strong> ${(props.SHAPE_Area * 111000 * 111000 / 10000).toFixed(2)} ha</p>
                      <p style="margin: 4px 0;"><strong>Kode:</strong> ${props.FCODE || '-'}</p>
                      <p style="margin: 4px 0;"><strong>Jenis:</strong> ${props.JNHTMG || 0}</p>
                    </div>
                  </div>
                `;
                layer.bindPopup(popupContent);
              }
            }}
          />
        )}

        {/* Boundary KML (zIndex 650 via Pane - Paling Atas) */}
        <KMLLayer show={showBoundary} />
      </MapContainer>
    </div>
  );
};

export default Map;