let check;
try {
  check = require('./check.js');
} catch (err) {
  console.error('Missing check.js:', err.message);
  check = () => {}; // fallback function
}
