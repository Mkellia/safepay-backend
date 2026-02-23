const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    buyerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    sellerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(20, 8), // For blockchain amounts
        allowNull: false,
    },
    itemName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM(
            'CREATED',
            'PAID_ESCROW_LOCKED',
            'DELIVERED_PENDING_CONFIRMATION',
            'RELEASED_TO_SELLER',
            'DISPUTED',
            'REFUNDED',
            'CANCELLED'
        ),
        defaultValue: 'CREATED',
    },
    otpHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    paymentRef: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    paidAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    releasedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

module.exports = Order;
