import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, ScaleControl } from 'react-leaflet';
import L from 'leaflet';
import { MangroveGeoJSON } from '../types';
import GeoTIFFLayer from './GeoTIFFLayer';
import OrthophotoLayer from './OrthophotoLayer';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  geoJsonData: MangroveGeoJSON | null;
  basemap: 'satellite' | 'street';
  showLandcover?: boolean;
  showBoundary?: boolean;
  showOrthophoto?: boolean;
}

const BoundaryLayer: React.FC<{ show: boolean }> = ({ show }) => {
  const map = useMap();
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const layerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    fetch('./data/rute_susur_mangrove.geojson')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load boundary GeoJSON');
        }
        return response.json();
      })
      .then((data) => {
        setBoundaryData(data);
      })
      .catch((error) => {
        console.error('Error loading boundary GeoJSON:', error);
      });
  }, []);

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (!show || !boundaryData) return;

    if (!map.getPane('boundaryPane')) {
      map.createPane('boundaryPane');
      const pane = map.getPane('boundaryPane');
      if (pane) pane.style.zIndex = '650';
    }

    layerRef.current = L.geoJSON(boundaryData, {
      pane: 'boundaryPane',
      style: {
        color: '#f97316',
        weight: 3,
        opacity: 1,
        dashArray: '8, 12',
        fillOpacity: 0,
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          const props = feature.properties;
          const popupContent = `
            <div style="font-family: sans-serif; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #f97316; font-size: 14px; font-weight: bold;">
                ${props.DESA || 'Rute Susur Mangrove'}
              </h3>
            </div>
          `;
          layer.bindPopup(popupContent);
        }
      },
    }).addTo(map);

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [show, boundaryData, map]);

  return null;
};

const Map: React.FC<MapProps> = ({ 
  geoJsonData, 
  basemap, 
  showLandcover = false, 
  showBoundary = false,
  showOrthophoto = false 
}) => {
  return (
    <div className="w-full h-full bg-gray-200">
      <MapContainer
        center={[4.08, 117.67]}
        zoom={11}
        className="w-full h-full"
        zoomControl={false}
      >
        {/* Scale Control */}
        <ScaleControl position="bottomleft" imperial={false} />

        {/* Base Layers (zIndex 1) */}
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

        {/* GeoTIFF Landcover Layer (zIndex default ~200) */}
        {showLandcover && (
          <GeoTIFFLayer 
            show={true} 
            url="./data/landcover.tif"
          />
        )}

        {/* Orthofoto Layer dari MapTiler (zIndex 300 - via pane) */}
        {showOrthophoto && (
          <OrthophotoLayer
            show={true}
            tileUrl="https://api.maptiler.com/tiles/019bdf3c-bab9-7f60-a89c-0eb5b3915741/{z}/{x}/{y}.png?key=eEVS9pTGeOsrG57V9SUj"
            opacity={0.85}
          />
        )}

        {/* Mangrove GeoJSON (zIndex default ~400) */}
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData as any}
            style={() => ({
              fillColor: '#00400E',
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

        {/* Boundary GeoJSON (zIndex 650 - Paling Atas) */}
        <BoundaryLayer show={showBoundary} />
      </MapContainer>
    </div>
  );
};

export default Map;