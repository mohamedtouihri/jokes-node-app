const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const app = express();
const port = 4700;

// Middleware for parsing JSON bodies
app.use(express.json());

app.use(cors());

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
require('./config/passport');
// Routes
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/jokes', require('./routes/joke.route'));
app.use('/api/me', require('./routes/users.route'));

// Connect to MongoDB 
mongoose 
  .connect('mongodb+srv://admin:admin@cluster0.51f92ku.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
