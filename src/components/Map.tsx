import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, ScaleControl } from 'react-leaflet';
import L from 'leaflet';
import { MangroveGeoJSON } from '../types';
import GeoTIFFLayer from './GeoTIFFLayer';
import OrthophotoLayer from './OrthophotoLayer';
import BekantanLayer from './BekantanLayer';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  geoJsonData: MangroveGeoJSON | null;
  basemap: 'satellite' | 'street';
  showLandcover?: boolean;
  showBoundary?: boolean;
  showOrthophoto?: boolean;
  showBekantan?: boolean;
}

// Component untuk auto zoom ke layer yang aktif
const AutoZoom: React.FC<{ 
  mangroveData: any;
  boundaryData: any;
  showMangrove: boolean;
  showBoundary: boolean;
}> = ({ mangroveData, boundaryData, showMangrove, showBoundary }) => {
  const map = useMap();

  useEffect(() => {
    const layers = [];
    
    if (showMangrove && mangroveData) {
      layers.push(L.geoJSON(mangroveData));
    }
    
    if (showBoundary && boundaryData) {
      layers.push(L.geoJSON(boundaryData));
    }

    if (layers.length > 0) {
      const group = L.featureGroup(layers);
      const bounds = group.getBounds();
      
      if (bounds.isValid()) {
        map.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 14
        });
      }
    }
  }, [mangroveData, boundaryData, showMangrove, showBoundary, map]);

  return null;
};

const BoundaryLayer: React.FC<{ show: boolean }> = ({ show }) => {
  const map = useMap();
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const layerRef = useRef<L.GeoJSON | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

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
    // Clean up existing layers
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    if (!show || !boundaryData) return;

    // Create panes
    if (!map.getPane('boundaryPane')) {
      map.createPane('boundaryPane');
      const pane = map.getPane('boundaryPane');
      if (pane) pane.style.zIndex = '650';
    }

    if (!map.getPane('stopPointsPane')) {
      map.createPane('stopPointsPane');
      const pane = map.getPane('stopPointsPane');
      if (pane) pane.style.zIndex = '680';
    }

    // Custom icons for different point types
    const createStartIcon = () => L.divIcon({
      className: 'start-point-marker',
      html: `
        <div style="position: relative;">
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 50%;
            border: 4px solid white;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: bounce 2s ease-in-out infinite;
          ">
            <span style="font-size: 20px;">🚩</span>
          </div>
          <div style="
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid white;
          "></div>
        </div>
        <style>
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        </style>
      `,
      iconSize: [40, 48],
      iconAnchor: [20, 48],
      popupAnchor: [0, -48]
    });

    const createStopIcon = (order: number) => L.divIcon({
      className: 'stop-point-marker',
      html: `
        <div style="position: relative;">
          <div style="
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(59, 130, 246, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 16px;
          ">
            ${order}
          </div>
          <div style="
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid white;
          "></div>
        </div>
      `,
      iconSize: [36, 42],
      iconAnchor: [18, 42],
      popupAnchor: [0, -42]
    });

    // Process features
    boundaryData.features.forEach((feature: any) => {
      if (feature.geometry.type === 'Point') {
        const coords = feature.geometry.coordinates;
        const latlng = L.latLng(coords[1], coords[0]);
        const props = feature.properties;

        let marker;
        let popupContent = '';

        if (props.type === 'start') {
          marker = L.marker(latlng, {
            icon: createStartIcon(),
            pane: 'stopPointsPane'
          });

          popupContent = `
            <div style="font-family: sans-serif; min-width: 200px;">
              <div style="
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                margin: -8px -8px 12px -8px;
                padding: 12px;
                border-radius: 12px 12px 0 0;
              ">
                <h3 style="margin: 0; color: white; font-size: 16px; font-weight: bold; display: flex; align-items: center;">
                  <span style="margin-right: 8px;">🚩</span>
                  ${props.Name || 'Titik Awal'}
                </h3>
              </div>
              <p style="margin: 8px 0; color: #475569; font-size: 13px;">
                ${props.description || 'Titik awal perjalanan susur mangrove'}
              </p>
            </div>
          `;
        } else if (props.type === 'stop') {
          marker = L.marker(latlng, {
            icon: createStopIcon(props.order),
            pane: 'stopPointsPane'
          });

          popupContent = `
            <div style="font-family: sans-serif; min-width: 240px;">
              <div style="
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                margin: -8px -8px 12px -8px;
                padding: 12px;
                border-radius: 12px 12px 0 0;
              ">
                <h3 style="margin: 0; color: white; font-size: 16px; font-weight: bold;">
                  Stop ${props.order}: ${props.Name || 'Titik Pemberhentian'}
                </h3>
              </div>
              <p style="margin: 8px 0; color: #475569; font-size: 13px; line-height: 1.6;">
                ${props.description || ''}
              </p>
            </div>
          `;
        }

        if (marker) {
          marker.bindPopup(popupContent, {
            maxWidth: 280,
            className: 'route-popup'
          });
          marker.addTo(map);
          markersRef.current.push(marker);
        }
      }
    });

    // Draw route line with enhanced styling
    layerRef.current = L.geoJSON(boundaryData, {
      pane: 'boundaryPane',
      filter: (feature) => feature.geometry.type === 'LineString',
      style: (feature) => {
        if (feature?.properties.type === 'route') {
          return {
            color: '#f97316',
            weight: 5,
            opacity: 0.9,
            dashArray: '12, 8',
            lineCap: 'round',
            lineJoin: 'round',
            className: 'route-line-animated'
          };
        }
        return {};
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties && feature.properties.type === 'route') {
          const props = feature.properties;
          const popupContent = `
            <div style="font-family: sans-serif; min-width: 260px;">
              <div style="
                background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                margin: -8px -8px 12px -8px;
                padding: 14px;
                border-radius: 12px 12px 0 0;
              ">
                <h3 style="margin: 0 0 6px 0; color: white; font-size: 17px; font-weight: bold; display: flex; align-items: center;">
                  ${props.Name || 'Rute Susur Mangrove'}
                </h3>
              </div>

              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
                <div style="background: #fff7ed; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #fed7aa;">
                  <div style="font-size: 11px; color: #9a3412; margin-bottom: 4px;">Jarak</div>
                  <div style="font-size: 14px; font-weight: bold; color: #7c2d12;">${props.distance || '-'}</div>
                </div>
                <div style="background: #fef3c7; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #fde68a;">
                  <div style="font-size: 11px; color: #92400e; margin-bottom: 4px;">Waktu</div>
                  <div style="font-size: 14px; font-weight: bold; color: #78350f;">${props.duration || '-'}</div>
                </div>
                <div style="background: #dcfce7; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #bbf7d0;">
                  <div style="font-size: 11px; color: #166534; margin-bottom: 4px;">Jenis Perahu</div>
                  <div style="font-size: 14px; font-weight: bold; color: #14532d;">${props.difficulty || '-'}</div>
                </div>
              </div>
          `;
          layer.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'route-popup'
          });
        }
      },
    }).addTo(map);

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
      markersRef.current.forEach(marker => map.removeLayer(marker));
      markersRef.current = [];
    };
  }, [show, boundaryData, map]);

  return null;
};

const Map: React.FC<MapProps> = ({ 
  geoJsonData, 
  basemap, 
  showLandcover = false, 
  showBoundary = false,
  showOrthophoto = false,
  showBekantan = false
}) => {
  const [boundaryData, setBoundaryData] = useState<any>(null);

  // Load boundary data for auto zoom
  useEffect(() => {
    if (showBoundary) {
      fetch('./data/rute_susur_mangrove.geojson')
        .then((response) => response.json())
        .then((data) => setBoundaryData(data))
        .catch((error) => console.error('Error loading boundary data:', error));
    }
  }, [showBoundary]);

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

        {/* Auto Zoom Component */}
        <AutoZoom 
          mangroveData={geoJsonData}
          boundaryData={boundaryData}
          showMangrove={!!geoJsonData}
          showBoundary={showBoundary}
        />

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
              fillColor: '#00FFA7',
              weight: 1,
              opacity: 1,
              color: '#fff',
              fillOpacity: 1,
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

        {/* Boundary GeoJSON dengan Stop Points (zIndex 650-680 - Paling Atas) */}
        <BoundaryLayer show={showBoundary} />

        {/* Bekantan Layer (zIndex 700) */}
        {showBekantan && <BekantanLayer show={true} />}
      </MapContainer>
    </div>
  );
};

export default Map; 