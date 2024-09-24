const express = require('express');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');
require('dotenv').config();

const app = express();
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);


sequelize.authenticate()
    .then(() => {
       console.log('Database connected successfully');
    })
    .catch(err => {
       console.error('Unable to connect to the database:', err);
    });

// Connect to database and start server
sequelize.sync().then(() => {
   app.listen(2304, () => {
      console.log('Server running on port 2304');
   });
}).catch(error => {
   console.log('Error connecting to the database:', error);
});

