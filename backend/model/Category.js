// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    maxlength: 3
  },
  description: {
    type: String,
    default: ''
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  metrics: {
    totalProducts: {
      type: Number,
      default: 0
    },
    totalValue: {
      type: Number,
      default: 0
    },
    avgTurnoverRate: {
      type: Number,
      default: 0
    },
    avgDaysInStock: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual to get all products in this category
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

// Method to update category metrics
categorySchema.methods.updateMetrics = async function() {
  const Product = mongoose.model('Product');
  const products = await Product.find({ category: this._id });
  
  this.metrics.totalProducts = products.length;
  this.metrics.totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.price.selling), 0);
  
  if (products.length > 0) {
    const turnoverRates = products.map(p => p.calculateTurnoverRate());
    this.metrics.avgTurnoverRate = turnoverRates.reduce((a, b) => a + b, 0) / turnoverRates.length;
  }
  
  return this.save();
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;