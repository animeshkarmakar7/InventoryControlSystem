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
  Target,
  Edit,
  Trash2,
  X,
  Save
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// API base URL - adjust this to match your backend
const API_BASE_URL = 'http://localhost:5000/api';

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('2024-09');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dynamic state for backend data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [imoData, setImoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form state for adding/editing products
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    description: '',
    currentStock: 0,
    thresholds: {
      min: 10,
      max: 100,
      reorderPoint: 20,
      criticalLevel: 5
    },
    price: {
      cost: 0,
      selling: 0
    },
    supplier: {
      name: '',
      contact: {
        email: '',
        phone: ''
      },
      leadTime: 7
    },
    barcode: '',
    location: {
      warehouse: '',
      shelf: '',
      bin: ''
    }
  });

  // API functions
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || data);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/dashboard`);
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchIMOData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/imo-analysis`);
      if (response.ok) {
        const data = await response.json();
        setImoData(data);
      }
    } catch (error) {
      console.error('Error fetching IMO data:', error);
    }
  };

  const addProduct = async (productData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (response.ok) {
        await fetchProducts();
        await fetchDashboardStats();
        setShowAddProduct(false);
        resetProductForm();
        setError('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (response.ok) {
        await fetchProducts();
        await fetchDashboardStats();
        setShowEditProduct(false);
        setEditingProduct(null);
        resetProductForm();
        setError('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchProducts();
        await fetchDashboardStats();
        setError('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      category: '',
      description: '',
      currentStock: 0,
      thresholds: {
        min: 10,
        max: 100,
        reorderPoint: 20,
        criticalLevel: 5
      },
      price: {
        cost: 0,
        selling: 0
      },
      supplier: {
        name: '',
        contact: {
          email: '',
          phone: ''
        },
        leadTime: 7
      },
      barcode: '',
      location: {
        warehouse: '',
        shelf: '',
        bin: ''
      }
    });
  };

  // Load data on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchDashboardStats();
    fetchIMOData();
  }, []);

  // Helper functions
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

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      category: product.category?._id || product.category || '',
      description: product.description || '',
      currentStock: product.currentStock || 0,
      thresholds: {
        min: product.thresholds?.min || 10,
        max: product.thresholds?.max || 100,
        reorderPoint: product.thresholds?.reorderPoint || 20,
        criticalLevel: product.thresholds?.criticalLevel || 5
      },
      price: {
        cost: product.price?.cost || 0,
        selling: product.price?.selling || 0
      },
      supplier: {
        name: product.supplier?.name || '',
        contact: {
          email: product.supplier?.contact?.email || '',
          phone: product.supplier?.contact?.phone || ''
        },
        leadTime: product.supplier?.leadTime || 7
      },
      barcode: product.barcode || '',
      location: {
        warehouse: product.location?.warehouse || '',
        shelf: product.location?.shelf || '',
        bin: product.location?.bin || ''
      }
    });
    setShowEditProduct(true);
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Product Form Component
  const ProductForm = ({ isEdit = false, onSubmit, onClose }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(productForm);
        }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name *</label>
              <input
                type="text"
                required
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Category *</label>
              <select
                required
                value={productForm.category}
                onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Stock *</label>
              <input
                type="number"
                min="0"
                required
                value={productForm.currentStock}
                onChange={(e) => setProductForm({...productForm, currentStock: parseInt(e.target.value) || 0})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Supplier Name *</label>
              <input
                type="text"
                required
                value={productForm.supplier.name}
                onChange={(e) => setProductForm({
                  ...productForm, 
                  supplier: {...productForm.supplier, name: e.target.value}
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Cost Price *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={productForm.price.cost}
                onChange={(e) => setProductForm({
                  ...productForm, 
                  price: {...productForm.price, cost: parseFloat(e.target.value) || 0}
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Selling Price *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={productForm.price.selling}
                onChange={(e) => setProductForm({
                  ...productForm, 
                  price: {...productForm.price, selling: parseFloat(e.target.value) || 0}
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Stock Level</label>
              <input
                type="number"
                min="0"
                value={productForm.thresholds.min}
                onChange={(e) => setProductForm({
                  ...productForm, 
                  thresholds: {...productForm.thresholds, min: parseInt(e.target.value) || 0}
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Stock Level</label>
              <input
                type="number"
                min="0"
                value={productForm.thresholds.max}
                onChange={(e) => setProductForm({
                  ...productForm, 
                  thresholds: {...productForm.thresholds, max: parseInt(e.target.value) || 0}
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows="3"
              value={productForm.description}
              onChange={(e) => setProductForm({...productForm, description: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
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
              <button 
                onClick={() => setShowAddProduct(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

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
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardStats.totalProducts || products.length}
                    </p>
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
                      {dashboardStats.inStock || products.filter(p => p.status === 'In Stock').length}
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
                      {dashboardStats.lowStock || products.filter(p => p.status === 'Low Stock').length}
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
                      {dashboardStats.critical || products.filter(p => p.status === 'Critical').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-4">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading products...</span>
                </div>
              </div>
            )}

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
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">
                              {product.category?.name || 'No Category'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {product.currentStock} / {product.thresholds?.max || 'N/A'}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                product.currentStock <= (product.thresholds?.criticalLevel || 0) ? 'bg-red-600' :
                                product.currentStock <= (product.thresholds?.min || 0) ? 'bg-yellow-500' : 'bg-green-600'
                              }`}
                              style={{ 
                                width: `${Math.min((product.currentStock / (product.thresholds?.max || 100)) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getVelocityIcon(product.velocity)}
                            <span className="ml-2 text-sm text-gray-900">{product.velocity}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${product.price?.selling || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(product._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p>No products found. {searchTerm ? 'Try adjusting your search.' : 'Add your first product to get started.'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI Predictions Tab */}
        {activeTab === 'predictions' && (
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
                  <div key={product._id} className="border border-gray-200 rounded-lg p-4">
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
                          className={`h-2 rounded-full ${
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

            {imoData.length > 0 ? (
              <>
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
                          <span className="text-sm font-medium">${category.value?.toLocaleString() || 'N/A'}</span>
                        </div>
                        <div className="pt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Optimization Score</span>
                            <span>{category.optimizationScore || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
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
                      <div className="border-l-4 border-red-500 pl-4">
                        <h5 className="font-medium text-gray-900">Urgent Action Required</h5>
                        <p className="text-sm text-gray-600">
                          {products.filter(p => p.status === 'Critical' || p.status === 'Low Stock').length} products need immediate restocking.
                        </p>
                      </div>
                    )}
                    {products.filter(p => p.velocity === 'High').length > 0 && (
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h5 className="font-medium text-gray-900">High Velocity Items</h5>
                        <p className="text-sm text-gray-600">
                          Monitor {products.filter(p => p.velocity === 'High').length} high-velocity products for potential stock increases.
                        </p>
                      </div>
                    )}
                    <div className="border-l-4 border-green-500 pl-4">
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
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <ProductForm
          onSubmit={addProduct}
          onClose={() => {
            setShowAddProduct(false);
            resetProductForm();
          }}
        />
      )}

      {/* Edit Product Modal */}
      {showEditProduct && editingProduct && (
        <ProductForm
          isEdit={true}
          onSubmit={(formData) => updateProduct(editingProduct._id, formData)}
          onClose={() => {
            setShowEditProduct(false);
            setEditingProduct(null);
            resetProductForm();
          }}
        />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                  <p className="text-sm text-gray-600">SKU: {selectedProduct.sku}</p>
                  <p className="text-sm text-gray-600">Category: {selectedProduct.category?.name || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedProduct.status)}`}>
                    {selectedProduct.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Current Stock</p>
                  <p className="text-lg font-semibold">{selectedProduct.currentStock}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Selling Price</p>
                  <p className="text-lg font-semibold">${selectedProduct.price?.selling || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Supplier</p>
                  <p className="text-sm">{selectedProduct.supplier?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Velocity</p>
                  <div className="flex items-center">
                    {getVelocityIcon(selectedProduct.velocity)}
                    <span className="ml-2 text-sm">{selectedProduct.velocity}</span>
                  </div>
                </div>
              </div>
              
              {selectedProduct.description && (
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-sm">{selectedProduct.description}</p>
                </div>
              )}
              
              <div className="pt-4">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;