import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Anchor, Ship, AlertCircle, MapPin, RefreshCw } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { PortCard } from './components/PortCard';
import { DistanceCalculator } from './components/DistanceCalculator';
import { UnifiedDistanceCalculator } from './components/UnifiedDistanceCalculator';
import { fetchPortData } from './services/portService';
import { PortData } from './types/port';
import { isValidLocode } from './utils/portUtils';
import { Disclaimer } from './components/Disclaimer';
import { Guide } from './components/Guide';

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [portData, setPortData] = useState<PortData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

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
    setShowGuide(true);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center mb-8">
            <NavLink to="/" className="text-4xl">⚓</NavLink>
          </div>
          
          <nav className="flex justify-center gap-4 mb-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `nav-button flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${isActive ? 'active' : ''}`
              }
            >
              <Anchor size={20} />
              <span>Port Lookup</span>
            </NavLink>
            <NavLink 
              to="/distance" 
              className={({ isActive }) => 
                `nav-button flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${isActive ? 'active' : ''}`
              }
            >
              <Ship size={20} />
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
            <button
              onClick={handleStartGuide}
              className="nav-button guide flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all"
            >
              <RefreshCw size={20} />
              <span>Start Guide</span>
            </button>
          </nav>

          <Routes>
            <Route path="/" element={
              <>
                <Guide pageType="lookup" forceShow={showGuide} />
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
                    onSubmit={handleSearch}
                    isLoading={isLoading}
                  />

                  {error && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle size={20} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="w-full max-w-4xl grid gap-6">
                    {portData.map((port) => (
                      <PortCard key={port.locode} port={port} />
                    ))}
                  </div>
                </div>
              </>
            } />
            
            <Route path="/distance" element={
              <>
                <Guide pageType="distance" forceShow={showGuide} />
                <h1 className="text-3xl font-bold text-center mb-2">Port Distance Calculator</h1>
                <p className="text-gray-600 text-center mb-8">
                  Calculate the nautical distance between any two ports
                </p>
                <DistanceCalculator onSearch={handlePortSearch} />
              </>
            } />
            
            <Route path="/unified-distance" element={
              <>
                <Guide 
                  pageType="unified" 
                  forceShow={showGuide} 
                  onClose={() => setShowGuide(false)}
                />
                <h1 className="text-3xl font-bold text-center mb-2">Unified Distance Calculator</h1>
                <p className="text-gray-600 text-center mb-8">
                  Calculate distances between ports and postal locations
                </p>
                <UnifiedDistanceCalculator />
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