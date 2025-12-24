import { Feature, FeatureCollection, Geometry } from 'geojson';

export interface MangroveProperties {
  NAMOBJ: string | null;
  FCODE: string;
  REMARK: string;
  METADATA: string;
  SRS_ID: string | null;
  JNHTMG: number;
  SHAPE_Leng: number;
  SHAPE_Area: number;
  [key: string]: any;
}

// Gunakan type dari geojson standard untuk kompatibilitas lebih baik
export type MangroveFeature = Feature<Geometry, MangroveProperties>;

export type MangroveGeoJSON = FeatureCollection<Geometry, MangroveProperties>;

export interface MapStats {
  totalArea: number;
  featureCount: number;
  conditionStats: {
    baik: number;
    sedang: number;
    rusak: number;
  };
}