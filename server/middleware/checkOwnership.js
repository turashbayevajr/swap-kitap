const Book = require('../models/book'); // Adjust the path as necessary

const checkOwnership = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role; // Assuming user role is stored in req.user.role

    try {
        const book = await Book.findByPk(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Attach the book instance to the request
        req.book = book;

        // Check if the user is the owner of the book or an admin
        if (book.userId !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this book' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Error checking ownership', error });
    }
};

module.exports = checkOwnership;
