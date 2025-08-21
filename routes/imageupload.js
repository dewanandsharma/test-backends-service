const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const path = require('path');
const pool = require('../db');

const router = express.Router();

// Ensure uploads folder exists
const fs = require('fs');
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Setup storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// POST route for single image upload
router.post('/', upload.single('image'), async (req, res) => {
  const { email, phone, password } = req.body;
  const imagePath = req.file ? req.file.path : null;

  if (!email || !phone || !password) {
    return res.status(400).json({ error: 'Email, phone, and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, phone, password, image)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [email, phone, hashedPassword, imagePath]
    );

    res.status(201).json({
      message: 'User created!',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Insert error:', error);
    res.status(500).json({ error: 'Failed to insert user' });
  }
});



// PUT /api/users/:id - Update user
router.put('/:id', upload.single('image'), async (req, res) => {
  const { email, phone } = req.body;
  const { id } = req.params;
  const imagePath = req.file ? req.file.path : null;

  // Basic validation
 if (!email || !phone) {
  return res.status(400).json({ error: 'Email and phone are required.' });
}


//   if (!email?.trim() || !phone?.trim()) {
//   return res.status(400).json({ error: 'Email and phone are required and cannot be empty.' });
// }
//console.log('Received form data:', req.body);

  try {
    const result = await pool.query(
      `UPDATE users
       SET email = $1,
           phone = $2,
           image = COALESCE($3, image)
       WHERE id = $4
       RETURNING *`,
      [email, phone, imagePath, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({
      message: 'User updated successfully!',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update user.' });
  }
});




// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Get user's image path before deleting
    const selectResult = await pool.query(
      'SELECT image FROM users WHERE id = $1',
      [id]
    );

    if (selectResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const imagePath = selectResult.rows[0].image;

    // Delete the user from DB
    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    // Delete the image file if it exists
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});



router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, phone, image FROM users');

    const users = result.rows.map(user => ({
      ...user,
      image: user.image ? `http://localhost:5000/uploads/${path.basename(user.image)}` : null
    }));

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching users');
  }
});


//Image email phone get method
router.get('/',async(req,res)=>{
  try{
  const result = await pool.query('Select id,image,email,phone From public.users Order By id Desc')
  const users = result.rows.map(user => ({
    ...user,
    image: user.image ? `http://localhost/uploads/${path.basename(user.image)}` : null
  }));
  res.json(users);
} catch(err) {
  console.log(err);
  res.status(500).json('Error Fetching Users')
}
});


module.exports = router;






