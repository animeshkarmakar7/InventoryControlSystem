// src/components/Layout/Header.jsx
import React from 'react';
import { Package, Plus } from 'lucide-react';

const Header = ({ onAddProduct }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">AI Inventory Manager</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onAddProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;