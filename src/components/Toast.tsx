import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const bgColor = {
    success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
  }[type];

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: AlertCircle
  }[type];

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg border ${bgColor} shadow-lg flex items-center gap-2 max-w-md animate-slide-up`}>
      <Icon className="w-5 h-5" />
      <p className="flex-1">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-black/5 rounded">
        <XCircle className="w-5 h-5" />
      </button>
    </div>
  );
}; 