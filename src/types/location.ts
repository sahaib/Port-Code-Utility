export type LocationType = 'port' | 'postal';

export interface BaseLocation {
  id: string;
  name: string;
  countryCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: LocationType;
}

export interface PortLocation extends BaseLocation {
  type: 'port';
  locode: string;
  function: string;
  status: string;
  unlocodeDate?: string | null;
}

export interface PostalLocation extends BaseLocation {
  type: 'postal';
  postalCode?: string;
  city?: string;
  state?: string;
  streetAddress?: string;
  formattedAddress: string;
}

export type Location = PortLocation | PostalLocation;

export interface LocationSearchResult {
  locations: Location[];
  country: string;
} 