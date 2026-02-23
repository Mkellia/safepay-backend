const { User } = require('../models');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

class UserService {
    async register(userData) {
        const { name, phone, email, password } = userData;
        const userExists = await User.findOne({ where: { phone } });
        if (userExists) {
            throw new Error('User with this phone number already exists');
        }
        const user = await User.create({ name, phone, email, password });
        return {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        };
    }

    async login(credentials) {
        const { identifier, password } = credentials; // identifier can be email or phone
        const user = await User.findOne({
            where: {
                [require('sequelize').Op.or]: [
                    { email: identifier },
                    { phone: identifier }
                ]
            }
        });

        if (user && (await user.comparePassword(password))) {
            if (!user.isActive) {
                throw new Error('Account is deactivated');
            }
            return {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            };
        } else {
            throw new Error('Invalid email/phone or password');
        }
    }

    async getUserById(id) {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) throw new Error('User not found');
        return user;
    }

    async updateUser(id, updateData) {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');

        // Prevent role escalation unless admin is doing it (handled in controller/middleware)
        return await user.update(updateData);
    }

    async deactivateUser(id) {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');
        return await user.update({ isActive: false });
    }

    async getAllUsers() {
        return await User.findAll({
            attributes: { exclude: ['password'] }
        });
    }
}

module.exports = new UserService();
