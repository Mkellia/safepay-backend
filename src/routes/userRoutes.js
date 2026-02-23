const express = require('express');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { z } = require('zod');

const router = express.Router();

// Validation Schemas
const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        phone: z.string().min(10),
        email: z.string().email().optional(),
        password: z.string().min(6),
        role: z.enum(['BUYER', 'SELLER']).optional()
    })
});

const loginSchema = z.object({
    body: z.object({
        identifier: z.string(), // email or phone
        password: z.string()
    })
});

// Public Routes
router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);

// Protected Routes
router.use(protect);

router.get('/me', userController.getMe);
router.put('/me', userController.updateMe);
router.delete('/me', userController.deactivateMe);

// Admin Only Routes
router.use(authorize('ADMIN'));
router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);

module.exports = router;
