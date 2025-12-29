import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';

declare global {
  interface Window {
    parseGeoraster: any;
    GeoRasterLayer: any;
    L: any;
    geoblaze: any;
  }
}

interface GeoTIFFLayerProps {
  show: boolean;
  url: string;
}

const GeoTIFFLayer: React.FC<GeoTIFFLayerProps> = ({ show, url }) => {
  const map = useMap();
  const layerRef = useRef<any>(null);
  const isLoadingRef = useRef(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!show) {
      if (layerRef.current) {
        try {
          map.removeLayer(layerRef.current);
          layerRef.current = null;
        } catch (e) {
          console.error('Error removing GeoTIFF layer:', e);
        }
      }
      return;
    }

    if (layerRef.current || isLoadingRef.current) {
      return;
    }

    if (!window.parseGeoraster || !window.GeoRasterLayer) {
      console.error('GeoRaster libraries not loaded properly');
      setError('GeoRaster libraries tidak tersedia');
      return;
    }

    const loadGeoTIFF = async () => {
      isLoadingRef.current = true;
      setError(null);
      
      try {
        console.log('Loading GeoTIFF from:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        console.log('GeoTIFF downloaded, size:', arrayBuffer.byteLength);
        
        const georaster = await window.parseGeoraster(arrayBuffer);
        console.log('GeoRaster parsed successfully:', georaster);

        // Fungsi untuk mendapatkan nama tutupan lahan
        const getLandcoverName = (value: number): string => {
          switch (value) {
            case 1: return 'Air';
            case 2: return 'Vegetasi';
            case 4: return 'Vegetasi Terendam Air';
            case 5: return 'Tanaman';
            case 7: return 'Area Terbangun';
            case 8: return 'Tanah Kosong';
            case 9: return 'Salju/Es';
            case 10: return 'Awan';
            case 11: return 'Padang Rumput';
            default: return 'Tidak Diketahui';
          }
        };

        // Color mapping untuk klasifikasi
        const getColor = (value: number): string | null => {
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
            default: return null;
          }
        };

        if (show && !layerRef.current) {
          layerRef.current = new window.GeoRasterLayer({
            georaster: georaster,
            opacity: 1,
            pixelValuesToColorFn: (values: number[]) => {
              const value = values[0];
              return getColor(value);
            },
            resolution: 256,
          });

          layerRef.current.addTo(map);
          console.log('GeoTIFF layer added to map successfully');

          // Tambahkan event listener untuk klik
          map.on('click', (e: any) => {
            try {
              const latlng = e.latlng;
              
              // Ambil nilai pixel dari georaster pada koordinat yang diklik
              const values = window.geoblaze.identify(georaster, [latlng.lng, latlng.lat]);
              
              if (values && values[0] !== null && values[0] !== undefined) {
                const pixelValue = Math.round(values[0]);
                const landcoverName = getLandcoverName(pixelValue);
                const color = getColor(pixelValue);
                
                // Hanya tampilkan popup jika nilai valid
                if (color) {
                  const popupContent = `
                    <div style="font-family: sans-serif; min-width: 180px;">
                      <h3 style="margin: 0 0 8px 0; color: #0d9488; font-size: 14px; font-weight: bold;">
                        Tutupan Lahan 2024
                      </h3>
                      <div style="font-size: 12px; line-height: 1.8;">
                        <div style="display: flex; align-items: center; margin: 6px 0;">
                          <div style="width: 20px; height: 20px; background-color: ${color}; border: 1px solid #ccc; border-radius: 4px; margin-right: 8px;"></div>
                          <strong>${landcoverName}</strong>
                        </div>
                        <p style="margin: 4px 0; color: #666; font-size: 11px;">
                          Kode Kelas: ${pixelValue}
                        </p>
                      </div>
                      <p style="margin: 8px 0 0 0; font-size: 10px; color: #999; font-style: italic; border-top: 1px solid #eee; padding-top: 6px;">
                        Sumber: Esri Living Atlas
                      </p>
                    </div>
                  `;
                  
                  window.L.popup()
                    .setLatLng(latlng)
                    .setContent(popupContent)
                    .openOn(map);
                }
              }
            } catch (error) {
              console.error('Error identifying pixel value:', error);
            }
          });
        }
      } catch (error: any) {
        console.error('Error loading GeoTIFF:', error);
        setError(error.message || 'Gagal memuat layer GeoTIFF');
        
        if (map) {
          const errorControl = window.L.control({ position: 'topright' });
          errorControl.onAdd = function() {
            const div = window.L.DomUtil.create('div', 'leaflet-control-geotiff-error');
            div.innerHTML = `
              <div style="background: rgba(239, 68, 68, 0.9); color: white; padding: 8px 12px; border-radius: 8px; font-size: 12px; max-width: 250px;">
                <strong>⚠️ Error:</strong> Gagal memuat layer Tutupan Lahan
              </div>
            `;
            setTimeout(() => {
              if (div.parentNode) {
                div.parentNode.removeChild(div);
              }
            }, 5000);
            return div;
          };
          errorControl.addTo(map);
        }
      } finally {
        isLoadingRef.current = false;
      }
    };

    loadGeoTIFF();

    return () => {
      if (layerRef.current) {
        try {
          map.removeLayer(layerRef.current);
          layerRef.current = null;
        } catch (e) {
          console.error('Error in cleanup:', e);
        }
      }
      // Hapus event listener klik
      map.off('click');
      isLoadingRef.current = false;
    };
  }, [show, url, map]);

  return null;
};

export default GeoTIFFLayer;