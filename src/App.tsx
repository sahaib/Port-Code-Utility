import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Anchor, Ship, AlertCircle, MapPin, RefreshCw, Moon, Sun, FileSpreadsheet } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { PortCard } from './components/PortCard';
import { DistanceCalculator } from './components/DistanceCalculator';
import { UnifiedDistanceCalculator } from './components/UnifiedDistanceCalculator';
import { fetchPortData } from './services/portService';
import { PortData } from './types/port';
import { isValidLocode } from './utils/portUtils';
import { Disclaimer } from './components/Disclaimer';
import { Guide } from './components/Guide';
import { useDarkMode } from './hooks/useDarkMode';
import { LoadingState } from './components/LoadingState';
import { BulkDistanceCalculator } from './components/BulkDistanceCalculator';

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [portData, setPortData] = useState<PortData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [isDark, setIsDark] = useDarkMode();

  const handleSearch = async () => {
    if (!countryCode) {
      setError('Please select a country');
      return;
    }

    if (!searchValue) {
      setError('Please enter a LOCODE or port name');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPortData([]);

    try {
      const searchType = isValidLocode(searchValue) ? 'locode' : 'name';
      const response = await fetchPortData({
        value: searchValue,
        type: searchType,
        countryCode
      });

      setPortData(response.ports);
      
      if (response.ports.length === 0) {
        setError(`No ports found ${searchType === 'locode' ? 'with the specified LOCODE' : 'matching the search term'}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch port data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePortSearch = async (value: string, countryCode: string): Promise<PortData[]> => {
    const response = await fetchPortData({
      value,
      type: isValidLocode(value) ? 'locode' : 'name',
      countryCode
    });
    return response.ports;
  };

  const handleStartGuide = () => {
    localStorage.removeItem(`hasSeenGuide_lookup`);
    localStorage.removeItem(`hasSeenGuide_distance`);
    localStorage.removeItem(`hasSeenGuide_unified`);
    localStorage.removeItem(`hasSeenGuide_bulk`);
    setShowGuide(true);
  };

  return (
    <BrowserRouter>
      <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <div className="flex justify-center mb-4 sm:mb-8">
            <NavLink to="/" className="text-3xl sm:text-4xl">⚓</NavLink>
          </div>
          
          <nav className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `nav-button flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-all text-sm sm:text-base ${isActive ? 'active' : ''}`
              }
            >
              <Anchor size={16} className="sm:w-5 sm:h-5" />
              <span>Port Lookup</span>
            </NavLink>
            <NavLink 
              to="/distance" 
              className={({ isActive }) => 
                `nav-button flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-all text-sm sm:text-base ${isActive ? 'active' : ''}`
              }
            >
              <Ship size={16} className="sm:w-5 sm:h-5" />
              <span>Port Distance</span>
            </NavLink>
            <NavLink 
              to="/unified-distance" 
              className={({ isActive }) => 
                `nav-button flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${isActive ? 'active' : ''}`
              }
            >
              <MapPin size={20} />
              <span>Unified Distance</span>
            </NavLink>
            <NavLink 
              to="/bulk-distance" 
              className={({ isActive }) => 
                `nav-button flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${isActive ? 'active' : ''}`
              }
            >
              <FileSpreadsheet size={20} />
              <span>Bulk Calculator</span>
            </NavLink>
            <button
              onClick={handleStartGuide}
              className="nav-button guide flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all"
            >
              <RefreshCw size={20} />
              <span>Start Guide</span>
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="nav-button flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </nav>

          <Routes>
            <Route path="/" element={
              <>
                <Guide pageType="lookup" forceShow={showGuide && !localStorage.getItem('hasSeenGuide_lookup')} />
                <h1 className="text-3xl font-bold text-center mb-2">Global Port Lookup</h1>
                <p className="text-gray-600 text-center mb-8">
                  Enter a UN/LOCODE or port name to get detailed information about ports worldwide
                </p>

                <div className="flex flex-col items-center gap-6">
                  <SearchBar
                    value={searchValue}
                    countryCode={countryCode}
                    onChange={setSearchValue}
                    onCountryChange={setCountryCode}
                    onSubmit={(value, code) => {
                      setSearchValue(value);
                      setCountryCode(code);
                      handleSearch();
                    }}
                    isLoading={isLoading}
                    disabled={isLoading}
                    isDark={isDark}
                  />

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle size={20} />
                      <span>{error}</span>
                    </div>
                  )}

                  {isLoading ? (
                    <LoadingState message="Searching ports..." />
                  ) : portData.length > 0 ? (
                    <div className="w-full max-w-4xl grid gap-6">
                      {portData.map((port) => (
                        <PortCard key={port.locode} port={port} />
                      ))}
                    </div>
                  ) : null}
                </div>
              </>
            } />
            
            <Route path="/distance" element={
              <>
                <Guide pageType="distance" forceShow={showGuide && !localStorage.getItem('hasSeenGuide_distance')} />
                <h1 className="text-3xl font-bold text-center mb-2">Port Distance Calculator</h1>
                <p className="text-gray-600 text-center mb-8">
                  Calculate the nautical distance between any two ports
                </p>
                <DistanceCalculator onSearch={handlePortSearch} isDark={isDark} />
              </>
            } />
            
            <Route path="/unified-distance" element={
              <>
                <Guide 
                  pageType="unified" 
                  forceShow={showGuide && !localStorage.getItem('hasSeenGuide_unified')}
                  onClose={() => setShowGuide(false)}
                />
                <h1 className="text-3xl font-bold text-center mb-2">Unified Distance Calculator</h1>
                <p className="text-gray-600 text-center mb-8">
                  Calculate distances between ports and postal locations
                </p>
                <UnifiedDistanceCalculator isDark={isDark} />
              </>
            } />
            
            <Route path="/bulk-distance" element={
              <>
                <Guide 
                  pageType="bulk" 
                  forceShow={showGuide && !localStorage.getItem('hasSeenGuide_bulk')}
                  onClose={() => setShowGuide(false)}
                />
                <h1 className="text-3xl font-bold text-center mb-2">Bulk Distance Calculator</h1>
                <p className="text-gray-600 text-center mb-8">
                  Calculate multiple distances at once by uploading a CSV file
                </p>
                <BulkDistanceCalculator isDark={isDark} />
              </>
            } />
          </Routes>
          <Disclaimer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;