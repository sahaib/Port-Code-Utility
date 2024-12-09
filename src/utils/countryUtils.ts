import { SUPPORTED_COUNTRIES } from '../config/constants';

interface CountryInfo {
  name: string;
  flag: string;
}

export const getCountryInfo = (countryCode: string): CountryInfo => {
  const country = SUPPORTED_COUNTRIES[countryCode as keyof typeof SUPPORTED_COUNTRIES];
  return country || { name: countryCode, flag: '🏳️' };
}; 