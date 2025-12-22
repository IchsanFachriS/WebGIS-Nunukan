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

export interface MangroveFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  properties: MangroveProperties;
}

export interface MangroveGeoJSON {
  type: 'FeatureCollection';
  features: MangroveFeature[];
}

export interface MapStats {
  totalArea: number;
  featureCount: number;
  conditionStats: {
    baik: number;
    sedang: number;
    rusak: number;
  };
}