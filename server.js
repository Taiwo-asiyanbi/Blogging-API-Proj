require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/database');

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));



// Connect to database 
connectDB();

console.log("MONGO_URI:", process.env.MONGO_URI);

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("MongoDB Atlas connected"))
// .catch(err => console.error("MongoDB connection error:", err));




// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Taiwo Blogging API',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        signin: 'POST /api/auth/signin'
      },
      blogs: {
        getAll: 'GET /api/blogs',
        getById: 'GET /api/blogs/:id',
        create: 'POST /api/blogs (authenticated)',
        getUserBlogs: 'GET /api/blogs/user/me (authenticated)',
        update: 'PUT /api/blogs/:id (authenticated)',
        updateState: 'PATCH /api/blogs/:id/state (authenticated)',
        delete: 'DELETE /api/blogs/:id (authenticated)'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});


const PORT = process.env.PORT || 4800;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});


module.exports = app;
