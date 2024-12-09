import { PostalLocation, LocationSearchResult } from '../types/location';

export const searchPostalLocation = async (
  query: string,
  countryCode: string
): Promise<LocationSearchResult> => {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;
  
  const params = new URLSearchParams({
    access_token: mapboxToken,
    country: countryCode.toLowerCase(),
    types: 'address,postcode',
    limit: '5'
  });

  try {
    const response = await fetch(`${endpoint}?${params}`);
    if (!response.ok) throw new Error('Failed to fetch location data');
    
    const data = await response.json();
    
    const locations: PostalLocation[] = data.features.map((feature: any) => ({
      type: 'postal',
      id: feature.id,
      name: feature.text,
      countryCode: countryCode.toUpperCase(),
      coordinates: {
        latitude: feature.center[1],
        longitude: feature.center[0]
      },
      formattedAddress: feature.place_name,
      postalCode: feature.context?.find((c: any) => c.id.startsWith('postcode'))?.text,
      city: feature.context?.find((c: any) => c.id.startsWith('place'))?.text,
      state: feature.context?.find((c: any) => c.id.startsWith('region'))?.text,
      streetAddress: feature.address ? `${feature.address} ${feature.text}` : feature.text
    }));

    return {
      locations,
      country: countryCode.toUpperCase()
    };
  } catch (error) {
    console.error('Error fetching postal location:', error);
    throw new Error('Failed to fetch location data');
  }
}; 