const { Pool } = require('pg');

// TODO: move this to env vars before launch lol
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'backstage_admin',
  password: process.env.DB_PASSWORD || 'changeme123',
  database: process.env.DB_NAME || 'backstage',
});

pool.on('connect', () => {
  console.log('connected to db');
});

pool.on('error', (err) => {
  console.log('db error', err);
});

module.exports = pool;
