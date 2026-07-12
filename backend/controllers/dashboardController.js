const Asset = require('../models/Asset');
const Allocation = require('../models/Allocation');
const Maintenance = require('../models/Maintenance');

async function summary(req, res) {
  try {
    const [statusCounts, categoryCounts, activeAllocations, upcomingMaintenance, overdueMaintenance] =
      await Promise.all([
        Asset.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Asset.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
        Allocation.countDocuments({ status: 'active' }),
        Maintenance.find({ status: 'scheduled' })
          .populate('asset', 'assetTag name')
          .sort({ scheduledDate: 1 })
          .limit(5),
        Maintenance.countDocuments({ status: 'scheduled', scheduledDate: { $lt: new Date() } }),
      ]);

    res.json({
      statusCounts: Object.fromEntries(statusCounts.map((s) => [s._id, s.count])),
      categoryCounts: Object.fromEntries(categoryCounts.map((c) => [c._id, c.count])),
      activeAllocations,
      overdueMaintenance,
      upcomingMaintenance,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard summary', error: err.message });
  }
}

module.exports = { summary };
