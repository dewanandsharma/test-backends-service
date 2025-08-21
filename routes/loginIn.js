const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
// Fix: Add parser BEFORE route handlers
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const path = require('path')
const pool = require('../db')
const bcrypt = require('bcrypt');

// Handle Login
router.post('/', (req, res) => {
  console.log('Login attempt:', req.body); // ✅ log incoming data

  const { username, password } = req.body;
  if (username === 'Ankushinfotech' && password === '123456') {
    return res.json({ success: true });
  } else {
    return res.json({ success: false, message: 'Invalid username or password' });
  }
});




//User Login Method POST /api/login


router.post('/', async (req, res) => {
  const { phone, password } = req.body;

  try {
    // 1. Check if user exists with given phone
    const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);

    if (result.rowCount === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const user = result.rows[0];

    // 2. Check password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // 3. Optional: Format image path
    user.image = user.image
      ? `http://localhost/uploads/${path.basename(user.image)}`
      : null;

    // 4. Send minimal user info (not password)
    res.json({
      id: user.id,
      email: user.email,
      phone: user.phone,
      image: user.image
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
;





module.exports = router;
