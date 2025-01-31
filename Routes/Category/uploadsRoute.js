// First install cloudinary: npm install cloudinary
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer to use memory storage instead of disk
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Handle file upload
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Convert buffer to base64
    const fileStr = req.file.buffer.toString('base64');
    const fileType = req.file.mimetype;
    
    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(
      `data:${fileType};base64,${fileStr}`,
      {
        folder: 'your-app-name', // Optional: organize uploads in folders
        resource_type: 'auto',
        transformation: [
          { quality: 'auto:good' }, // Optional: optimize image quality
          { fetch_format: 'auto' }  // Optional: automatically deliver in best format
        ]
      }
    );

    // Return the Cloudinary URL
    res.json({
      success: true,
      imageUrl: uploadResponse.secure_url,
      publicId: uploadResponse.public_id // Store this if you need to delete the image later
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file to Cloudinary'
    });
  }
});

// Optional: Add route to delete images from Cloudinary
router.delete('/delete/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await cloudinary.uploader.destroy(publicId);
    
    res.json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file from Cloudinary'
    });
  }
});

module.exports = router;