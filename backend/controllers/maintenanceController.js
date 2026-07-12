const Maintenance = require('../models/Maintenance');
const Asset = require('../models/Asset');

async function scheduleMaintenance(req, res) {
  try {
    const { assetId, type, description, scheduledDate, cost, performedBy } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    const record = await Maintenance.create({
      asset: assetId,
      type,
      description,
      scheduledDate,
      cost,
      performedBy,
      loggedBy: req.user.id,
    });

    asset.status = 'maintenance';
    await asset.save();

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: 'Failed to schedule maintenance', error: err.message });
  }
}

async function completeMaintenance(req, res) {
  try {
    const record = await Maintenance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Maintenance record not found' });

    record.status = 'completed';
    record.completedDate = new Date();
    await record.save();

    await Asset.findByIdAndUpdate(record.asset, { status: 'available' });

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Failed to complete maintenance', error: err.message });
  }
}

async function listMaintenance(req, res) {
  try {
    const { status, assetId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (assetId) filter.asset = assetId;

    const records = await Maintenance.find(filter)
      .populate('asset', 'assetTag name category')
      .sort({ scheduledDate: 1 });

    // Flag overdue scheduled items on read
    const now = new Date();
    const withOverdue = records.map((r) => {
      const obj = r.toObject();
      if (obj.status === 'scheduled' && new Date(obj.scheduledDate) < now) {
        obj.status = 'overdue';
      }
      return obj;
    });

    res.json(withOverdue);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch maintenance records', error: err.message });
  }
}

module.exports = { scheduleMaintenance, completeMaintenance, listMaintenance };
