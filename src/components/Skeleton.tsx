import React from 'react';

export const PortCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="w-full">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-6 w-1/4 bg-blue-200 dark:bg-blue-700 rounded"></div>
      </div>
    </div>
  </div>
); 