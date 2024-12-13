export interface PortData {
  locode: string;
  name: string;
  nameWoDiacritics: string | null;
  coordinates: string;
  latitude: number;
  longitude: number;
  subdivision: string | null;
  function: string;
  status: string;
  countryCode: string;
  date: string | null;
  iata: string | null;
  remarks: string | null;
  type: 'port';
  unlocodeDate?: string | null;
  updatedAt?: Date;
  createdAt?: Date;
  distance?: number;
}

export interface PortResponse {
  ports: PortData[];
  country: string;
}