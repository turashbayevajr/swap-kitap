// /Users/azhar/Desktop/swap-kitap/server/models/order.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Ensure you have a Users model defined
            key: 'id',
        },
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Books', // Ensure you have a Books model defined
            key: 'id',
        },
    },
    filialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Filials', // Reference to the Filial model
            key: 'id',
        },
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Processing', 'Completed', 'Canceled'),
        allowNull: false,
        defaultValue: 'Pending', // Default value is 'Pending'
    },
}, {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically
});

module.exports = Order;
