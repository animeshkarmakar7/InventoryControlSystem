// src/components/tabs/InventoryTab.jsx
import React from 'react';
import SearchFilter from '../common/SearchFilter';
import StatsCards from '../inventory/StatsCards';
import ProductTable from '../inventory/productTable';

const InventoryTab = ({
  products,
  dashboardStats,
  searchTerm,
  setSearchTerm,
  onEditProduct,
  onDeleteProduct,
  onViewProduct,
  loading
}) => {
  return (
    <div className="space-y-6">
      <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <StatsCards stats={dashboardStats} products={products} />
      
      <ProductTable
        products={products}
        onEdit={onEditProduct}
        onDelete={onDeleteProduct}
        onView={onViewProduct}
        loading={loading}
      />
    </div>
  );
};

export default InventoryTab;