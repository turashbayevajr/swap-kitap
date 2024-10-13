// /Users/azhar/Desktop/swap-kitap/seed.js

const sequelize = require('../config/db');
const Filial = require('../models/filial');


const seedFilials = async () => {
    const filials = [
        { address: '123 Main St', city: 'New York' },
        { address: '456 Elm St', city: 'Los Angeles' },
        { address: '789 Oak St', city: 'Chicago' },
        { address: '321 Pine St', city: 'Houston' },
    ];

    try {
        await sequelize.sync(); // Ensure the database is synced
        await Filial.bulkCreate(filials);
        console.log('Filials seeded successfully');
    } catch (error) {
        console.error('Error seeding filials:', error);
    } finally {
        await sequelize.close(); // Close the connection after seeding
    }
};

seedFilials();
