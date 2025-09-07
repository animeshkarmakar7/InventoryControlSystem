// routes/categories.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parentCategory');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('products');
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new category
router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    // Check if category has products
    const productCount = await Product.countDocuments({ category: req.params.id });
    
    if (productCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with existing products' 
      });
    }
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    category.isActive = false;
    await category.save();
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get category statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    await category.updateMetrics();
    
    const products = await Product.find({ category: req.params.id });
    
    const stats = {
      totalProducts: products.length,
      totalValue: category.metrics.totalValue,
      avgTurnoverRate: category.metrics.avgTurnoverRate,
      avgDaysInStock: category.metrics.avgDaysInStock,
      stockDistribution: {
        inStock: products.filter(p => p.status === 'In Stock').length,
        lowStock: products.filter(p => p.status === 'Low Stock').length,
        critical: products.filter(p => p.status === 'Critical').length,
        outOfStock: products.filter(p => p.status === 'Out of Stock').length
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;