require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Asset = require('../models/Asset');
const Allocation = require('../models/Allocation');
const Maintenance = require('../models/Maintenance');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Clearing existing demo data…');

  await Promise.all([
    User.deleteMany({}),
    Asset.deleteMany({}),
    Allocation.deleteMany({}),
    Maintenance.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await User.create({
    name: 'Asha Rao',
    email: 'admin@assetflow.dev',
    passwordHash,
    role: 'admin',
    department: 'Operations',
  });

  const staff = await User.create({
    name: 'Marcus Chen',
    email: 'staff@assetflow.dev',
    passwordHash,
    role: 'staff',
    department: 'Engineering',
  });

  const assets = await Asset.insertMany([
    { assetTag: 'AF-0001', name: 'Dell Latitude 5420', category: 'device', status: 'allocated', location: 'HQ - Floor 3', condition: 'good', purchaseCost: 950, createdBy: admin._id },
    { assetTag: 'AF-0002', name: 'MacBook Pro 16"', category: 'device', status: 'available', location: 'HQ - Floor 2', condition: 'excellent', purchaseCost: 2400, createdBy: admin._id },
    { assetTag: 'AF-0003', name: 'Forklift — Toyota 8FGU25', category: 'vehicle', status: 'maintenance', location: 'Warehouse B', condition: 'fair', purchaseCost: 28000, createdBy: admin._id },
    { assetTag: 'AF-0004', name: 'Conference Room A/V Kit', category: 'equipment', status: 'available', location: 'HQ - Floor 1', condition: 'good', purchaseCost: 3200, createdBy: admin._id },
    { assetTag: 'AF-0005', name: 'Server Rack — Rack 12', category: 'facility', status: 'available', location: 'Data Center', condition: 'excellent', purchaseCost: 15000, createdBy: admin._id },
  ]);

  await Allocation.create({
    asset: assets[0]._id,
    allocatedTo: staff._id,
    project: 'Q3 Platform Migration',
    dueBackAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    handledBy: admin._id,
  });

  await Maintenance.create({
    asset: assets[2]._id,
    type: 'repair',
    description: 'Hydraulic lift inspection and seal replacement',
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    performedBy: 'Fleet Services Inc.',
    loggedBy: admin._id,
  });

  await Maintenance.create({
    asset: assets[4]._id,
    type: 'routine',
    description: 'Quarterly rack cooling check',
    scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // intentionally overdue for demo
    loggedBy: admin._id,
  });

  console.log('Seed complete.');
  console.log('  Admin login: admin@assetflow.dev / password123');
  console.log('  Staff login: staff@assetflow.dev / password123');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
