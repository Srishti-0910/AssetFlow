const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    allocatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: String, trim: true, default: '' },
    checkedOutAt: { type: Date, default: Date.now },
    dueBackAt: { type: Date },
    checkedInAt: { type: Date, default: null },
    status: { type: String, enum: ['active', 'returned', 'overdue'], default: 'active' },
    notes: { type: String, default: '' },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

allocationSchema.index({ asset: 1, status: 1 });
allocationSchema.index({ allocatedTo: 1 });

module.exports = mongoose.model('Allocation', allocationSchema);
