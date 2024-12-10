import React, { useState, useMemo } from 'react';
import { Search, Loader2, ChevronDown } from 'lucide-react';
import { SUPPORTED_COUNTRIES } from '../config/constants';

interface SearchBarProps {
  value: string;
  countryCode: string;
  onChange: (value: string) => void;
  onCountryChange: (code: string) => void;
  onSubmit: (value: string, countryCode: string) => void;
  isLoading: boolean;
  hideSearchIcon?: boolean;
  isDark?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  countryCode,
  onChange,
  onCountryChange,
  onSubmit,
  isLoading,
  hideSearchIcon,
  isDark
}) => {
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

  return (
    <div className="w-full max-w-2xl flex flex-col md:flex-row gap-2">
      <div className="relative min-w-[250px] country-select">
        <div 
          className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 
                     flex items-center justify-between cursor-pointer bg-white"
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
                    onCountryChange(code);
                    setIsCountryDropdownOpen(false);
                    setCountrySearch('');
                  }}
                >
                  <span className="text-xl">{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="text-gray-500 text-sm ml-auto">{code}</span>
                </div>
              ))}
              {filteredCountries.length === 0 && (
                <div className="px-4 py-2 text-gray-500 text-center">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit(value, countryCode)}
          placeholder="Enter LOCODE (in CAPS) or port name..."
          className="search-input w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {!hideSearchIcon && (
          <button
            onClick={() => onSubmit(value, countryCode)}
            disabled={isLoading}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full
              ${isDark 
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                : 'text-gray-600 hover:bg-gray-100'
              } transition-colors`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};