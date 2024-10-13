// /Users/azhar/Desktop/swap-kitap/server/routes/order.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Order = require('../models/order');
const authenticateToken = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');
const checkOwnership = require('../middleware/checkOwnership'); // Import the ownership check

// User creates a new order
router.post('/', authenticateToken, async (req, res) => {
    const { userId, bookId, filialId } = req.body;

    try {
        const newOrder = await Order.create({ userId, bookId, filialId });
        return res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Error creating order', error: error.message });
    }
});

// User cancels or edits an order
router.put('/:id', authenticateToken, checkOwnership, async (req, res) => {
    const { id } = req.params;
    const { bookId, filialId } = req.body; // Fields to update

    try {
        const order = req.order; // Retrieved from checkOrderOwnership middleware

        // Check if the status is Pending
        if (order.status !== 'Pending') {
            return res.status(403).json({ message: 'Cannot edit or cancel order: status is not Pending' });
        }

        // Update fields
        if (bookId) order.bookId = bookId;
        if (filialId) order.filialId = filialId;

        const updatedOrder = await order.save();
        return res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ message: 'Error updating order', error: error.message });
    }
});

// Admin changes the status of an order
router.patch('/:id/status', authenticateToken, checkAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // New status value

    const validStatuses = ['Pending', 'Processing', 'Completed', 'Canceled'];

    // Validate the new status
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update status
        order.status = status;
        const updatedOrder = await order.save();
        return res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
});

// Admin deletes an order
router.delete('/:id', authenticateToken, checkAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the status is Canceled
        if (order.status !== 'Canceled') {
            return res.status(403).json({ message: 'Cannot delete order: status is not Canceled' });
        }

        await order.destroy();
        return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        return res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
});

module.exports = router;
