// src/components/modals/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ProductForm = ({ 
  isEdit = false, 
  product = null, 
  categories = [], 
  onSubmit, 
  onClose, 
  loading 
}) => {
  const [formData, setFormData] = useState({
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

  // Default categories if none provided
  const defaultCategories = [
    { _id: '1', name: 'Electronics' },
    { _id: '2', name: 'Clothing' },
    { _id: '3', name: 'Home & Garden' },
    { _id: '4', name: 'Sports & Outdoors' },
    { _id: '5', name: 'Books & Media' },
    { _id: '6', name: 'Food & Beverages' },
    { _id: '7', name: 'Health & Beauty' },
    { _id: '8', name: 'Automotive' },
    { _id: '9', name: 'Office Supplies' },
    { _id: '10', name: 'Toys & Games' }
  ];

  const availableCategories = categories.length > 0 ? categories : defaultCategories;

  useEffect(() => {
    if (isEdit && product) {
      setFormData({
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
    }
  }, [isEdit, product]);

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setFormData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNestedChange = (parent, child, value, grandParent = null) => {
    if (grandParent) {
      setFormData(prev => ({
        ...prev,
        [grandParent]: {
          ...prev[grandParent],
          [parent]: {
            ...prev[grandParent][parent],
            [child]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {availableCategories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.currentStock}
                  onChange={(e) => handleInputChange('currentStock', parseInt(e.target.value) || 0)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Barcode/SKU
                </label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange('barcode', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter barcode or SKU"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter product description..."
              />
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Pricing Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Price *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.price.cost}
                  onChange={(e) => handleNestedChange('price', 'cost', parseFloat(e.target.value) || 0)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.price.selling}
                  onChange={(e) => handleNestedChange('price', 'selling', parseFloat(e.target.value) || 0)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Stock Thresholds */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Stock Thresholds</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Level
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.thresholds.min}
                  onChange={(e) => handleNestedChange('thresholds', 'min', parseInt(e.target.value) || 0)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Level
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.thresholds.max}
                  onChange={(e) => handleNestedChange('thresholds', 'max', parseInt(e.target.value) || 0)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reorder Point
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.thresholds.reorderPoint}
                  onChange={(e) => handleNestedChange('thresholds', 'reorderPoint', parseInt(e.target.value) || 0)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Critical Level
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.thresholds.criticalLevel}
                  onChange={(e) => handleNestedChange('thresholds', 'criticalLevel', parseInt(e.target.value) || 0)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          {/* Supplier Information */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Supplier Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.supplier.name}
                  onChange={(e) => handleNestedChange('supplier', 'name', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter supplier name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lead Time (days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.supplier.leadTime}
                  onChange={(e) => handleNestedChange('supplier', 'leadTime', parseInt(e.target.value) || 0)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="7"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Email
                </label>
                <input
                  type="email"
                  value={formData.supplier.contact.email}
                  onChange={(e) => handleNestedChange('contact', 'email', e.target.value, 'supplier')}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="supplier@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Phone
                </label>
                <input
                  type="tel"
                  value={formData.supplier.contact.phone}
                  onChange={(e) => handleNestedChange('contact', 'phone', e.target.value, 'supplier')}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Location Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warehouse
                </label>
                <input
                  type="text"
                  value={formData.location.warehouse}
                  onChange={(e) => handleNestedChange('location', 'warehouse', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Main Warehouse"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shelf
                </label>
                <input
                  type="text"
                  value={formData.location.shelf}
                  onChange={(e) => handleNestedChange('location', 'shelf', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="A1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bin
                </label>
                <input
                  type="text"
                  value={formData.location.bin}
                  onChange={(e) => handleNestedChange('location', 'bin', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="001"
                />
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;