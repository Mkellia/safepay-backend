require('dotenv').config();
const { User, sequelize } = require('./src/models');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced for seeding...');

        // Create Admin
        const admin = await User.create({
            name: 'Admin User',
            phone: '1234567890',
            email: 'admin@safepay.com',
            password: 'adminpassword',
            role: 'ADMIN'
        });
        console.log('Admin created');

        // Create Buyer
        const buyer = await User.create({
            name: 'John Buyer',
            phone: '0987654321',
            email: 'buyer@example.com',
            password: 'password123',
            role: 'BUYER'
        });
        console.log('Buyer created');

        // Create Seller
        const seller = await User.create({
            name: 'Jane Seller',
            phone: '1122334455',
            email: 'seller@example.com',
            password: 'password123',
            role: 'SELLER'
        });
        console.log('Seller created');

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
