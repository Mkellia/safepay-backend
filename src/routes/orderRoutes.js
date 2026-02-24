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

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and escrow workflow
 */

// All order routes are protected
router.use(protect);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order (Buyer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sellerId
 *               - amount
 *             properties:
 *               sellerId:
 *                 type: string
 *                 format: uuid
 *               amount:
 *                 type: number
 *               itemName:
 *                 type: string
 *               otp:
 *                 type: string
 *                 description: Optional 6-digit OTP. If not provided, one will be generated.
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post('/', authorize('BUYER'), validate(createOrderSchema), orderController.createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: List my orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders retrieved
 */
router.get('/', orderController.listMyOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Order details retrieved
 */
router.get('/:id', orderController.getOrder);

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   post:
 *     summary: Mark order as paid (Buyer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [Mobile Money, Bank Transfer]
 *               paymentRef:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order marked as paid
 */
router.post('/:id/pay', authorize('BUYER'), validate(payOrderSchema), orderController.payOrder);

/**
 * @swagger
 * /api/orders/{id}/confirm:
 *   post:
 *     summary: Confirm delivery via OTP (Buyer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Delivery confirmed
 */
router.post('/:id/confirm', authorize('BUYER'), validate(confirmDeliverySchema), orderController.confirmDelivery);

/**
 * @swagger
 * /api/orders/{id}/release:
 *   post:
 *     summary: Release funds to seller (Buyer or Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Funds released to seller
 */
router.post('/:id/release', orderController.releaseFunds);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   post:
 *     summary: Cancel order (Before payment)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 */
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router;
