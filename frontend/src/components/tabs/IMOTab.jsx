// src/components/tabs/IMOTab.jsx
import React from 'react';
import { Calendar, Target } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const IMOTab = ({ imoData, products, selectedMonth, setSelectedMonth }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Inventory Movement Optimization</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="2024-09">September 2024</option>
              <option value="2024-08">August 2024</option>
              <option value="2024-07">July 2024</option>
              <option value="2024-06">June 2024</option>
            </select>
          </div>
        </div>
      </div>

      {imoData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {imoData.map((category, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-md font-medium text-gray-900 mb-4">{category.category}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Turnover Rate</span>
                    <span className="text-sm font-medium">{category.turnoverRate}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Days in Stock</span>
                    <span className="text-sm font-medium">{category.avgDaysInStock} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Value</span>
                    <span className="text-sm font-medium">${category.value?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Optimization Score</span>
                      <span>{category.optimizationScore || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          (category.optimizationScore || 0) > 80 ? 'bg-green-500' :
                          (category.optimizationScore || 0) > 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(category.optimizationScore || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="text-md font-medium text-gray-900 mb-4">Category Performance</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={imoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="turnoverRate" fill="#3B82F6" name="Turnover Rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No IMO Data Available</h4>
            <p className="text-gray-600">IMO analysis will be available once you have products and transaction data.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h4 className="text-md font-medium text-gray-900 mb-4">AI Recommendations</h4>
        <div className="space-y-4">
          {products.length > 0 ? (
            <>
              {products.filter(p => p.status === 'Critical' || p.status === 'Low Stock').length > 0 && (
                <div className="border-l-4 border-red-500 pl-4 bg-red-50 py-2 rounded-r">
                  <h5 className="font-medium text-gray-900">Urgent Action Required</h5>
                  <p className="text-sm text-gray-600">
                    {products.filter(p => p.status === 'Critical' || p.status === 'Low Stock').length} products need immediate restocking.
                  </p>
                </div>
              )}
              {products.filter(p => p.velocity === 'High').length > 0 && (
                <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 py-2 rounded-r">
                  <h5 className="font-medium text-gray-900">High Velocity Items</h5>
                  <p className="text-sm text-gray-600">
                    Monitor {products.filter(p => p.velocity === 'High').length} high-velocity products for potential stock increases.
                  </p>
                </div>
              )}
              <div className="border-l-4 border-green-500 pl-4 bg-green-50 py-2 rounded-r">
                <h5 className="font-medium text-gray-900">Overall Status</h5>
                <p className="text-sm text-gray-600">
                  You have {products.length} products in your inventory. Keep monitoring stock levels for optimal performance.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Add products to see personalized recommendations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IMOTab ;