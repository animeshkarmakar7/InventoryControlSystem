// models/InventoryTransaction.js
const mongoose = require('mongoose');

const inventoryTransactionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type: {
    type: String,
    enum: ['IN', 'OUT', 'ADJUSTMENT', 'RETURN', 'DAMAGE'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  reference: {
    type: String, // Order ID, Invoice ID, etc.
    default: null
  },
  performedBy: {
    type: String,
    default: 'System'
  },
  cost: {
    unitCost: Number,
    totalCost: Number
  },
  notes: String
}, {
  timestamps: true
});

// Index for better query performance
inventoryTransactionSchema.index({ product: 1, createdAt: -1 });
inventoryTransactionSchema.index({ type: 1 });

const InventoryTransaction = mongoose.model('InventoryTransaction', inventoryTransactionSchema);

module.exports = InventoryTransaction;