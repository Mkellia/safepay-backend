const express = require('express');
const disputeController = require('../controllers/disputeController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { z } = require('zod');

const router = express.Router();

// Validation Schemas
const openDisputeSchema = z.object({
    body: z.object({
        orderId: z.string().uuid(),
        reason: z.string().min(10)
    })
});

const resolveDisputeSchema = z.object({
    body: z.object({
        decision: z.enum(['REFUND', 'RELEASE']),
        resolutionNote: z.string().min(5).optional()
    })
});

/**
 * @swagger
 * tags:
 *   name: Disputes
 *   description: Dispute management and resolution
 */

// Dispute routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/disputes:
 *   post:
 *     summary: Open a new dispute
 *     tags: [Disputes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - reason
 *             properties:
 *               orderId:
 *                 type: string
 *                 format: uuid
 *               reason:
 *                 type: string
 *                 minLength: 10
 *     responses:
 *       201:
 *         description: Dispute opened successfully
 */
router.post('/', validate(openDisputeSchema), disputeController.openDispute);

/**
 * @swagger
 * /api/disputes:
 *   get:
 *     summary: List disputes
 *     tags: [Disputes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of disputes retrieved
 */
router.get('/', disputeController.listDisputes);

/**
 * @swagger
 * /api/disputes/{id}:
 *   get:
 *     summary: Get dispute details by ID
 *     tags: [Disputes]
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
 *         description: Dispute details retrieved
 */
router.get('/:id', disputeController.getDispute);

// Admin Only
/**
 * @swagger
 * /api/disputes/{id}/resolve:
 *   post:
 *     summary: Resolve a dispute (Admin only)
 *     tags: [Disputes]
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
 *               - decision
 *             properties:
 *               decision:
 *                 type: string
 *                 enum: [REFUND, RELEASE]
 *               resolutionNote:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dispute resolved successfully
 */
router.post('/:id/resolve', authorize('ADMIN'), validate(resolveDisputeSchema), disputeController.resolveDispute);

module.exports = router;
