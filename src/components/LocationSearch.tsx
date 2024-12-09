import React, { useState, useMemo, Dispatch, SetStateAction } from 'react';
import { Search, Loader2, ChevronDown } from 'lucide-react';
import { SUPPORTED_COUNTRIES } from '../config/constants';
import { Location, LocationType } from '../types/location';

interface LocationSearchProps {
  label: string;
  onLocationSelect: Dispatch<SetStateAction<Location | null>>;
  selectedLocation: Location | null;
  onSearch: (value: string, countryCode: string, type: LocationType) => Promise<Location[]>;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  label,
  onLocationSelect,
  onSearch
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [locationType, setLocationType] = useState<LocationType>('port');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const filteredCountries = useMemo(() => {
    const searchTerm = countrySearch.toLowerCase();
    return Object.entries(SUPPORTED_COUNTRIES).filter(([_, country]) => 
      country.name.toLowerCase().includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm)
    );
  }, [countrySearch]);

  const selectedCountry = countryCode ? SUPPORTED_COUNTRIES[countryCode as keyof typeof SUPPORTED_COUNTRIES] : null;

  const handleSearch = async () => {
    if (!countryCode || !searchValue) {
      setError('Please select a country and enter a search term');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const locations = await onSearch(searchValue, countryCode, locationType);
      if (locations.length === 0) {
        setError('No locations found');
      } else {
        onLocationSelect(locations[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <h2 className="text-xl font-bold">{label}</h2>
      
      <div className={`${label === 'To' ? 'destination-search' : ''}`}>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex gap-2">
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value as LocationType)}
              className={`claymorphic ${label === 'To' ? 'dest-type-select' : 'location-type-select'} w-full px-4 py-2 rounded-lg border border-gray-300`}
            >
              <option value="port">Port</option>
              <option value="postal">Postal/Door</option>
            </select>

            <div 
              className={`${label === 'To' ? 'dest-country-select' : 'country-select'} relative min-w-[200px]`}
            >
              <div 
                className="country-select w-full px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 
                          flex items-center justify-between cursor-pointer bg-white focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              >
                <div className="flex items-center gap-2">
                  {selectedCountry ? (
                    <>
                      <span className="text-xl">{selectedCountry.flag}</span>
                      <span className="truncate">{selectedCountry.name}</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Select Country</span>
                  )}
                </div>
                <ChevronDown className={`transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} size={20} />
              </div>

              {isCountryDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="p-2 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Search countries..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {filteredCountries.map(([code, country]) => (
                      <div
                        key={code}
                        className={`px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100
                          ${countryCode === code ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          setCountryCode(code);
                          setIsCountryDropdownOpen(false);
                          setCountrySearch('');
                        }}
                      >
                        <span className="text-xl">{country.flag}</span>
                        <span>{country.name}</span>
                        <span className="text-gray-500 text-sm ml-auto">{code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={locationType === 'port' 
                ? "Enter LOCODE (in CAPS) or port name..." 
                : "Enter address or postal code..."}
              className={`${label === 'To' ? 'dest-search-input' : 'search-input'} w-full px-4 py-2 pr-12 rounded-lg border border-gray-300`}
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}; 