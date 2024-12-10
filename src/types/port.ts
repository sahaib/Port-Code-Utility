export interface PortData {
  locode: string;
  name: string;
  nameWoDiacritics: string;
  subdivision: string;
  function: string;
  status: string;
  date: string;
  iata: string;
  coordinates: string;
  remarks: string;
  type: 'port' | 'postal';
}

export interface PortResponse {
  ports: PortData[];
  country: string;
}