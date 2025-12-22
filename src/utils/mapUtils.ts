import { MangroveGeoJSON, MapStats } from '../types';

export const getPolygonColor = (jnhtmg: number): string => {
  // Warna berdasarkan jenis hutan mangrove (JNHTMG)
  // Karena semua data Anda memiliki JNHTMG: 0, kita gunakan warna default hijau
  // Anda bisa sesuaikan dengan kategori yang ada
  switch (jnhtmg) {
    case 1:
      return '#10b981'; // Hijau untuk jenis 1
    case 2:
      return '#f59e0b'; // Orange untuk jenis 2
    case 3:
      return '#ef4444'; // Merah untuk jenis 3
    default:
      return '#059669'; // Hijau emerald default
  }
};

export const calculateStats = (data: MangroveGeoJSON): MapStats => {
  const stats: MapStats = {
    totalArea: 0,
    featureCount: data.features.length,
    conditionStats: {
      baik: 0,
      sedang: 0,
      rusak: 0,
    },
  };

  data.features.forEach((feature) => {
    if (feature.properties.SHAPE_Area) {
      // SHAPE_Area dalam derajat persegi, konversi ke meter persegi (aproksimasi)
      // 1 derajat ≈ 111km di khatulistiwa
      const areaInM2 = feature.properties.SHAPE_Area * 111000 * 111000;
      stats.totalArea += areaInM2;
    }

    // Klasifikasi berdasarkan JNHTMG atau SHAPE_Area
    const jnhtmg = feature.properties.JNHTMG;
    if (jnhtmg === 0) {
      // Jika JNHTMG 0, klasifikasi berdasarkan luas
      const area = feature.properties.SHAPE_Area;
      if (area > 0.0002) stats.conditionStats.baik++;
      else if (area > 0.00005) stats.conditionStats.sedang++;
      else stats.conditionStats.rusak++;
    }
  });

  return stats;
};

export const formatArea = (area: number): string => {
  if (area >= 1000000) {
    return `${(area / 1000000).toFixed(2)} km²`;
  } else if (area >= 10000) {
    return `${(area / 10000).toFixed(2)} ha`;
  }
  return `${area.toFixed(2)} m²`;
};