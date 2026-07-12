const express = require('express');
const {
  scheduleMaintenance,
  completeMaintenance,
  listMaintenance,
} = require('../controllers/maintenanceController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', listMaintenance);
router.post('/', requireRole('admin', 'manager'), scheduleMaintenance);
router.post('/:id/complete', requireRole('admin', 'manager'), completeMaintenance);

module.exports = router;
