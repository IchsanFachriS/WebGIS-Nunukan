import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MangroveGeoJSON, MangroveFeature } from '../types';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  geoJsonData: MangroveGeoJSON | null;
}

// Component to fit bounds
const FitBounds: React.FC<{ data: MangroveGeoJSON }> = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (data && data.features.length > 0) {
      const geoJsonLayer = L.geoJSON(data as any);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [data, map]);

  return null;
};

const Map: React.FC<MapProps> = ({ geoJsonData }) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [geoJsonData]);

  const onEachFeature = (feature: MangroveFeature, layer: L.Layer) => {
    const props = feature.properties;
    
    // Konversi SHAPE_Area ke m² dan hektar
    const areaInM2 = props.SHAPE_Area * 111000 * 111000;
    const areaInHa = areaInM2 / 10000;
    
    // Ekstrak tahun dari METADATA
    const yearMatch = props.METADATA?.match(/(\d{4})/);
    const year = yearMatch ? yearMatch[1] : 'N/A';
    
    const popupContent = `
      <div class="p-2 min-w-[200px]">
        <h3 class="font-bold text-lg mb-2 text-gray-800">
          ${props.NAMOBJ || 'Kawasan Mangrove'}
        </h3>
        <p class="text-sm mb-1"><strong>Jenis:</strong> ${props.REMARK}</p>
        <p class="text-sm mb-1"><strong>Luas:</strong> ${areaInHa.toFixed(2)} ha (${(areaInM2/1000000).toFixed(3)} km²)</p>
        <p class="text-sm mb-1"><strong>Keliling:</strong> ${(props.SHAPE_Leng * 111).toFixed(2)} km</p>
        <p class="text-sm mb-1"><strong>Kode:</strong> ${props.FCODE}</p>
        ${props.JNHTMG ? `<p class="text-sm mb-1"><strong>Jenis HTM:</strong> ${props.JNHTMG}</p>` : ''}
        <p class="text-xs text-gray-500 mt-2"><strong>Sumber:</strong> ${props.METADATA}</p>
      </div>
    `;

    layer.bindPopup(popupContent, {
      maxWidth: 300,
      className: 'custom-popup',
    });

    // Hover effect
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          fillOpacity: 0.8,
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          fillOpacity: 0.6,
        });
      },
    });
  };

  const geoJsonStyle = (feature?: MangroveFeature) => {
    const area = feature?.properties?.SHAPE_Area || 0;
    let fillColor = '#059669'; // Default emerald
    
    // Klasifikasi berdasarkan luas area
    if (area > 0.0002) {
      fillColor = '#10b981'; // Hijau untuk area luas
    } else if (area > 0.00005) {
      fillColor = '#f59e0b'; // Orange untuk area sedang
    } else {
      fillColor = '#ef4444'; // Merah untuk area kecil
    }
    
    return {
      fillColor: fillColor,
      weight: 2,
      opacity: 1,
      color: '#fff',
      fillOpacity: 0.6,
    };
  };

  if (!geoJsonData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data peta...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      key={key}
      center={[4.08, 117.67]}
      zoom={11}
      className="w-full h-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON
        data={geoJsonData as any}
        style={geoJsonStyle}
        onEachFeature={onEachFeature}
      />
      <FitBounds data={geoJsonData} />
    </MapContainer>
  );
};

export default Map;