require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artists');
const subscriptionRoutes = require('./routes/subscriptions');
const shipmentRoutes = require('./routes/shipments');

const app = express();

app.use(cors());
app.use(express.json());

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
