// src/components/modals/ProductDetails.jsx
import React from 'react';
import { X, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

const ProductDetails = ({ product, onClose }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Out of Stock': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getVelocityIcon = (velocity) => {
    switch (velocity) {
      case 'High': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'Medium': return <BarChart3 className="h-4 w-4 text-yellow-600" />;
      case 'Low': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Header Section */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-600 mt-1">SKU: {product.sku || product.barcode || 'N/A'}</p>
                <p className="text-sm text-gray-600">Category: {product.category?.name || 'No Category'}</p>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
            </div>
          </div>
          
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">Stock Information</h5>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Stock:</span>
                    <span className="text-sm font-semibold text-gray-900">{product.currentStock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Min Level:</span>
                    <span className="text-sm text-gray-900">{product.thresholds?.min || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Max Level:</span>
                    <span className="text-sm text-gray-900">{product.thresholds?.max || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Reorder Point:</span>
                    <span className="text-sm text-gray-900">{product.thresholds?.reorderPoint || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Critical Level:</span>
                    <span className="text-sm text-gray-900">{product.thresholds?.criticalLevel || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">Performance</h5>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Velocity:</span>
                    <div className="flex items-center">
                      {getVelocityIcon(product.velocity)}
                      <span className="ml-2 text-sm font-medium text-gray-900">{product.velocity || 'Medium'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">Pricing Information</h5>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cost Price:</span>
                    <span className="text-sm font-semibold text-gray-900">${product.price?.cost || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Selling Price:</span>
                    <span className="text-sm font-semibold text-blue-600">${product.price?.selling || 'N/A'}</span>
                  </div>
                  {product.price?.cost && product.price?.selling && (
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm text-gray-600">Profit Margin:</span>
                      <span className="text-sm font-semibold text-green-600">
                        {Math.round(((product.price.selling - product.price.cost) / product.price.selling) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">Supplier Information</h5>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Supplier:</span>
                    <span className="text-sm text-gray-900">{product.supplier?.name || 'N/A'}</span>
                  </div>
                  {product.supplier?.contact?.email && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm text-gray-900">{product.supplier.contact.email}</span>
                    </div>
                  )}
                  {product.supplier?.contact?.phone && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Phone:</span>
                      <span className="text-sm text-gray-900">{product.supplier.contact.phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lead Time:</span>
                    <span className="text-sm text-gray-900">{product.supplier?.leadTime || 'N/A'} days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Location Information */}
          {(product.location?.warehouse || product.location?.shelf || product.location?.bin) && (
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">Location</h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Warehouse</p>
                    <p className="text-sm font-medium text-gray-900">{product.location.warehouse || 'N/A'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Shelf</p>
                    <p className="text-sm font-medium text-gray-900">{product.location.shelf || 'N/A'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Bin</p>
                    <p className="text-sm font-medium text-gray-900">{product.location.bin || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Description */}
          {product.description && (
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">Description</h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{product.description}</p>
              </div>
            </div>
          )}
          
          {/* Stock Level Visualization */}
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Stock Level Visualization</h5>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Stock Progress</span>
                <span>{Math.round((product.currentStock / (product.thresholds?.max || 100)) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    product.currentStock <= (product.thresholds?.criticalLevel || 0) ? 'bg-red-600' :
                    product.currentStock <= (product.thresholds?.min || 0) ? 'bg-yellow-500' : 'bg-green-600'
                  }`}
                  style={{ width: `${Math.min((product.currentStock / (product.thresholds?.max || 100)) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Critical: {product.thresholds?.criticalLevel || 0}</span>
                <span>Min: {product.thresholds?.min || 0}</span>
                <span>Max: {product.thresholds?.max || 100}</span>
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;