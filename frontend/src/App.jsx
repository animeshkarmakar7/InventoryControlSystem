import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3, 
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Brain,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('2024-09');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample inventory data
  const [inventoryData] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      sku: 'WH-001',
      category: 'Electronics',
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      price: 99.99,
      supplier: 'Tech Corp',
      lastUpdated: '2024-09-05',
      status: 'In Stock',
      velocity: 'High',
      prediction: { nextMonth: 78, confidence: 85 }
    },
    {
      id: 2,
      name: 'Gaming Mouse',
      sku: 'GM-002',
      category: 'Electronics',
      currentStock: 12,
      minStock: 15,
      maxStock: 80,
      price: 59.99,
      supplier: 'Game Tech',
      lastUpdated: '2024-09-06',
      status: 'Low Stock',
      velocity: 'Medium',
      prediction: { nextMonth: 25, confidence: 78 }
    },
    {
      id: 3,
      name: 'Office Chair',
      sku: 'OC-003',
      category: 'Furniture',
      currentStock: 8,
      minStock: 5,
      maxStock: 30,
      price: 299.99,
      supplier: 'Office Plus',
      lastUpdated: '2024-09-04',
      status: 'Critical',
      velocity: 'Low',
      prediction: { nextMonth: 15, confidence: 92 }
    },
    {
      id: 4,
      name: 'Bluetooth Speaker',
      sku: 'BS-004',
      category: 'Electronics',
      currentStock: 67,
      minStock: 25,
      maxStock: 120,
      price: 79.99,
      supplier: 'Audio Co',
      lastUpdated: '2024-09-06',
      status: 'In Stock',
      velocity: 'High',
      prediction: { nextMonth: 45, confidence: 88 }
    },
    {
      id: 5,
      name: 'Desk Lamp',
      sku: 'DL-005',
      category: 'Furniture',
      currentStock: 23,
      minStock: 10,
      maxStock: 50,
      price: 49.99,
      supplier: 'Light Works',
      lastUpdated: '2024-09-05',
      status: 'In Stock',
      velocity: 'Medium',
      prediction: { nextMonth: 18, confidence: 73 }
    }
  ]);

  // Sample prediction data for charts
  const demandPredictionData = [
    { month: 'Jan', actual: 65, predicted: 68 },
    { month: 'Feb', actual: 59, predicted: 62 },
    { month: 'Mar', actual: 80, predicted: 78 },
    { month: 'Apr', actual: 81, predicted: 85 },
    { month: 'May', actual: 56, predicted: 58 },
    { month: 'Jun', actual: 55, predicted: 52 },
    { month: 'Jul', actual: 40, predicted: 42 },
    { month: 'Aug', actual: 65, predicted: 68 },
    { month: 'Sep', actual: null, predicted: 72 },
    { month: 'Oct', actual: null, predicted: 78 },
    { month: 'Nov', actual: null, predicted: 85 },
    { month: 'Dec', actual: null, predicted: 90 }
  ];

  const imoData = [
    { category: 'Electronics', turnoverRate: 8.2, avgDaysInStock: 45, value: 125000 },
    { category: 'Furniture', turnoverRate: 3.1, avgDaysInStock: 118, value: 85000 },
    { category: 'Office Supplies', turnoverRate: 12.5, avgDaysInStock: 29, value: 45000 }
  ];

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

  const filteredInventory = inventoryData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">AI Inventory Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'inventory', name: 'Inventory', icon: Package },
              { id: 'predictions', name: 'AI Predictions', icon: Brain },
              { id: 'imo', name: 'IMO Analysis', icon: Target }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-semibold text-gray-900">{inventoryData.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Stock</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {inventoryData.filter(item => item.status === 'In Stock').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Low Stock</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {inventoryData.filter(item => item.status === 'Low Stock').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Critical</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {inventoryData.filter(item => item.status === 'Critical').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Product Inventory</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Velocity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.category}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.currentStock} / {item.maxStock}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                item.currentStock <= item.minStock ? 'bg-red-600' :
                                item.currentStock <= item.minStock * 1.5 ? 'bg-yellow-500' : 'bg-green-600'
                              }`}
                              style={{ width: `${(item.currentStock / item.maxStock) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getVelocityIcon(item.velocity)}
                            <span className="ml-2 text-sm text-gray-900">{item.velocity}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${item.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedProduct(item)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* AI Predictions Tab */}
        {activeTab === 'predictions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Demand Prediction Analysis</h3>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedProduct?.id || ''}
                  onChange={(e) => setSelectedProduct(inventoryData.find(item => item.id === parseInt(e.target.value)))}
                >
                  <option value="">Select Product</option>
                  {inventoryData.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-4">Historical vs Predicted Demand</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={demandPredictionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2} name="Actual" />
                      <Line type="monotone" dataKey="predicted" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-800">AI Predictions Summary</h4>
                  {inventoryData.slice(0, 3).map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-900">{item.name}</h5>
                          <p className="text-sm text-gray-600">Current Stock: {item.currentStock}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-blue-600">
                            {item.prediction.nextMonth}
                          </p>
                          <p className="text-xs text-gray-500">Predicted Next Month</p>
                          <p className="text-xs text-green-600">{item.prediction.confidence}% Confidence</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Prediction Accuracy</span>
                          <span>{item.prediction.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${item.prediction.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* IMO Analysis Tab */}
        {activeTab === 'imo' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Inventory Movement Optimization</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="2024-09">September 2024</option>
                    <option value="2024-08">August 2024</option>
                    <option value="2024-07">July 2024</option>
                    <option value="2024-06">June 2024</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {imoData.map((category, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
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
                      <span className="text-sm font-medium">${category.value.toLocaleString()}</span>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Optimization Score</span>
                        <span>{Math.round(category.turnoverRate * 10)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            category.turnoverRate > 8 ? 'bg-green-500' :
                            category.turnoverRate > 5 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(category.turnoverRate * 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="text-md font-medium text-gray-900 mb-4">Monthly Performance Comparison</h4>
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

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="text-md font-medium text-gray-900 mb-4">AI Recommendations</h4>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h5 className="font-medium text-gray-900">Electronics Category</h5>
                  <p className="text-sm text-gray-600">High turnover rate detected. Consider increasing stock levels by 15% to meet demand.</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h5 className="font-medium text-gray-900">Furniture Category</h5>
                  <p className="text-sm text-gray-600">Low turnover rate. Implement promotional strategies or reduce order quantities.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h5 className="font-medium text-gray-900">Office Supplies</h5>
                  <p className="text-sm text-gray-600">Optimal performance. Maintain current inventory levels and ordering patterns.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;