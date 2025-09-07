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
  
  // Modal states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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
    fetchProducts();
    fetchCategories();
    fetchDashboardStats();
    fetchIMOData();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddProduct={() => setShowAddProduct(true)} />
      
      <ErrorMessage error={error} />
      
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <LoadingSpinner />}
        
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