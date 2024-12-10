import React from 'react';
import { Anchor, MapPin, Calendar, Info, Plane, Ship, Train, Truck, Package, Globe } from 'lucide-react';
import { STATUS_CODES, FUNCTION_DESCRIPTIONS } from '../config/locodeConstants';
import { PortData } from '../types/port';
import { getCountryInfo } from '../utils/countryUtils';

interface PortCardProps {
  port: PortData;
}

export const PortCard: React.FC<PortCardProps> = ({ port }) => {
  const getFunctionIcon = (code: string) => {
    const icons: Record<string, JSX.Element> = {
      '1': <Ship size={16} className="mr-1" />,
      '2': <Train size={16} className="mr-1" />,
      '3': <Truck size={16} className="mr-1" />,
      '4': <Plane size={16} className="mr-1" />,
      '5': <Package size={16} className="mr-1" />,
      '6': <Globe size={16} className="mr-1" />,
    };
    return icons[code] || null;
  };

  const getFunctionChips = (functionCode: string) => {
    const codes = functionCode.replace(/[-]/g, '').split('');
    return codes.map((code, index) => {
      const description = FUNCTION_DESCRIPTIONS[code as keyof typeof FUNCTION_DESCRIPTIONS];
      if (!description) return null;
      return (
        <div
          key={index}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 mr-2 mb-2 border border-blue-100"
        >
          {getFunctionIcon(code)}
          {description}
        </div>
      );
    }).filter(Boolean);
  };

  const getStatusBadge = (statusCode: string) => {
    const statusColors: Record<string, string> = {
      'AA': 'bg-green-50 text-green-700 border-green-100',
      'AC': 'bg-green-50 text-green-700 border-green-100',
      'AF': 'bg-green-50 text-green-700 border-green-100',
      'AI': 'bg-blue-50 text-blue-700 border-blue-100',
      'AS': 'bg-green-50 text-green-700 border-green-100',
      'RL': 'bg-blue-50 text-blue-700 border-blue-100',
      'RN': 'bg-yellow-50 text-yellow-700 border-yellow-100',
      'RQ': 'bg-yellow-50 text-yellow-700 border-yellow-100',
      'RR': 'bg-red-50 text-red-700 border-red-100',
      'QQ': 'bg-gray-50 text-gray-700 border-gray-100',
      'XX': 'bg-red-50 text-red-700 border-red-100'
    };

    const colorClass = statusColors[statusCode] || 'bg-gray-50 text-gray-700 border-gray-100';
    const description = STATUS_CODES[statusCode as keyof typeof STATUS_CODES] || statusCode;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass} border`}>
        {description}
      </span>
    );
  };

  // Convert coordinates to readable format (1305N 08017E format to lat/long)
  const formatCoordinates = (coords: string) => {
    if (!coords || coords.trim() === '') return 'No coordinates available';
    
    const parts = coords.trim().split(' ');
    if (parts.length !== 2) return coords;

    const lat = parts[0];
    const long = parts[1];
    
    const latDeg = lat.slice(0, 2);
    const latMin = lat.slice(2, 4);
    const latDir = lat.slice(-1);
    
    const longDeg = long.slice(0, 3);
    const longMin = long.slice(3, 5);
    const longDir = long.slice(-1);
    
    return `${latDeg}°${latMin}'${latDir} ${longDeg}°${longMin}'${longDir}`;
  };

  const countryCode = port.locode.slice(0, 2);
  const { name: countryName, flag } = getCountryInfo(countryCode);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 transform hover:scale-105 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl sm:text-2xl">{flag}</span>
            <span className="text-xs sm:text-sm text-gray-600">{countryName}</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-bold text-gray-800">{port.name}</h3>
          <p className="text-base sm:text-lg font-semibold text-blue-600 mt-1">{port.locode}</p>
          {port.subdivision && (
            <p className="text-xs sm:text-sm text-gray-600">Subdivision: {port.subdivision}</p>
          )}
        </div>
        <Anchor className="text-blue-500 hidden sm:block" size={24} />
      </div>
      
      <div className="mt-4 space-y-4">
        <div className="flex items-center text-gray-600">
          <MapPin size={18} className="mr-2 flex-shrink-0" />
          <span>{formatCoordinates(port.coordinates)}</span>
        </div>
        
        <div className="flex flex-col space-y-2">
          <h4 className="text-sm font-semibold text-gray-500">Functions:</h4>
          <div className="flex flex-wrap">
            {getFunctionChips(port.function)}
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <h4 className="text-sm font-semibold text-gray-500">Status:</h4>
          {getStatusBadge(port.status)}
        </div>
        
        {port.iata && (
          <div className="flex items-center text-gray-600">
            <span className="font-semibold mr-2">IATA:</span>
            <span>{port.iata}</span>
          </div>
        )}
        
        <div className="flex items-center text-gray-600">
          <Calendar size={18} className="mr-2" />
          <span>Last updated: {port.date || 'Not available'}</span>
        </div>
        
        {port.remarks && (
          <div className="flex items-start text-gray-600">
            <Info size={18} className="mr-2 mt-1 flex-shrink-0" />
            <span>{port.remarks}</span>
          </div>
        )}
      </div>
    </div>
  );
};