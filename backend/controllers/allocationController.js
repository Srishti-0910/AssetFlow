const Allocation = require('../models/Allocation');
const Asset = require('../models/Asset');

async function checkOut(req, res) {
  try {
    const { assetId, allocatedTo, project, dueBackAt, notes } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    if (asset.status !== 'available') {
      return res.status(409).json({ message: `Asset is currently ${asset.status}, not available for allocation` });
    }

    const allocation = await Allocation.create({
      asset: assetId,
      allocatedTo,
      project,
      dueBackAt,
      notes,
      handledBy: req.user.id,
    });

    asset.status = 'allocated';
    await asset.save();

    res.status(201).json(allocation);
  } catch (err) {
    res.status(500).json({ message: 'Failed to check out asset', error: err.message });
  }
}

async function checkIn(req, res) {
  try {
    const allocation = await Allocation.findById(req.params.id);
    if (!allocation) return res.status(404).json({ message: 'Allocation not found' });
    if (allocation.status !== 'active' && allocation.status !== 'overdue') {
      return res.status(409).json({ message: 'This allocation is already closed' });
    }

    allocation.status = 'returned';
    allocation.checkedInAt = new Date();
    await allocation.save();

    await Asset.findByIdAndUpdate(allocation.asset, { status: 'available' });

    res.json(allocation);
  } catch (err) {
    res.status(500).json({ message: 'Failed to check in asset', error: err.message });
  }
}

async function listAllocations(req, res) {
  try {
    const { status, assetId, userId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (assetId) filter.asset = assetId;
    if (userId) filter.allocatedTo = userId;

    const allocations = await Allocation.find(filter)
      .populate('asset', 'assetTag name category')
      .populate('allocatedTo', 'name email department')
      .sort({ createdAt: -1 });

    res.json(allocations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch allocations', error: err.message });
  }
}

module.exports = { checkOut, checkIn, listAllocations };
