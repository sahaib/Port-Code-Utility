import React from 'react';
import { Loader2 } from 'lucide-react';
import { PortCardSkeleton } from './Skeleton';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}; 

export const LoadingPortCards: React.FC = () => (
  <div className="w-full max-w-4xl grid gap-6">
    {[1, 2, 3].map((i) => (
      <PortCardSkeleton key={i} />
    ))}
  </div>
);