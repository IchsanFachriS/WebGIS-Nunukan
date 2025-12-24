import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MangroveGeoJSON } from '../types';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  geoJsonData: MangroveGeoJSON | null;
  basemap: 'satellite' | 'street';
}

const FitBounds: React.FC<{ data: MangroveGeoJSON | null }> = ({ data }) => {
  const map = useMap();
  useEffect(() => {
    if (data && data.features.length > 0) {
      const geoJsonLayer = L.geoJSON(data as any);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [data, map]);
  return null;
};

const Map: React.FC<MapProps> = ({ geoJsonData, basemap }) => {
  // Fungsi style dipindahkan ke luar atau di-memoize agar referensi tetap stabil
  const geoJsonStyle = () => ({
    fillColor: '#059669',
    weight: 2,
    opacity: 1,
    color: '#fff',
    fillOpacity: 0.6,
  });

  // Fix: Ubah tipe parameter menjadi any atau gunakan GeoJSON.Feature
  const onEachFeature = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    const areaInHa = (props.SHAPE_Area * 111000 * 111000) / 10000;
    
    layer.bindPopup(`
      <div class="p-3 font-sans">
        <h3 class="font-bold text-gray-800 border-b pb-2 mb-2">${props.NAMOBJ || 'Kawasan Mangrove'}</h3>
        <p class="text-sm">Jenis: <span class="font-semibold">${props.REMARK}</span></p>
        <p class="text-sm">Luas: <span class="font-semibold">${areaInHa.toFixed(2)} ha</span></p>
      </div>
    `, { className: 'custom-popup' });
  };

  return (
    <div className="w-full h-full bg-gray-200">
      <MapContainer
        center={[4.08, 117.67]}
        zoom={11}
        className="w-full h-full"
        zoomControl={false}
      >
        {/* Render kedua layer tapi kontrol opacity/visibility via basemap state */}
        <TileLayer
          key="osm"
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={basemap === 'street' ? 1 : 0}
          zIndex={basemap === 'street' ? 1 : 0}
        />
        <TileLayer
          key="esrisat"
          attribution='&copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          opacity={basemap === 'satellite' ? 1 : 0}
          zIndex={basemap === 'satellite' ? 1 : 0}
        />

        {geoJsonData && (
          <GeoJSON
            key={JSON.stringify(geoJsonData.features.length)}
            data={geoJsonData as any}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        )}
        
        <FitBounds data={geoJsonData} />
      </MapContainer>
    </div>
  );
};

export default Map;