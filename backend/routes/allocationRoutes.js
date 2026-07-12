const express = require('express');
const { checkOut, checkIn, listAllocations } = require('../controllers/allocationController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', listAllocations);
router.post('/check-out', requireRole('admin', 'manager'), checkOut);
router.post('/:id/check-in', requireRole('admin', 'manager'), checkIn);

module.exports = router;
