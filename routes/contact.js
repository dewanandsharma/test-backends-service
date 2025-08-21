const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL connection pool

router.post('/', async (req, res) => {
  const { name, email, mobile, message } = req.body;

  try {
    const insertQuery = `
      INSERT INTO contact (name, email, mobile, message)
      VALUES ($1, $2, $3, $4)
      RETURNING * `;

    const result = await pool.query(insertQuery, [name, email, mobile, message]);

    console.log('Contact saved:', result.rows[0]);
    res.status(200).json({ message: 'Message saved successfully!' });
  } catch (err) {
    console.error('Error inserting contact:', err);
    res.status(500).json({ message: 'Failed to save contact.' });
  }
});

// In routes/contact.js or similar
router.get('/', async (req, res) => {
  try {
    const sortBy = req.query.sort || 'id';
    const sortOrder = req.query.order || 'desc';

    const allowedColumns = ['id', 'name', 'email', 'mobile', 'message'];
    const allowedOrders = ['asc', 'desc'];

    if (!allowedColumns.includes(sortBy) || !allowedOrders.includes(sortOrder.toLowerCase())) {
      return res.status(400).json({ success: false, error: 'Invalid sort or order' });
    }

    // Construct safe SQL using validated variables (PostgreSQL doesn't allow placeholders for column names)
    const query = `SELECT id, name, email, mobile, message FROM contact ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });

  } catch (error) {
    console.error('GET /contact error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// In routes/contact.js or similar
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, message } = req.body;

    // Optional: Validate required fields
    if (!name || !email || !mobile || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const updateQuery = `
      UPDATE contact
      SET name = $1, email = $2, mobile = $3, message = $4
      WHERE id = $5
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, [name, email, mobile, message, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({ success: true, message: 'Record updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// In routes/contact.js Table data get list Client 
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM contact WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// routes/contact.js Update Client data get method 
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM contact WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});




module.exports = router;
