
const Order = require('../models/order'); 

const checkOrderOwnership = async (req, res, next) => {
    const { id } = req.params; 
    const userId = req.user.id; 
    const userRole = req.user.role; 

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        req.order = order;

        if (order.userId !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this order' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Error checking order ownership', error });
    }
};

module.exports = checkOrderOwnership;
