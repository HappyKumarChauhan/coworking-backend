const express = require('express');
const { uploadKYC, verifyKYC, upload } = require('../controllers/kycController');
const { protect, ownerOnly, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

// Upload KYC images (Selfie & ID Card)
router.post('/upload', protect, ownerOnly, upload.fields([{ name: 'selfie' }, { name: 'idCard' }]), uploadKYC);

// Verify KYC (Admin only)
router.put('/:id/verify', protect, adminOnly, verifyKYC);

module.exports = router;
