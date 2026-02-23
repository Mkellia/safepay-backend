const { Order, User } = require('../models');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class OrderService {
    async createOrder(buyerId, orderData) {
        const { sellerId, amount, itemName, otp } = orderData;

        // Validate seller exists and is a seller
        const seller = await User.findByPk(sellerId);
        if (!seller || seller.role !== 'SELLER') {
            throw new Error('Invalid seller');
        }

        // Generate or use provided OTP
        const plainOtp = otp || crypto.randomInt(100000, 999999).toString();
        const otpHash = await bcrypt.hash(plainOtp, 10);

        const order = await Order.create({
            buyerId,
            sellerId,
            amount,
            itemName,
            otpHash,
            status: 'CREATED'
        });

        return {
            order,
            otp: otp ? undefined : plainOtp // Return plain OTP only if we generated it
        };
    }

    async getOrder(orderId, userId, role) {
        const order = await Order.findByPk(orderId, {
            include: [
                { model: User, as: 'buyer', attributes: ['id', 'name', 'phone'] },
                { model: User, as: 'seller', attributes: ['id', 'name', 'phone'] }
            ]
        });

        if (!order) throw new Error('Order not found');

        // IDOR Protection
        if (role !== 'ADMIN' && order.buyerId !== userId && order.sellerId !== userId) {
            throw new Error('Not authorized to view this order');
        }

        return order;
    }

    async listUserOrders(userId, role) {
        let where = {};
        if (role === 'BUYER') where = { buyerId: userId };
        else if (role === 'SELLER') where = { sellerId: userId };
        else if (role !== 'ADMIN') throw new Error('Unauthorized');

        return await Order.findAll({
            where,
            include: [
                { model: User, as: 'buyer', attributes: ['id', 'name'] },
                { model: User, as: 'seller', attributes: ['id', 'name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
    }

    async markAsPaid(orderId, userId, paymentData) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');
        if (order.buyerId !== userId) throw new Error('Only buyer can pay for the order');
        if (order.status !== 'CREATED') throw new Error('Order is not in CREATED status');

        const { paymentMethod, paymentRef } = paymentData;

        return await order.update({
            status: 'PAID_ESCROW_LOCKED',
            paymentMethod,
            paymentRef,
            paidAt: new Date()
        });
    }

    async confirmDelivery(orderId, userId, otp) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');
        if (order.buyerId !== userId) throw new Error('Only buyer can confirm delivery');
        if (order.status !== 'PAID_ESCROW_LOCKED') throw new Error('Order must be paid first');

        const isMatch = await bcrypt.compare(otp, order.otpHash);
        if (!isMatch) throw new Error('Invalid OTP');

        return await order.update({
            status: 'DELIVERED_PENDING_CONFIRMATION'
        });
    }

    async releaseFunds(orderId, userId, role) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        // Allowed if buyer releases OR admin releases
        if (role !== 'ADMIN' && order.buyerId !== userId) {
            throw new Error('Unauthorized to release funds');
        }

        if (order.status !== 'DELIVERED_PENDING_CONFIRMATION' && role !== 'ADMIN') {
            throw new Error('Delivery must be confirmed via OTP first');
        }

        return await order.update({
            status: 'RELEASED_TO_SELLER',
            releasedAt: new Date()
        });
    }

    async cancelOrder(orderId, userId, role) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        if (role !== 'ADMIN' && order.buyerId !== userId && order.sellerId !== userId) {
            throw new Error('Unauthorized');
        }

        if (order.status !== 'CREATED') {
            throw new Error('Cannot cancel order after payment');
        }

        return await order.update({ status: 'CANCELLED' });
    }
}

module.exports = new OrderService();
