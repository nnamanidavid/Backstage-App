const express = require('express');
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// get shipment history for logged in user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sh.*, a.name as artist_name
       FROM shipments sh
       JOIN subscriptions s ON sh.subscription_id = s.id
       JOIN artists a ON sh.artist_id = a.id
       WHERE s.user_id = $1
       ORDER BY sh.box_month DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.log('error fetching shipments', err);
    res.status(500).json({ error: 'could not fetch shipments' });
  }
});

module.exports = router;
