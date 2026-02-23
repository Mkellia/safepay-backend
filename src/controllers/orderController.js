const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
    try {
        const result = await orderService.createOrder(req.user.id, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getOrder = async (req, res) => {
    try {
        const order = await orderService.getOrder(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

const listMyOrders = async (req, res) => {
    try {
        const orders = await orderService.listUserOrders(req.user.id, req.user.role);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const payOrder = async (req, res) => {
    try {
        const order = await orderService.markAsPaid(req.params.id, req.user.id, req.body);
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const confirmDelivery = async (req, res) => {
    try {
        const { otp } = req.body;
        const order = await orderService.confirmDelivery(req.params.id, req.user.id, otp);
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const releaseFunds = async (req, res) => {
    try {
        const order = await orderService.releaseFunds(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const order = await orderService.cancelOrder(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrder,
    listMyOrders,
    payOrder,
    confirmDelivery,
    releaseFunds,
    cancelOrder
};
