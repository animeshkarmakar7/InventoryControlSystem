// src/components/tabs/PredictionsTab.jsx
import React from 'react';
import { Brain, Package } from 'lucide-react';

const PredictionsTab = ({ products }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-4">AI Predictions Coming Soon</h4>
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">AI demand prediction features will be available once you have sufficient transaction data.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">Current Product Metrics</h4>
          {products.slice(0, 3).map((product) => (
            <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-gray-900">{product.name}</h5>
                  <p className="text-sm text-gray-600">Current Stock: {product.currentStock}</p>
                  <p className="text-sm text-gray-600">Velocity: {product.velocity || 'Medium'}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-600">
                    ${product.price?.selling || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">Selling Price</p>
                  <p className="text-xs text-green-600">Status: {product.status}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Stock Level</span>
                  <span>{Math.round((product.currentStock / (product.thresholds?.max || 100)) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      product.currentStock <= (product.thresholds?.criticalLevel || 0) ? 'bg-red-600' :
                      product.currentStock <= (product.thresholds?.min || 0) ? 'bg-yellow-500' : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min((product.currentStock / (product.thresholds?.max || 100)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p>Add products to see prediction analytics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default  PredictionsTab ;