// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  description: {
    type: String,
    default: ''
  },
  // Stock Management
  currentStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  // Threshold levels for automatic status calculation
  thresholds: {
    min: {
      type: Number,
      required: true,
      default: 10
    },
    max: {
      type: Number,
      required: true,
      default: 100
    },
    reorderPoint: {
      type: Number,
      required: true,
      default: 20
    },
    criticalLevel: {
      type: Number,
      required: true,
      default: 5
    }
  },
  // Pricing
  price: {
    cost: {
      type: Number,
      required: true,
      min: 0
    },
    selling: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  // Supplier Information
  supplier: {
    name: {
      type: String,
      required: true
    },
    contact: {
      email: String,
      phone: String
    },
    leadTime: {
      type: Number, // in days
      default: 7
    }
  },
  // Movement tracking
  velocity: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  // Analytics data
  metrics: {
    avgDailySales: {
      type: Number,
      default: 0
    },
    turnoverRate: {
      type: Number,
      default: 0
    },
    lastRestocked: Date,
    lastSold: Date,
    totalSold: {
      type: Number,
      default: 0
    },
    totalOrdered: {
      type: Number,
      default: 0
    }
  },
  // Predictions (will be updated by AI service)
  predictions: {
    nextMonthDemand: {
      type: Number,
      default: 0
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    suggestedReorderQuantity: {
      type: Number,
      default: 0
    },
    predictedStockout: Date
  },
  // Additional Information
  barcode: String,
  location: {
    warehouse: String,
    shelf: String,
    bin: String
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: {
      type: String,
      default: 'cm'
    }
  },
  images: [{
    url: String,
    isPrimary: Boolean
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  notes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for stock status
productSchema.virtual('status').get(function() {
  const stockPercentage = (this.currentStock / this.thresholds.max) * 100;
  
  if (this.currentStock === 0) return 'Out of Stock';
  if (this.currentStock <= this.thresholds.criticalLevel) return 'Critical';
  if (this.currentStock <= this.thresholds.min) return 'Low Stock';
  if (this.currentStock <= this.thresholds.reorderPoint) return 'Reorder Soon';
  return 'In Stock';
});

// Virtual for stock percentage
productSchema.virtual('stockPercentage').get(function() {
  return Math.min((this.currentStock / this.thresholds.max) * 100, 100);
});

// Method to update velocity based on sales
productSchema.methods.updateVelocity = function() {
  const avgDaily = this.metrics.avgDailySales;
  
  if (avgDaily > 10) this.velocity = 'High';
  else if (avgDaily > 5) this.velocity = 'Medium';
  else this.velocity = 'Low';
  
  return this.save();
};

// Method to check if reorder is needed
productSchema.methods.needsReorder = function() {
  return this.currentStock <= this.thresholds.reorderPoint;
};

// Method to calculate turnover rate
productSchema.methods.calculateTurnoverRate = function(period = 30) {
  if (this.currentStock === 0) return 0;
  return (this.metrics.totalSold / period) / this.currentStock;
};

// Pre-save middleware to generate SKU if not provided
productSchema.pre('save', async function(next) {
  if (!this.sku) {
    const category = await mongoose.model('Category').findById(this.category);
    const prefix = category ? category.code : 'PRD';
    const count = await mongoose.model('Product').countDocuments();
    this.sku = `${prefix}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Indexes for better query performance
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ 'supplier.name': 1 });
productSchema.index({ status: 1 });
productSchema.index({ currentStock: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;