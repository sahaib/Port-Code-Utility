import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { ProcessingStats } from '../types/bulk';

interface StatsDisplayProps {
  stats: ProcessingStats;
  isDark: boolean;
}

export const ProcessingStatsDisplay: React.FC<StatsDisplayProps> = ({ stats, isDark }) => {
  const { total, processed, successful, failed } = stats;
  
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl mx-auto p-4 rounded-lg ${
      isDark ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <StatCard
        label="Total Records"
        value={total}
        icon={<AlertCircle size={20} />}
        isDark={isDark}
      />
      <StatCard
        label="Processed"
        value={processed}
        percentage={(processed / total) * 100}
        icon={<RefreshCw size={20} />}
        isDark={isDark}
      />
      <StatCard
        label="Successful"
        value={successful}
        percentage={(successful / total) * 100}
        icon={<CheckCircle2 size={20} className="text-green-500" />}
        isDark={isDark}
      />
      <StatCard
        label="Failed"
        value={failed}
        percentage={(failed / total) * 100}
        icon={<XCircle size={20} className="text-red-500" />}
        isDark={isDark}
      />
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  percentage?: number;
  icon: React.ReactNode;
  isDark: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, percentage, icon, isDark }) => {
  return (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {label}
        </span>
      </div>
      <div className="flex flex-col">
        <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </span>
        {percentage !== undefined && (
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {percentage.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}; 