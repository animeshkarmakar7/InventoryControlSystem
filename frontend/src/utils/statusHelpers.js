// src/utils/statusHelpers.js
export const getStatusColor = (status) => {
  switch (status) {
    case 'In Stock': return 'bg-green-100 text-green-800';
    case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
    case 'Critical': return 'bg-red-100 text-red-800';
    case 'Out of Stock': return 'bg-gray-100 text-gray-800';
    default: return 'bg-blue-100 text-blue-800';
  }
};

export const calculateStockStatus = (currentStock, thresholds) => {
  if (!thresholds) return 'Unknown';
  
  if (currentStock <= 0) return 'Out of Stock';
  if (currentStock <= thresholds.criticalLevel) return 'Critical';
  if (currentStock <= thresholds.min) return 'Low Stock';
  return 'In Stock';
};

export const calculateStockPercentage = (currentStock, maxStock) => {
  if (!maxStock || maxStock === 0) return 0;
  return Math.min((currentStock / maxStock) * 100, 100);
};

