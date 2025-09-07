// routes/analytics.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const InventoryTransaction = require('../models/InventoryTransaction');

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    
    const stats = {
      totalProducts: products.length,
      inStock: products.filter(p => p.status === 'In Stock').length,
      lowStock: products.filter(p => p.status === 'Low Stock').length,
      critical: products.filter(p => p.status === 'Critical').length,
      outOfStock: products.filter(p => p.status === 'Out of Stock').length,
      totalValue: products.reduce((sum, p) => sum + (p.currentStock * p.price.selling), 0),
      needsReorder: products.filter(p => p.needsReorder()).length,
      velocityDistribution: {
        high: products.filter(p => p.velocity === 'High').length,
        medium: products.filter(p => p.velocity === 'Medium').length,
        low: products.filter(p => p.velocity === 'Low').length
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get inventory movement data
router.get('/inventory-movement', async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'category' } = req.query;
    
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    
    const transactions = await InventoryTransaction.find(
      dateFilter.$gte || dateFilter.$lte ? { createdAt: dateFilter } : {}
    ).populate({
      path: 'product',
      populate: { path: 'category' }
    });
    
    // Group data
    const grouped = {};
    
    for (const transaction of transactions) {
      if (!transaction.product) continue;
      
      const key = groupBy === 'category' 
        ? transaction.product.category?.name || 'Uncategorized'
        : transaction.product.name;
      
      if (!grouped[key]) {
        grouped[key] = {
          name: key,
          totalIn: 0,
          totalOut: 0,
          totalTransactions: 0,
          value: 0
        };
      }
      
      grouped[key].totalTransactions++;
      
      if (transaction.type === 'IN') {
        grouped[key].totalIn += transaction.quantity;
      } else if (transaction.type === 'OUT') {
        grouped[key].totalOut += transaction.quantity;
        grouped[key].value += transaction.quantity * transaction.product.price.selling;
      }
    }
    
    // Calculate turnover rates
    const categories = await Category.find({ isActive: true });
    for (const category of categories) {
      if (grouped[category.name]) {
        await category.updateMetrics();
        grouped[category.name].turnoverRate = category.metrics.avgTurnoverRate;
        grouped[category.name].avgDaysInStock = category.metrics.avgDaysInStock;
      }
    }
    
    res.json(Object.values(grouped));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get demand prediction data
router.get('/demand-prediction/:productId', async (req, res) => {
  try {
    const { months = 12 } = req.query;
    const product = await Product.findById(req.params.productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get historical data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    const transactions = await InventoryTransaction.find({
      product: req.params.productId,
      type: 'OUT',
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: 1 });
    
    // Group by month
    const monthlyData = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = {
        month: monthNames[date.getMonth()],
        year: date.getFullYear(),
        actual: 0,
        predicted: 0
      };
    }
    
    // Fill actual data
    transactions.forEach(transaction => {
      const date = new Date(transaction.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].actual += transaction.quantity;
      }
    });
    
    // Simple prediction based on moving average
    const values = Object.values(monthlyData).map(d => d.actual);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const trend = values.length > 3 
      ? (values[values.length - 1] - values[0]) / values.length 
      : 0;
    
    // Add predictions for next 3 months
    for (let i = 1; i <= 3; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = {
        month: monthNames[date.getMonth()],
        year: date.getFullYear(),
        actual: null,
        predicted: Math.max(0, Math.round(avg + (trend * (values.length + i))))
      };
    }
    
    // Update product predictions
    product.predictions.nextMonthDemand = Math.round(avg + trend);
    product.predictions.confidence = 75; // Simple confidence score
    product.predictions.suggestedReorderQuantity = Math.max(
      0, 
      (product.predictions.nextMonthDemand * 2) - product.currentStock
    );
    
    if (product.currentStock > 0 && avg > 0) {
      const daysUntilStockout = Math.floor(product.currentStock / (avg / 30));
      product.predictions.predictedStockout = new Date(Date.now() + (daysUntilStockout * 24 * 60 * 60 * 1000));
    }
    
    await product.save();
    
    res.json({
      historical: Object.values(monthlyData).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
      }),
      predictions: product.predictions,
      currentStock: product.currentStock,
      averageDemand: avg
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get IMO (Inventory Movement Optimization) analysis
router.get('/imo-analysis', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    const imoData = [];
    
    for (const category of categories) {
      await category.updateMetrics();
      
      const products = await Product.find({ category: category._id, isActive: true });
      
      let totalStockValue = 0;
      let totalTurnover = 0;
      let stockDays = [];
      
      for (const product of products) {
        totalStockValue += product.currentStock * product.price.selling;
        totalTurnover += product.calculateTurnoverRate();
        
        if (product.metrics.avgDailySales > 0) {
          stockDays.push(product.currentStock / product.metrics.avgDailySales);
        }
      }
      
      imoData.push({
        category: category.name,
        categoryId: category._id,
        turnoverRate: products.length > 0 ? (totalTurnover / products.length).toFixed(1) : 0,
        avgDaysInStock: stockDays.length > 0 
          ? Math.round(stockDays.reduce((a, b) => a + b, 0) / stockDays.length)
          : 0,
        value: totalStockValue,
        productCount: products.length,
        optimizationScore: Math.min(100, Math.round((totalTurnover / products.length) * 10))
      });
    }
    
    res.json(imoData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent transactions
router.get('/recent-transactions', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const transactions = await InventoryTransaction.find()
      .populate({
        path: 'product',
        select: 'name sku category',
        populate: { path: 'category', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;