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

// Dispute routes require authentication
router.use(protect);

router.post('/', validate(openDisputeSchema), disputeController.openDispute);
router.get('/', disputeController.listDisputes);
router.get('/:id', disputeController.getDispute);

// Admin Only
router.post('/:id/resolve', authorize('ADMIN'), validate(resolveDisputeSchema), disputeController.resolveDispute);

module.exports = router;
