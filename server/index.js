const express = require('express');
const sequelize = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');
const orderRoutes = require('./routes/order');
const filialRoutes = require('./routes/filial'); 
const Filial = require('./models/filial');
const Order = require('./models/order');
require('dotenv').config();

const app = express();
app.use(cors({
   origin: 'http://localhost:3000', // Replace with your frontend URL
   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/filials', filialRoutes); 

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');

        // Sync Filial model first
        await Filial.sync(); // Ensure the Filial table is created
        await Order.sync(); // Now sync the Order model
        console.log('Database synced successfully');

        // Start the server
        app.listen(process.env.PORT || 2304, () => {
            console.log(`Server running on port ${process.env.PORT || 2304}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

connectDatabase();
