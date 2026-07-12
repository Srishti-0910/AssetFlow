require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AssetFlow API' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/allocations', require('./routes/allocationRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

if (process.env.MONGO_URI) {
  connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => console.log(`AssetFlow API running on port ${PORT}`));
  });
} else {
  app.listen(PORT, () => console.log(`AssetFlow API running on port ${PORT} (no DB configured)`));
}

module.exports = app;
