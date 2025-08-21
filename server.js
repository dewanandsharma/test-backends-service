
const check = require('./check.js')
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = 5000;
//require('dotenv').config();
// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images statically file image
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const imageupload = require('./routes/imageupload');
const appointmentRoutes = require('./routes/appointments');
const loginRouter = require('./routes/loginIn'); // adjust the path
const bloggerRouter = require('./routes/imageupload');
const userloginRouter = require('./routes/loginIn');
const contactRouter = require('./routes/contact')

app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', imageupload); // Route for image uploads
app.use('/api/login', loginRouter);
app.use('/api/bloggers', bloggerRouter);
app.use('/api/userlogin', userloginRouter);
app.use('/api/contact', contactRouter);


// // Start server local node.js
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://31.97.230.157:5000:${PORT}`);
});

// Security purpese of node.js | Domain name  Security
app.use(cors({
  origin: ['https://ankushinfotech.com'], // no trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));



//Security Generate purpese node.js | Admin login Security
// app.use(session({
//   secret: 'adminSecretKey',
//   resave: false,
//   saveUninitialized: true
// }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecureSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true, // true if using HTTPS
    sameSite: 'strict'
  }
}));

// npm install helmet
const helmet = require('helmet');
app.use(helmet());


// npm install express-rate-limit | Data Loading Limit 
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);



// const timerValidator = require('./routes/appointments')
// app.use('/api/monitor-log', timerValidator)
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());




// const cookieParser = require('cookie-parser');
// app.use(cookieParser());

// // ======= Enable CSRF Protection =======
// const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);

// // ======= Send CSRF Token to Client =======
// app.get('/api/csrf-token', (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });


// // ======= Core Middlewares =======
// app.use(express.urlencoded({ extended: true }));

// // ======= Secure Image Serving (⚠️ protected way) =======
// // If you want to protect uploaded files using auth middleware, use this
// const auth = require('./middleware/auth'); // Make sure this file exists
// app.use('/uploads/:filename', auth, (req, res) => {
//   const filePath = path.join(__dirname, 'uploads', req.params.filename);
//   res.sendFile(filePath, (err) => {
//     if (err) {
//       console.error(err);
//       res.status(404).send('File not found');
//     }
//   });
// });




// //DEWA Second Method Full Security Provider
// // // npm install express-validator
// // // const { body } = require('express-validator');
// // // router.post('/upload', [
// // //   body('title').isString().isLength({ min: 3 })
// // // ], uploadHandler);


// // server.js
// //require('dotenv').config(); // Load environment variables

// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const session = require('express-session');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const csrf = require('csurf');
// const cookieParser = require('cookie-parser');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ==================== Security Middleware ==================== //

// // Set secure headers
// app.use(helmet());

// // Limit repeated requests
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100, // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// // Enable cookie parsing (for CSRF)
// app.use(cookieParser());

// // Setup CORS: Allow only trusted origins
// app.use(cors({
//   origin: ['https://your-frontend.com'], // ✅ Your frontend domain
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

// // Parse JSON bodies
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Secure session cookies
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'yourSecureSecret',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     httpOnly: true,
//     secure: true, // true if using HTTPS
//     sameSite: 'strict'
//   }
// }));

// // Enable CSRF protection
// const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);

// // Serve CSRF token to client (frontend fetch this before any POST)
// app.get('/api/csrf-token', (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

// // Serve uploaded images statically (can be protected if needed)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ==================== Routes ==================== //
// const imageupload = require('./routes/imageupload');
// const appointmentRoutes = require('./routes/appointments');
// const loginRouter = require('./routes/loginIn');
// const auth = require('./middleware/auth').default; // ⚠️ Custom auth middleware (you need to create)

// // Protect private APIs with auth middleware
// app.use('/api/appointments', auth, appointmentRoutes); // Protected
// app.use('/api/users', imageupload); // Possibly protected
// app.use('/api/login', loginRouter); // Public
// app.use('/api/bloggers', auth, imageupload); // Protected
// app.use('/api/userlogin', loginRouter); // Public

// // ==================== Start Server ==================== //
// app.listen(PORT, () => {
//   console.log(`✅ Secure server running at http://localhost:${PORT}`);
// });
