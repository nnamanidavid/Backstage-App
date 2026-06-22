const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// get all artists
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM artists ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.log('error fetching artists', err);
    res.status(500).json({ error: 'could not fetch artists' });
  }
});

// get single artist with their merch
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const artist = await pool.query('SELECT * FROM artists WHERE id = $1', [id]);
    if (artist.rows.length === 0) {
      return res.status(404).json({ error: 'artist not found' });
    }

    const merch = await pool.query('SELECT * FROM merch_items WHERE artist_id = $1', [id]);

    res.json({ ...artist.rows[0], merch: merch.rows });
  } catch (err) {
    console.log('error fetching artist', err);
    res.status(500).json({ error: 'could not fetch artist' });
  }
});

// current featured artist (this month's box)
router.get('/featured/current', async (req, res) => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  try {
    const result = await pool.query('SELECT * FROM artists WHERE featured_month = $1', [currentMonth]);
    res.json(result.rows);
  } catch (err) {
    console.log('error fetching featured artist', err);
    res.status(500).json({ error: 'could not fetch featured artist' });
  }
});

module.exports = router;
