// /Users/azhar/Desktop/swap-kitap/server/models/filial.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Filial = sequelize.define('Filial', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically
});

module.exports = Filial;
