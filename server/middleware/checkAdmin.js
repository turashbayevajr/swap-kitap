
const checkAdmin = (req, res, next) => {
    const userRole = req.user.role; 

    if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action' });
    }

    next();
};

module.exports = checkAdmin;
