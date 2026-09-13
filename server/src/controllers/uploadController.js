import path from 'path';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Upload a product image
// @route   POST /api/upload
// @access  Private/Admin
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  res.status(201).json({
    message: 'Image uploaded',
    image: `/${req.file.path.split(path.sep).join('/')}`,
  });
});

export { uploadImage };
