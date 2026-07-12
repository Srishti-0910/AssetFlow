const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    type: {
      type: String,
      enum: ['routine', 'repair', 'inspection', 'upgrade'],
      default: 'routine',
    },
    description: { type: String, trim: true, default: '' },
    scheduledDate: { type: Date, required: true },
    completedDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'overdue'],
      default: 'scheduled',
    },
    cost: { type: Number, default: 0 },
    performedBy: { type: String, trim: true, default: '' },
    loggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

maintenanceSchema.index({ asset: 1, status: 1 });
maintenanceSchema.index({ scheduledDate: 1 });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
