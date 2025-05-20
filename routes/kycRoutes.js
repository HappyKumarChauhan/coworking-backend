const express = require('express');
const { uploadKYC, verifyKYC, upload } = require('../controllers/kycController');
const { protect, ownerOnly, protectAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Upload KYC images (Selfie & ID Card)
router.post('/upload', protect, ownerOnly, upload.fields([{ name: 'selfie' }, { name: 'idCard' }]), uploadKYC);

// Verify KYC (Admin only)
router.put('/:id/verify', protect, protectAdmin, verifyKYC);

module.exports = router;
