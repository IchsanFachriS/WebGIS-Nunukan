import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface BekantanLayerProps {
  show: boolean;
}

const BekantanLayer: React.FC<BekantanLayerProps> = ({ show }) => {
  const map = useMap();
  const [bekantanData, setBekantanData] = useState<any>(null);
  const layerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    fetch('./data/bekantan_spots.geojson')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load bekantan spots');
        }
        return response.json();
      })
      .then((data) => {
        setBekantanData(data);
      })
      .catch((error) => {
        console.error('Error loading bekantan spots:', error);
      });
  }, []);

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (!show || !bekantanData) return;

    // Create custom bekantan icon
    const bekantanIcon = L.divIcon({
      className: 'bekantan-marker',
      html: `
        <div style="position: relative; width: 50px; height: 50px;">
          <!-- Pulsing animation circle -->
          <div style="
            position: absolute;
            width: 50px;
            height: 50px;
            background: radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, rgba(251, 146, 60, 0) 70%);
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
          "></div>
          
          <!-- Main icon container -->
          <div style="
            position: absolute;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s;
            left: 5px;
            top: 5px;
          " 
          onmouseover="this.style.transform='scale(1.15)'"
          onmouseout="this.style.transform='scale(1)'">
            <!-- Bekantan emoji/icon -->
            <span style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">🐒</span>
          </div>
          
          <!-- Badge for photo count -->
          <div style="
            position: absolute;
            top: 0;
            right: 0;
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">📷</div>
        </div>
        
        <style>
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.3);
              opacity: 0.5;
            }
          }
        </style>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50],
    });

    // Create pane for bekantan markers
    if (!map.getPane('bekantanPane')) {
      map.createPane('bekantanPane');
      const pane = map.getPane('bekantanPane');
      if (pane) pane.style.zIndex = '700';
    }

    layerRef.current = L.geoJSON(bekantanData, {
      pane: 'bekantanPane',
      pointToLayer: (_feature, latlng) => {
        return L.marker(latlng, { icon: bekantanIcon });
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          const props = feature.properties;
          const photos = props.photos || [];
          const videos = props.videos || [];

          // Generate photo gallery HTML
          let mediaGalleryHTML = '';
          
          if (photos.length > 0 || videos.length > 0) {
            mediaGalleryHTML = `
              <div style="margin-top: 12px;">
                <h4 style="font-size: 13px; font-weight: bold; color: #f97316; margin-bottom: 8px; display: flex; align-items: center;">
                  <span style="margin-right: 6px;">📸</span>
                  Galeri Media
                </h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; max-height: 250px; overflow-y: auto;">
                  ${photos.map((photo: string) => `
                    <div style="position: relative; cursor: pointer;" onclick="window.open('./images/bekantan/${photo}', '_blank')">
                      <img 
                        src="./images/bekantan/${photo}" 
                        alt="Bekantan"
                        style="
                          width: 100%;
                          height: 100px;
                          object-fit: cover;
                          border-radius: 8px;
                          border: 2px solid #fed7aa;
                          transition: transform 0.2s;
                        "
                        onmouseover="this.style.transform='scale(1.05)'"
                        onmouseout="this.style.transform='scale(1)'"
                        onerror="this.parentElement.style.display='none'"
                      />
                      <div style="
                        position: absolute;
                        bottom: 4px;
                        right: 4px;
                        background: rgba(0,0,0,0.6);
                        color: white;
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-size: 10px;
                        backdrop-filter: blur(4px);
                      ">📷 Foto</div>
                    </div>
                  `).join('')}
                  
                  ${videos.map((video: string) => `
                    <div style="position: relative; cursor: pointer;" onclick="window.open('./images/bekantan/${video}', '_blank')">
                      <video 
                        src="./images/bekantan/${video}" 
                        style="
                          width: 100%;
                          height: 100px;
                          object-fit: cover;
                          border-radius: 8px;
                          border: 2px solid #fed7aa;
                          transition: transform 0.2s;
                        "
                        onmouseover="this.style.transform='scale(1.05)'; this.play();"
                        onmouseout="this.style.transform='scale(1)'; this.pause(); this.currentTime=0;"
                        onerror="this.parentElement.style.display='none'"
                        muted
                      ></video>
                      <div style="
                        position: absolute;
                        bottom: 4px;
                        right: 4px;
                        background: rgba(0,0,0,0.6);
                        color: white;
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-size: 10px;
                        backdrop-filter: blur(4px);
                      ">🎥 Video</div>
                    </div>
                  `).join('')}
                </div>
                <p style="
                  font-size: 10px;
                  color: #9ca3af;
                  margin-top: 8px;
                  text-align: center;
                  font-style: italic;
                ">
                  Klik untuk memperbesar • ${photos.length} foto, ${videos.length} video
                </p>
              </div>
            `;
          }

          const popupContent = `
            <div style="font-family: sans-serif; min-width: 280px; max-width: 320px;">
              <!-- Header -->
              <div style="
                background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
                margin: -8px -8px 12px -8px;
                padding: 12px;
                border-radius: 12px 12px 0 0;
              ">
                <h3 style="
                  margin: 0;
                  color: white;
                  font-size: 16px;
                  font-weight: bold;
                  display: flex;
                  align-items: center;
                ">
                  <span style="font-size: 24px; margin-right: 8px;">🐒</span>
                  ${props.name || 'Spot Bekantan'}
                </h3>
              </div>

              <!-- Info Content -->
              <div style="font-size: 13px; line-height: 1.6;">
                <p style="margin: 8px 0; color: #475569;">
                  ${props.description || ''}
                </p>

                <div style="
                  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                  padding: 10px;
                  border-radius: 8px;
                  margin: 10px 0;
                  border-left: 4px solid #f59e0b;
                ">
                  <p style="margin: 4px 0; color: #92400e; font-weight: 600;">
                    Waktu Terbaik
                  </p>
                  <p style="margin: 4px 0; color: #78350f;">
                    ${props.best_time || '-'}
                  </p>
                </div>

              </div>

              ${mediaGalleryHTML}

            </div>
          `;

          layer.bindPopup(popupContent, {
            maxWidth: 350,
            className: 'bekantan-popup'
          });
        }
      },
    }).addTo(map);

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [show, bekantanData, map]);

  return null;
};

export default BekantanLayer;