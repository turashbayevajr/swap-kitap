// /Users/azhar/Desktop/swap-kitap/server/routes/filial.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Filial = require('../models/filial');
const authenticateToken = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');

// Admin creates a new filial
router.post('/', authenticateToken, checkAdmin, [
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('postalCode').notEmpty().withMessage('Postal code is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address, city, postalCode } = req.body;

    try {
        const newFilial = await Filial.create({ address, city, postalCode });
        return res.status(201).json({ message: 'Filial created successfully', filial: newFilial });
    } catch (error) {
        console.error('Error creating filial:', error);
        return res.status(500).json({ message: 'Error creating filial', error: error.message });
    }
});

// Admin retrieves all filials
router.get('/', async (req, res) => {
    try {
        const filials = await Filial.findAll();
        return res.status(200).json(filials);
    } catch (error) {
        console.error('Error retrieving filials:', error);
        return res.status(500).json({ message: 'Error retrieving filials', error: error.message });
    }
});

// Admin updates a filial by ID
router.put('/:id', authenticateToken, checkAdmin, async (req, res) => {
    const { id } = req.params;
    const { address, city, postalCode } = req.body;

    try {
        const filial = await Filial.findByPk(id);
        if (!filial) {
            return res.status(404).json({ message: 'Filial not found' });
        }

        // Update the filial fields
        if (address) filial.address = address;
        if (city) filial.city = city;
        if (postalCode) filial.postalCode = postalCode;

        const updatedFilial = await filial.save();
        return res.status(200).json({ message: 'Filial updated successfully', filial: updatedFilial });
    } catch (error) {
        console.error('Error updating filial:', error);
        return res.status(500).json({ message: 'Error updating filial', error: error.message });
    }
});

// Admin deletes a filial by ID
router.delete('/:id', authenticateToken, checkAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const filial = await Filial.findByPk(id);
        if (!filial) {
            return res.status(404).json({ message: 'Filial not found' });
        }

        await filial.destroy();
        return res.status(200).json({ message: 'Filial deleted successfully' });
    } catch (error) {
        console.error('Error deleting filial:', error);
        return res.status(500).json({ message: 'Error deleting filial', error: error.message });
    }
});

module.exports = router;
