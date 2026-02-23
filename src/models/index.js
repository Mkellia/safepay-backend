const sequelize = require('../config/database');
const User = require('./User');
const Order = require('./Order');
const Dispute = require('./Dispute');

// User <-> Order
User.hasMany(Order, { as: 'boughtOrders', foreignKey: 'buyerId' });
User.hasMany(Order, { as: 'soldOrders', foreignKey: 'sellerId' });
Order.belongsTo(User, { as: 'buyer', foreignKey: 'buyerId' });
Order.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });

// Order <-> Dispute
Order.hasOne(Dispute, { foreignKey: 'orderId' });
Dispute.belongsTo(Order, { foreignKey: 'orderId' });

// User <-> Dispute (Creator)
User.hasMany(Dispute, { foreignKey: 'createdBy' });
Dispute.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });

module.exports = {
    sequelize,
    User,
    Order,
    Dispute,
};
