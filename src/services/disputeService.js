const { Dispute, Order, User } = require('../models');

class DisputeService {
    async openDispute(userId, disputeData) {
        const { orderId, reason } = disputeData;
        if (!order) throw new Error('Order not found');

        if (order.buyerId !== userId && order.sellerId !== userId) {
            throw new Error('Not authorized to open dispute for this order');
        }

        if (order.status !== 'PAID_ESCROW_LOCKED' && order.status !== 'DELIVERED_PENDING_CONFIRMATION') {
            throw new Error('Can only dispute a paid or delivered order');
        }

        const dispute = await Dispute.create({
            orderId,
            createdBy: userId,
            reason,
            status: 'OPEN'
        });

        await order.update({ status: 'DISPUTED' });

        return dispute;
    }

    async resolveDispute(disputeId, resolutionData) {
        const dispute = await Dispute.findByPk(disputeId);
        if (!dispute) throw new Error('Dispute not found');
        if (dispute.status !== 'OPEN') throw new Error('Dispute already resolved');

        const { decision, resolutionNote } = resolutionData; // decision: 'REFUND' or 'RELEASE'
        const order = await Order.findByPk(dispute.orderId);

        if (decision === 'REFUND') {
            await order.update({ status: 'REFUNDED' });
            await dispute.update({
                status: 'RESOLVED_REFUNDED',
                resolutionNote,
                resolvedAt: new Date()
            });
        } else if (decision === 'RELEASE') {
            await order.update({
                status: 'RELEASED_TO_SELLER',
                releasedAt: new Date()
            });
            await dispute.update({
                status: 'RESOLVED_RELEASED',
                resolutionNote,
                resolvedAt: new Date()
            });
        } else {
            throw new Error('Invalid decision');
        }

        return dispute;
    }

    async getDispute(disputeId, userId, role) {
        const dispute = await Dispute.findByPk(disputeId, {
            include: [{ model: Order }]
        });

        if (!dispute) throw new Error('Dispute not found');

        if (role !== 'ADMIN' && dispute.createdBy !== userId && dispute.Order.sellerId !== userId) {
            throw new Error('Unauthorized');
        }

        return dispute;
    }

    async listDisputes(role, userId) {
        if (role === 'ADMIN') {
            return await Dispute.findAll({ include: [Order] });
        }
        // Filter disputes where user is creator or seller in the related order
        return await Dispute.findAll({
            include: [{
                model: Order,
                where: {
                    [require('sequelize').Op.or]: [
                        { buyerId: userId },
                        { sellerId: userId }
                    ]
                }
            }]
        });
    }
}

module.exports = new DisputeService();
