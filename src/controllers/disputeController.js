const disputeService = require('../services/disputeService');

const openDispute = async (req, res) => {
    try {
        const { orderId, reason } = req.body;
        const dispute = await disputeService.openDispute(req.user.id, orderId, reason);
        res.status(201).json({ success: true, data: dispute });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const resolveDispute = async (req, res) => {
    try {
        const dispute = await disputeService.resolveDispute(req.params.id, req.body);
        res.status(200).json({ success: true, data: dispute });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getDispute = async (req, res) => {
    try {
        const dispute = await disputeService.getDispute(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ success: true, data: dispute });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

const listDisputes = async (req, res) => {
    try {
        const disputes = await disputeService.listDisputes(req.user.role, req.user.id);
        res.status(200).json({ success: true, data: disputes });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    openDispute,
    resolveDispute,
    getDispute,
    listDisputes
};
