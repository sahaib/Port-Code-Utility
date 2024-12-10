import React, { useState, useRef } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { parseCSV, validateCSVData } from '../utils/csvUtils.ts';
import { calculateBulkDistances } from '../services/distanceService.ts';
import { trackEvent } from '../utils/analytics.ts';
import { ProcessingStatsDisplay } from './ProcessingStats.tsx';
import { BulkCalculationResult, BulkCalculationRow, ProcessingStats } from '../types/bulk';
import { CSVRow } from '../utils/csvUtils';

interface BulkCalculatorProps {
  isDark: boolean;
}

export const BulkDistanceCalculator: React.FC<BulkCalculatorProps> = ({ isDark }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BulkCalculationResult[] | null>(null);
  const [stats, setStats] = useState<ProcessingStats>({
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0
  });
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const transformToCalculationRows = (csvData: CSVRow[]): BulkCalculationRow[] => {
    return csvData.map(row => ({
      sourceType: row.type.startsWith('port-') ? 'port' : 'postal',
      sourceLocation: row.origin,
      destType: row.type.endsWith('-port') ? 'port' : 'postal',
      destLocation: row.destination
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setResults(null);
    setProgress(0);
    
    try {
      const csvData = await parseCSV(file);
      const validationErrors = validateCSVData(csvData);

      if (validationErrors.length > 0) {
        setError(`Validation errors found:\n${validationErrors.join('\n')}`);
        return;
      }

      setStats({
        total: csvData.length,
        processed: 0,
        successful: 0,
        failed: 0
      });

      const calculationRows = transformToCalculationRows(csvData);
      const results = await calculateBulkDistances(calculationRows, (progress, currentStats) => {
        setProgress(Math.round(progress * 100));
        setStats(currentStats);
      });

      setResults(results);
      trackEvent({ 
        type: 'bulk_calculate_distance', 
        data: { 
          recordCount: csvData.length,
          successCount: results.filter(r => r.status === 'success').length
        } 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      trackEvent({ type: 'error', data: { context: 'bulk_calculate_distance', error: err } });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = 'origin,originCountry,destination,destinationCountry,type\nUSNYC,US,GBLON,GB,port-to-port\nUSNYC,US,10001,US,port-to-door\n90210,US,GBLON,GB,door-to-port\n10001,US,90210,US,door-to-door';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'distance_calculator_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadResults = () => {
    if (!results) return;
    
    const headers = 'sourceType,sourceLocation,destType,destLocation,distance_nm,distance_km,status,comments\n';
    
    const csv = headers + results.map(r => {
      const distanceNM = r.distance ? Math.round(r.distance) : 'NaN';
      const distanceKM = r.distance ? Math.round(r.distance * 1.852) : 'NaN';
      const status = r.status === 'success' && r.distance !== null ? 'success' : 'failed';
      const comments = r.error || (r.status === 'success' ? '' : 'Could not calculate distance');
      return `${r.sourceType},${r.sourceLocation},${r.destType},${r.destLocation},${distanceNM},${distanceKM},${status},"${comments}"`;
    }).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'distance_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Bulk Distance Calculator</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Upload a CSV file with multiple locations to calculate distances in bulk
            </p>
          </div>

          <div className="w-full max-w-md">
            <div className="flex justify-between mb-4">
              <button
                onClick={downloadTemplate}
                className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} flex items-center gap-2`}
              >
                <Download size={20} />
                Download Template
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex flex-col items-center gap-2 w-full"
              >
                <Upload size={24} className="text-gray-400" />
                <span className="text-gray-600">
                  {isProcessing ? 'Processing...' : 'Click to upload CSV file'}
                </span>
              </button>
            </div>
          </div>

          {isProcessing && (
            <>
              <div className="w-full max-w-md">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Processing... {progress}%
                </p>
              </div>
              <ProcessingStatsDisplay stats={stats} isDark={isDark} />
            </>
          )}

          {error && (
            <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                <pre className="text-red-600 text-sm whitespace-pre-wrap">{error}</pre>
              </div>
            </div>
          )}

          {results && (
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Results</h3>
                <button
                  onClick={downloadResults}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                >
                  <Download size={20} />
                  Download Results
                </button>
              </div>
              
              <ProcessingStatsDisplay stats={stats} isDark={isDark} />
              
              <div className="mt-6 overflow-x-auto">
                <table className={`w-full text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  <thead>
                    <tr className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                      <th className="p-2 text-left">Source</th>
                      <th className="p-2 text-left">Destination</th>
                      <th className="p-2 text-left">Distance</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className="p-2">{result.sourceLocation}</td>
                        <td className="p-2">{result.destLocation}</td>
                        <td className="p-2">
                          {result.status === 'success' && result.distance !== null 
                            ? `${Math.round(result.distance)} nm / ${Math.round(result.distance * 1.852)} km` 
                            : '-'}
                        </td>
                        <td className="p-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            result.status === 'success' && result.distance !== null
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {result.status === 'success' && result.distance !== null ? 'success' : 'failed'}
                          </span>
                        </td>
                        <td className="p-2 text-sm text-gray-600">
                          {result.error || (result.status === 'success' ? '' : 'Could not calculate distance')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 