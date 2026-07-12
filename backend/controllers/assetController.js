const Asset = require('../models/Asset');

async function createAsset(req, res) {
  try {
    const { assetTag, name, category, location, purchaseDate, purchaseCost, condition, notes } = req.body;

    if (!assetTag || !name) {
      return res.status(400).json({ message: 'assetTag and name are required' });
    }

    const existing = await Asset.findOne({ assetTag });
    if (existing) {
      return res.status(409).json({ message: `Asset tag ${assetTag} is already in use` });
    }

    const asset = await Asset.create({
      assetTag,
      name,
      category,
      location,
      purchaseDate,
      purchaseCost,
      condition,
      notes,
      createdBy: req.user.id,
    });

    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create asset', error: err.message });
  }
}

async function listAssets(req, res) {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { assetTag: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Asset.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Asset.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assets', error: err.message });
  }
}

async function getAsset(req, res) {
  const asset = await Asset.findById(req.params.id);
  if (!asset) return res.status(404).json({ message: 'Asset not found' });
  res.json(asset);
}

async function updateAsset(req, res) {
  try {
    const updates = { ...req.body };
    delete updates.assetTag; // tags are immutable once created

    const asset = await Asset.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update asset', error: err.message });
  }
}

async function deleteAsset(req, res) {
  const asset = await Asset.findByIdAndDelete(req.params.id);
  if (!asset) return res.status(404).json({ message: 'Asset not found' });
  res.json({ message: 'Asset deleted' });
}

module.exports = { createAsset, listAssets, getAsset, updateAsset, deleteAsset };
