// src/components/common/LoadingSpinner.jsx
import React from 'react';
const LoadingSpinner = () => {
  return (
    <div className="text-center py-4">
      <div className="inline-flex items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner ;