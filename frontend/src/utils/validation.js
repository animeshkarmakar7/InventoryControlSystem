// src/utils/validation.js
export const validateProduct = (productData) => {
  const errors = {};

  if (!productData.name || productData.name.trim() === '') {
    errors.name = 'Product name is required';
  }

  if (!productData.category || productData.category === '') {
    errors.category = 'Category is required';
  }

  if (productData.currentStock < 0) {
    errors.currentStock = 'Current stock cannot be negative';
  }

  if (productData.price.cost < 0) {
    errors.costPrice = 'Cost price cannot be negative';
  }

  if (productData.price.selling < 0) {
    errors.sellingPrice = 'Selling price cannot be negative';
  }

  if (productData.price.selling < productData.price.cost) {
    errors.profitMargin = 'Selling price should be higher than cost price';
  }

  if (!productData.supplier.name || productData.supplier.name.trim() === '') {
    errors.supplierName = 'Supplier name is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};