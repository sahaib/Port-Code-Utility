import React from 'react';

export const BulkCalculatorSkeleton: React.FC = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              {[...Array(4)].map((_, i) => (
                <th key={i} className="p-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-t dark:border-gray-700">
                {[...Array(4)].map((_, j) => (
                  <td key={j} className="p-2">
                    <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 