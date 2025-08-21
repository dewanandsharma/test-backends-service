const express = require('express');
const bcrypt = require('bcryptjs'); 
const router = express.Router();
const pool = require('../db'); // adjust if needed

// CREATE
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, date, department, doctor, message, password } = req.body;

    // Check if pool is defined
    if (!pool) {
      throw new Error('Database connection pool is not defined.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO appointments (name, email, phone, date, department, doctor, message, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [name, email, phone, date, department, doctor, message, hashedPassword];

    const result = await pool.query(query, values);
    res.status(201).json({ success: true, data: result.rows[0] });

  } catch (error) {
    console.error('Error inserting appointment:', error);
    res.status(500).json({ error: error.message });
  }
});


// UPDATE
// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name, email, phone, date, department, doctor, message, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await pool.query(
//       `UPDATE appointments 
//        SET name=$1, email=$2, phone=$3, date=$4, department=$5, doctor=$6, message=$7, password=$8
//        WHERE id=$9 RETURNING *`,
//       [name, email, phone, date, department, doctor, message, hashedPassword, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Appointment not found' });
//     }

//     res.json({ success: true, data: result.rows[0] });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, message, date } = req.body;

  try {
    const result = await pool.query(
      `UPDATE appointments 
       SET name = $1, phone = $2, message = $3, date = $4 
       WHERE id = $5 
       RETURNING id, name, phone, message, date`,
      [name, phone, message, date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ success: true, data: result.rows[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example: GET /api/appointments?page=1&limit=100
// router.get('/api/data', async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 100;
//   const offset = (page - 1) * limit;

//   const data = await db.query(`SELECT * FROM appointments ORDER BY date DESC OFFSET $1 LIMIT $2`, [offset, limit]);
//   res.json(data.rows);
// });


// READ ALL
// router.get('/', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT id, name, phone, message, date FROM appointments ORDER BY id  DESC');
//     res.json({ success: true, data: result.rows });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

router.get('/', async (req, res) => {
  try {
    const sortBy = req.query.sort || 'id';
    const sortOrder = req.query.order || 'desc';

    const allowedColumns = ['id', 'name', 'phone', 'message', 'date'];
    const allowedOrders = ['asc', 'desc'];

    if (!allowedColumns.includes(sortBy) || !allowedOrders.includes(sortOrder.toLowerCase())) {
      return res.status(400).json({ success: false, error: 'Invalid sort or order' });
    }

    const query = `SELECT id, name, phone, message, date FROM appointments ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE an appointment by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});





// Monitoring endpoint
// router.post('/', (req, res) => {
//   const { endpoint, duration, status } = req.body;
//   console.log(`[MONITOR] ${endpoint} took ${duration}ms - status ${status}`);
//   res.sendStatus(200);
// });


module.exports = router;
