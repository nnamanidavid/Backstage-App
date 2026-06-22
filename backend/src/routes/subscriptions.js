const express = require('express');
const Stripe = require('stripe');
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const router = express.Router();

// list available plans
router.get('/plans', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subscription_plans');
    res.json(result.rows);
  } catch (err) {
    console.log('error fetching plans', err);
    res.status(500).json({ error: 'could not fetch plans' });
  }
});

// get current user's subscription
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, p.name as plan_name, p.price_naira
       FROM subscriptions s
       JOIN subscription_plans p ON s.plan_id = p.id
       WHERE s.user_id = $1 AND s.status = 'active'`,
      [req.userId]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    console.log('error fetching subscription', err);
    res.status(500).json({ error: 'could not fetch subscription' });
  }
});

// subscribe to a plan
router.post('/subscribe', authMiddleware, async (req, res) => {
  const { planId, paymentMethodId } = req.body;

  try {
    const planResult = await pool.query('SELECT * FROM subscription_plans WHERE id = $1', [planId]);
    if (planResult.rows.length === 0) {
      return res.status(400).json({ error: 'invalid plan' });
    }

    // NOTE: assumes customer already created in stripe on signup - founders TODO
    const charge = await stripe.paymentIntents.create({
      amount: planResult.rows[0].price_naira * 100,
      currency: 'ngn',
      payment_method: paymentMethodId,
      confirm: true,
    });

    const sub = await pool.query(
      `INSERT INTO subscriptions (user_id, plan_id, status, current_period_end)
       VALUES ($1, $2, 'active', NOW() + INTERVAL '30 days') RETURNING *`,
      [req.userId, planId]
    );

    res.json(sub.rows[0]);
  } catch (err) {
    console.log('subscribe error', err);
    res.status(500).json({ error: 'subscription failed' });
  }
});

// cancel subscription
router.post('/cancel', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      `UPDATE subscriptions SET status = 'cancelled' WHERE user_id = $1 AND status = 'active'`,
      [req.userId]
    );
    res.json({ message: 'subscription cancelled' });
  } catch (err) {
    console.log('cancel error', err);
    res.status(500).json({ error: 'could not cancel' });
  }
});

// pause subscription
router.post('/pause', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      `UPDATE subscriptions SET status = 'paused' WHERE user_id = $1 AND status = 'active'`,
      [req.userId]
    );
    res.json({ message: 'subscription paused' });
  } catch (err) {
    console.log('pause error', err);
    res.status(500).json({ error: 'could not pause' });
  }
});

module.exports = router;
