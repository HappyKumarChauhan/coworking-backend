const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Storage for KYC documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/kyc/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file 
});


// Upload KYC documents (Selfie & ID Card)
const uploadKYC = async (req, res) => {
  if (req.user.role !== 'PropertyOwner') {
    return res.status(403).json({ message: 'Only Property Owners can upload KYC documents' });
  }

  try {
    if (!req.files.selfie || !req.files.idCard) {
      return res.status(400).json({ message: 'Selfie and ID Card are required' });
    }

    // Store file paths in the database
    const user = await User.findById(req.user.id);
    user.kyc.selfie = `/uploads/kyc/${req.files.selfie[0].filename}`;
    user.kyc.idCard = `/uploads/kyc/${req.files.idCard[0].filename}`;
    user.kyc.isVerified = false; // Needs admin approval
    await user.save();

    res.json({ message: 'KYC documents uploaded successfully', kyc: user.kyc });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading KYC documents', error: error.message });
  }
};

// Verify KYC (Admin Only)
const verifyKYC = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Only admins can verify KYC documents' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.kyc.isVerified = true;
    await user.save();

    res.json({ message: 'KYC verified successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying KYC', error: error.message });
  }
};

module.exports = { uploadKYC, verifyKYC, upload };
