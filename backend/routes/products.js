// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const InventoryTransaction = require('../models/InventoryTransaction');

// Get all products with filtering and search
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      category, 
      status, 
      velocity,
      minStock,
      maxStock,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { 'supplier.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) query.category = category;
    if (velocity) query.velocity = velocity;
    if (minStock) query.currentStock = { $gte: parseInt(minStock) };
    if (maxStock) query.currentStock = { ...query.currentStock, $lte: parseInt(maxStock) };

    // Execute query with pagination
    const products = await Product.find(query)
      .populate('category')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const count = await Product.countDocuments(query);

    // Filter by status if needed (virtual field)
    let filteredProducts = products;
    if (status) {
      filteredProducts = products.filter(p => p.status === status);
    }

    res.json({
      products: filteredProducts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const productData = req.body;
    
    // Validate category exists
    const category = await Category.findById(productData.category);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const product = new Product(productData);
    await product.save();

    // Create initial stock transaction
    if (product.currentStock > 0) {
      await InventoryTransaction.create({
        product: product._id,
        type: 'IN',
        quantity: product.currentStock,
        previousStock: 0,
        newStock: product.currentStock,
        reason: 'Initial stock',
        performedBy: 'System'
      });
    }

    // Update category metrics
    await category.updateMetrics();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const previousStock = product.currentStock;
    const updates = req.body;

    // Handle stock changes
    if (updates.currentStock !== undefined && updates.currentStock !== previousStock) {
      await InventoryTransaction.create({
        product: product._id,
        type: updates.currentStock > previousStock ? 'IN' : 'OUT',
        quantity: Math.abs(updates.currentStock - previousStock),
        previousStock,
        newStock: updates.currentStock,
        reason: updates.stockChangeReason || 'Manual adjustment',
        performedBy: updates.performedBy || 'System'
      });
    }

    // Update product
    Object.assign(product, updates);
    await product.save();

    // Update velocity if needed
    if (updates.metrics?.avgDailySales !== undefined) {
      await product.updateVelocity();
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update stock level
router.post('/:id/stock', async (req, res) => {
  try {
    const { quantity, type, reason, reference } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const previousStock = product.currentStock;
    let newStock;

    switch (type) {
      case 'IN':
        newStock = previousStock + quantity;
        break;
      case 'OUT':
        if (previousStock < quantity) {
          return res.status(400).json({ message: 'Insufficient stock' });
        }
        newStock = previousStock - quantity;
        break;
      case 'ADJUSTMENT':
        newStock = quantity;
        break;
      default:
        return res.status(400).json({ message: 'Invalid transaction type' });
    }

    // Update product stock
    product.currentStock = newStock;
    
    // Update metrics
    if (type === 'OUT') {
      product.metrics.totalSold += quantity;
      product.metrics.lastSold = new Date();
    } else if (type === 'IN') {
      product.metrics.totalOrdered += quantity;
      product.metrics.lastRestocked = new Date();
    }

    await product.save();

    // Create transaction record
    const transaction = await InventoryTransaction.create({
      product: product._id,
      type,
      quantity,
      previousStock,
      newStock,
      reason,
      reference,
      performedBy: req.body.performedBy || 'System'
    });

    res.json({ product, transaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get product transactions
router.get('/:id/transactions', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const transactions = await InventoryTransaction.find({ product: req.params.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await InventoryTransaction.countDocuments({ product: req.params.id });

    res.json({
      transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalTransactions: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get low stock products
router.get('/alerts/low-stock', async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    const lowStockProducts = products.filter(p => 
      p.status === 'Low Stock' || 
      p.status === 'Critical' || 
      p.status === 'Out of Stock'
    );
    
    res.json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products needing reorder
router.get('/alerts/reorder', async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    const reorderProducts = products.filter(p => p.needsReorder());
    
    res.json(reorderProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;