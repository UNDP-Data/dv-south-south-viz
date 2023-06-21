export interface CountryGroupDataType {
  'Alpha-3 code-1': string;
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
  noOfProjectAsProvider: number;
  noOfProjectAsHost: number;
}

export interface DataTypeFromCSV {
  Number: string;
  'Project Name': string;
  Links: string;
  Description: string;
  'Host/Recipient Country/ies': string;
  'Provider Country/ies': string;
  'Regions Involved': string;
  'Entity/ies Supporting and/or Implementing': string;
  'Is the private sector involved?': string;
  'Does it involve LDCs?': string;
  'UNDP as Implementor': string;
  'UNDP as Donor': string;
  'Start year': string;
  'End year': string;
  'Thematic Areas': string;
  'Sub-thematic areas': string;
  'Primary SDG Contribution': string;
  'Secondary SDG Contribution': string;
}

export interface FormattedDataType {
  Number: number;
  'Project Name': string;
  Links: string[];
  Description: string;
  'Host/Recipient Country/ies': string[];
  'Provider Country/ies': string[];
  'Regions Involved': string[];
  'Entity/ies Supporting and/or Implementing': string[];
  'Is the private sector involved?': boolean;
  'Does it involve LDCs?': boolean;
  'UNDP as Implementor': boolean;
  'UNDP as Donor': boolean;
  'Start year': number;
  'End year'?: number;
  'Thematic Areas': string[];
  'Sub-thematic areas': string[];
  'Primary SDG Contribution'?: string;
  'Secondary SDG Contribution': string[];
}

export interface HoverDataType {
  country: string;
  continent: string;
  noOfProjectsAsHost?: number;
  noOfProjectsAsProvider?: number;
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
