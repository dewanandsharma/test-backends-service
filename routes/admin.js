const express = require('express');
const path = require('path');
const router = express.Router();

const ADMIN_USERNAME = "Pradeepkumar";
const ADMIN_PASSWORD = "Ankush#8707";

// GET: Login Page
router.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/admin/dashboard');
  } else {
    res.sendFile(path.join(__dirname, '../public/login.html'));
  }
});

// POST: Handle Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.loggedIn = true;
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Invalid Username or Password" });
  }
});

// GET: Dashboard
router.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
  } else {
    res.redirect('/admin');
  }
});

// GET: Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin');
  });
});

module.exports = router;
