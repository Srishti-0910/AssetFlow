const express = require('express');
const {
  createAsset,
  listAssets,
  getAsset,
  updateAsset,
  deleteAsset,
} = require('../controllers/assetController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', listAssets);
router.get('/:id', getAsset);
router.post('/', requireRole('admin', 'manager'), createAsset);
router.put('/:id', requireRole('admin', 'manager'), updateAsset);
router.delete('/:id', requireRole('admin'), deleteAsset);

module.exports = router;
