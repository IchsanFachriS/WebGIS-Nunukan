import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MangroveGeoJSON } from '../types';
import GeoTIFFLayer from './GeoTIFFLayer';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  geoJsonData: MangroveGeoJSON | null;
  basemap: 'satellite' | 'street';
  showLandcover?: boolean;
  showBoundary?: boolean;
}

const BoundaryLayer: React.FC<{ show: boolean }> = ({ show }) => {
  const map = useMap();
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const layerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    // Load GeoJSON data
    fetch('./data/batas_wilayah.geojson')
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
    // Remove existing layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (!show || !boundaryData) return;

    // Create pane for boundary layer
    if (!map.getPane('boundaryPane')) {
      map.createPane('boundaryPane');
      const pane = map.getPane('boundaryPane');
      if (pane) pane.style.zIndex = '650';
    }

    // Add boundary layer
    layerRef.current = L.geoJSON(boundaryData, {
      pane: 'boundaryPane',
      style: {
        color: '#f97316', // Orange
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
                ${props.DESA || 'Batas Wilayah'}
              </h3>
              <div style="font-size: 12px; line-height: 1.6;">
                <p style="margin: 4px 0;"><strong>Kecamatan:</strong> ${props.KECAMATAN || '-'}</p>
                <p style="margin: 4px 0;"><strong>Kabupaten:</strong> ${props.KAB_KOTA || '-'}</p>
                <p style="margin: 4px 0;"><strong>Provinsi:</strong> ${props.PROVINSI || '-'}</p>
                ${props.LUAS_WILAY ? `<p style="margin: 4px 0;"><strong>Luas:</strong> ${props.LUAS_WILAY} km²</p>` : ''}
                ${props.JUMLAH_PEN ? `<p style="margin: 4px 0;"><strong>Jumlah Penduduk:</strong> ${props.JUMLAH_PEN.toLocaleString()}</p>` : ''}
              </div>
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

        {/* GeoTIFF Landcover Layer */}
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

        {/* Boundary GeoJSON (zIndex 650 via Pane - Paling Atas) */}
        <BoundaryLayer show={showBoundary} />
      </MapContainer>
    </div>
  );
};

export default Map;