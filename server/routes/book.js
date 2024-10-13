const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Book = require('../models/book');
// const checkOwnership = require('../middleware/checkOwnership');
const authenticateToken = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');
const upload= require("../middleware/upload");
router.use(authenticateToken); 


router.get('/', async (req, res) => {
    try {
        const books = await Book.findAll();
        return res.status(200).json(books);
    } catch (error) {
        console.error('Error retrieving books:', error);
        return res.status(500).json({ message: 'Error retrieving books', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findByPk(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        return res.status(200).json(book);
    } catch (error) {
        console.error('Error retrieving book:', error);
        return res.status(500).json({ message: 'Error retrieving book', error: error.message });
    }
});

// Middleware to validate book creation and updating
const validateBook = [
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('genre').notEmpty().withMessage('Genre is required'),
];

// Admin routes for book management (only accessible to admins)
router.post('/', checkAdmin, upload, validateBook, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, genre } = req.body;
    
    // Get the path of the uploaded photo
    const photo = req.file ? req.file.path : null; // Handle if no file is uploaded

    try {
        const newBook = await Book.create({ title, author, genre, userId: req.user.id, photo });
        return res.status(201).json({ message: 'Book created successfully', book: newBook });
    } catch (error) {
        console.error('Error creating book:', error);
        return res.status(500).json({ message: 'Error creating book', error: error.message });
    }
});

// Update a book by ID (authentication and admin check required)
router.put('/:id', checkAdmin, upload, validateBook, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, author, genre } = req.body;
    
    // Get the path of the uploaded photo
    const photo = req.file ? req.file.path : null; // Handle if no file is uploaded

    try {
        const book = await Book.findByPk(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const updatedBook = await book.update({ title, author, genre, photo });
        return res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        console.error('Error updating book:', error);
        return res.status(500).json({ message: 'Error updating book', error: error.message });
    }
});


router.delete('/:id', checkAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        await book.destroy();
        return res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        return res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
});

module.exports = router;
