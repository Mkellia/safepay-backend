const express = require('express');
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { z } = require('zod');

const router = express.Router();

// Validation Schemas
const createOrderSchema = z.object({
    body: z.object({
        sellerId: z.string().uuid(),
        amount: z.number().positive(),
        itemName: z.string().optional(),
        otp: z.string().length(6).optional()
    })
});

const payOrderSchema = z.object({
    body: z.object({
        paymentMethod: z.enum(['Mobile Money', 'Bank Transfer']),
        paymentRef: z.string().optional()
    })
});

const confirmDeliverySchema = z.object({
    body: z.object({
        otp: z.string().length(6)
    })
});

// All order routes are protected
router.use(protect);

router.post('/', authorize('BUYER'), validate(createOrderSchema), orderController.createOrder);
router.get('/', orderController.listMyOrders);
router.get('/:id', orderController.getOrder);
router.post('/:id/pay', authorize('BUYER'), validate(payOrderSchema), orderController.payOrder);
router.post('/:id/confirm', authorize('BUYER'), validate(confirmDeliverySchema), orderController.confirmDelivery);
router.post('/:id/release', orderController.releaseFunds); // Buyer or Admin
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router;
