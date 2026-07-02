require('dotenv').config();
const express = require('express');
const cors = require('cors');


const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artists');
const subscriptionRoutes = require('./routes/subscriptions');
const shipmentRoutes = require('./routes/shipments');
const pool = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/healthz', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.log('healthz check failed', err);
    res.status(503).json({ status: 'unhealthy' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/shipments', shipmentRoutes);

app.get('/', (req, res) => {
  res.send('Backstage API is running');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Backstage backend listening on port ${PORT}`);
});
