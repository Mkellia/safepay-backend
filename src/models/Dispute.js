const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dispute = sequelize.define('Dispute', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('OPEN', 'RESOLVED_REFUNDED', 'RESOLVED_RELEASED'),
        defaultValue: 'OPEN',
    },
    resolutionNote: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

module.exports = Dispute;
