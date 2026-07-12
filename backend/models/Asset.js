const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    assetTag: { type: String, required: true, unique: true, trim: true }, // e.g. AF-0001
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['equipment', 'device', 'vehicle', 'facility', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['available', 'allocated', 'maintenance', 'retired'],
      default: 'available',
    },
    location: { type: String, trim: true, default: '' },
    purchaseDate: { type: Date },
    purchaseCost: { type: Number, default: 0 },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good',
    },
    notes: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

assetSchema.index({ assetTag: 1 });
assetSchema.index({ status: 1, category: 1 });

module.exports = mongoose.model('Asset', assetSchema);
