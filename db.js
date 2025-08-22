const { Pool } = require('pg');

const pool = new Pool({
  user: 'ankushinfotech',        // Your PostgreSQL username
  host: 'srv945943.hstgr.cloud', // Your VPS hostname from Hostinger
  database: 'postgre',          // Change if you created a custom DB name
  password: 'Kanha@123',         // Your PostgreSQL password
  port: 5432,                    // Default PostgreSQL port
});
module.exports = pool;


// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'postgres',
//   port: 5432,
// });

// module.exports = pool;


// // db.js
// require('dotenv').config();
// const { Pool } = require('pg');

// // Use DATABASE_URL from .env
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
// });

// router.get('/users', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users');
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Database error:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',  // or your server IP if remote
//   database: 'postgres',
//   password: 'postgres',
//   port: 5432,
// });

// module.exports = pool;
