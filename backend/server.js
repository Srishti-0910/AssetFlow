require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// CLIENT_ORIGIN supports one or more comma-separated origins, e.g.
// "https://assetflow.vercel.app,https://assetflow-git-main-you.vercel.app"
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // allow non-browser requests (curl, health checks) with no origin header
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AssetFlow API' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/allocations', require('./routes/allocationRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

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
