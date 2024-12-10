import React from 'react';
import { formatLastUpdateDate } from '../utils/dateUtils';

export const Disclaimer: React.FC = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 mt-8 border border-gray-200">
      <h3 className="font-bold text-gray-800 mb-2">⚠️ Disclaimers</h3>
      <ul className="space-y-2 list-disc pl-4">
        <li>
          This tool is for informational purposes only. Distance calculations are approximations and should not be used for official navigation purposes.
        </li>
        <li>
          UN/LOCODE data is sourced from the UNECE database and may not reflect real-time updates. Last update: {formatLastUpdateDate(new Date())}
        </li>
        <li>
          Map visualization is provided by Mapbox© and is subject to their terms of service.
        </li>
        <li>
          This is an open-source project and not affiliated with any official maritime or regulatory body.
        </li>
        <li>
          While we strive for accuracy, we make no guarantees about the completeness, reliability, or accuracy of this information.
        </li>
        <li>
          By using this tool, you acknowledge that any decisions made based on the provided information are at your own risk.
        </li>
      </ul>
      <p className="mt-4 text-xs">
        © {new Date().getFullYear()} Port Tools. 
        <a href="https://github.com/sahaib/Port-Code-Utility" className="text-blue-500 hover:text-blue-600 ml-1" target="_blank" rel="noopener noreferrer">
          View Source
        </a>
      </p>
    </div>
  );
}; 