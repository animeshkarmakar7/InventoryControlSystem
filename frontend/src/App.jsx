// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import ErrorMessage from './components/common/ErrorMessage';
import LoadingSpinner from './components/common/LoadingSpinner';
import InventoryTab from './components/tabs/InventoryTab';
import PredictionsTab from './components/tabs/PredictionsTab';
import IMOTab from './components/tabs/IMOTab';
import ProductForm from './components/modals/ProductForm';
import ProductDetails from './components/modals/ProductDetails';
import apiService from './services/api';

const App = () => {
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
  const [initializing, setInitializing] = useState(false);
  
  // Modal states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Default categories to create if none exist
  const defaultCategories = [
    { name: 'Electronics', code: 'ELC', description: 'Electronic devices and accessories' },
    { name: 'Clothing', code: 'CLT', description: 'Clothing and apparel items' },
    { name: 'Home & Garden', code: 'H&G', description: 'Home and garden products' },
    { name: 'Sports', code: 'SPT', description: 'Sports and outdoor equipment' },
    { name: 'Books', code: 'BOK', description: 'Books and media items' },
    { name: 'Food', code: 'FOD', description: 'Food and beverage products' },
    { name: 'Health', code: 'HTH', description: 'Health and beauty products' },
    { name: 'Automotive', code: 'AUT', description: 'Automotive parts and accessories' },
    { name: 'Office', code: 'OFF', description: 'Office supplies and equipment' },
    { name: 'Toys', code: 'TOY', description: 'Toys and games' }
  ];

  // Initialize categories if none exist
  const initializeCategories = async () => {
    try {
      setInitializing(true);
      const existingCategories = await apiService.getCategories();
      
      if (existingCategories.length === 0) {
        console.log('No categories found, creating default categories...');
        
        const createdCategories = [];
        for (const category of defaultCategories) {
          try {
            const createdCategory = await apiService.createCategory(category);
            createdCategories.push(createdCategory);
            console.log(`Created category: ${category.name}`);
          } catch (error) {
            console.error(`Failed to create category ${category.name}:`, error);
          }
        }
        
        setCategories(createdCategories);
        console.log(`Successfully created ${createdCategories.length} categories`);
      } else {
        setCategories(existingCategories);
        console.log(`Loaded ${existingCategories.length} existing categories`);
      }
    } catch (error) {
      console.error('Error initializing categories:', error);
      setError('Failed to initialize categories');
    } finally {
      setInitializing(false);
    }
  };

  // API functions
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProducts();
      setProducts(data.products || data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const data = await apiService.getDashboardStats();
      setDashboardStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchIMOData = async () => {
    try {
      const data = await apiService.getIMOAnalysis();
      setImoData(data);
    } catch (error) {
      console.error('Error fetching IMO data:', error);
    }
  };

  const addProduct = async (productData) => {
    try {
      setLoading(true);
      await apiService.createProduct(productData);
      await fetchProducts();
      await fetchDashboardStats();
      setShowAddProduct(false);
      setError('');
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
      await apiService.updateProduct(productId, productData);
      await fetchProducts();
      await fetchDashboardStats();
      setShowEditProduct(false);
      setEditingProduct(null);
      setError('');
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
      await apiService.deleteProduct(productId);
      await fetchProducts();
      await fetchDashboardStats();
      setError('');
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditProduct(true);
  };

  // Load data on component mount
  useEffect(() => {
    const initializeApp = async () => {
      // First initialize categories
      await initializeCategories();
      
      // Then load other data
      await Promise.all([
        fetchProducts(),
        fetchDashboardStats(),
        fetchIMOData()
      ]);
    };

    initializeApp();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show initialization message
  if (initializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Initializing Application</h2>
          <p className="text-gray-600">Setting up categories and loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddProduct={() => setShowAddProduct(true)} />
      
      <ErrorMessage error={error} />
      
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <LoadingSpinner />}
        
        {/* Show categories status */}
        {categories.length === 0 && !initializing && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Categories Not Available</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>No product categories were found. You can still add products, but categories help organize your inventory better.</p>
                  <button
                    onClick={initializeCategories}
                    className="mt-2 bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700"
                  >
                    Create Default Categories
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'inventory' && (
          <InventoryTab
            products={filteredProducts}
            dashboardStats={dashboardStats}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onEditProduct={handleEditProduct}
            onDeleteProduct={deleteProduct}
            onViewProduct={setSelectedProduct}
            loading={loading}
          />
        )}

        {activeTab === 'predictions' && (
          <PredictionsTab products={products} />
        )}

        {activeTab === 'imo' && (
          <IMOTab
            imoData={imoData}
            products={products}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        )}
      </div>

      {/* Modals */}
      {showAddProduct && (
        <ProductForm
          categories={categories}
          onSubmit={addProduct}
          onClose={() => setShowAddProduct(false)}
          loading={loading}
        />
      )}

      {showEditProduct && editingProduct && (
        <ProductForm
          isEdit={true}
          product={editingProduct}
          categories={categories}
          onSubmit={(formData) => updateProduct(editingProduct._id, formData)}
          onClose={() => {
            setShowEditProduct(false);
            setEditingProduct(null);
          }}
          loading={loading}
        />
      )}

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default App;