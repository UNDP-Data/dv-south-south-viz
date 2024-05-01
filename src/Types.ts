export interface CountryGroupDataType {
  'Alpha-3 code': string;
  'Country or Area': string;
  'Alpha-2 code': string;
  'Numeric code': string;
  'Latitude (average)': string;
  'Longitude (average)': string;
  'Group 1': string;
  'Group 2': string;
  'Group 3': string;
  LDC: boolean;
  LLDC: boolean;
  SIDS: boolean;
  'Development classification': string;
  'Income group': string;
}

export interface CountryDataType extends CountryGroupDataType {
  noOfProjects: number;
}

export interface DataTypeFromCSV {
  'Obs ID': string;
  'Regional Bureau': string;
  'ISO-3 Code': string;
  Typology: string;
  Method: string;
  'Approach used by UNDP': string;
  SDG: string;
  'Thematic Area': string;
  'Partners Involved': string;
}

export interface FormattedDataType {
  'Obs ID': string;
  'Regional Bureau': string;
  'ISO-3 Code'?: string;
  Typology: string[];
  Method: string;
  'Approach used by UNDP': string[];
  SDG: string[];
  'Thematic Area': string[];
  'Partners Involved': string[];
}

export interface HoverDataType {
  country: string;
  continent: string;
  noOfProjects?: number;
  xPosition: number;
  yPosition: number;
}

export type SDGColorType =
  | 'sdg1'
  | 'sdg2'
  | 'sdg3'
  | 'sdg4'
  | 'sdg5'
  | 'sdg6'
  | 'sdg7'
  | 'sdg8'
  | 'sdg9'
  | 'sdg10'
  | 'sdg11'
  | 'sdg12'
  | 'sdg13'
  | 'sdg14'
  | 'sdg15'
  | 'sdg16'
  | 'sdg17';

export interface TreeMapDataType {
  noOfInitiatives: number;
  region: string;
}
