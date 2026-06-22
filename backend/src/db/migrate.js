// Run with: npm run migrate
const pool = require('../config/db');

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  shipping_address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS artists (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  genre VARCHAR(100),
  city VARCHAR(100),
  image_url TEXT,
  preview_track_url TEXT,
  spotify_url TEXT,
  instagram_handle VARCHAR(100),
  featured_month VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS merch_items (
  id SERIAL PRIMARY KEY,
  artist_id INTEGER REFERENCES artists(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- vinyl, cassette, tshirt, poster, sticker_pack
  image_url TEXT,
  box_month VARCHAR(20) -- e.g. '2026-06'
);

CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price_naira INTEGER NOT NULL,
  billing_interval VARCHAR(20) DEFAULT 'monthly',
  description TEXT
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  plan_id INTEGER REFERENCES subscription_plans(id),
  status VARCHAR(20) DEFAULT 'active', -- active, paused, cancelled
  stripe_subscription_id VARCHAR(255),
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipments (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER REFERENCES subscriptions(id),
  box_month VARCHAR(20),
  artist_id INTEGER REFERENCES artists(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, shipped, delivered
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMP
);
`;

const seedPlans = `
INSERT INTO subscription_plans (name, price_naira, billing_interval, description)
VALUES
  ('Listener', 8500, 'monthly', 'One artist''s vinyl or cassette, no merch.'),
  ('Fan', 14000, 'monthly', 'Vinyl/cassette plus one merch item from the featured artist.'),
  ('Superfan', 22000, 'monthly', 'Vinyl/cassette, two merch items, and early access to ticket drops.')
ON CONFLICT DO NOTHING;
`;

const seedArtists = `
INSERT INTO artists (name, bio, genre, city, preview_track_url, featured_month)
VALUES
  ('Tope Alabi Jr.', 'Afrobeat fusion artist blending highlife with modern production.', 'Afrobeat', 'Lagos', 'https://backstage-previews.s3.amazonaws.com/tope-preview.mp3', '2026-06'),
  ('Chiamaka & The Echoes', 'Alté/indie rock four-piece out of Enugu, known for raw live sets.', 'Alte Rock', 'Enugu', 'https://backstage-previews.s3.amazonaws.com/chiamaka-preview.mp3', '2026-06'),
  ('DJ Kpese', 'Amapiano producer pushing the genre into experimental territory.', 'Amapiano', 'Abuja', 'https://backstage-previews.s3.amazonaws.com/kpese-preview.mp3', '2026-07')
ON CONFLICT DO NOTHING;
`;

async function migrate() {
  try {
    await pool.query(schema);
    console.log('schema created');
    await pool.query(seedArtists);
    console.log('seed data inserted');
    await pool.query(seedPlans);
    console.log('plans seeded');
    process.exit(0);
  } catch (err) {
    console.log('migration failed', err);
    process.exit(1);
  }
}

migrate();
