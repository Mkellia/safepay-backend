const userService = require('../services/userService');

const register = async (req, res, next) => {
    try {
        const user = await userService.register(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const login = async (req, res, next) => {
    try {
        const user = await userService.login(req.body);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

const getMe = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, data: req.user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getUser = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

const updateMe = async (req, res, next) => {
    try {
        // Prevent updating role or balance directly here
        const { role, isActive, ...updateData } = req.body;
        const user = await userService.updateUser(req.user.id, updateData);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deactivateMe = async (req, res, next) => {
    try {
        await userService.deactivateUser(req.user.id);
        res.status(200).json({ success: true, message: 'Account deactivated' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const createUser = async (req, res, next) => {
    try {
        const user = await userService.register(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    register,
    login,
    getMe,
    getUser,
    updateMe,
    updateUser,
    deactivateMe,
    createUser,
};
