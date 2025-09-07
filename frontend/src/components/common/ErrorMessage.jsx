// src/components/common/ErrorMessage.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
        <span>{error}</span>
      </div>
    </div>
  );
};


export default ErrorMessage ;