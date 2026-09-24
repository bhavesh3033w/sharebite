const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

router.post(
  '/certificate',
  upload.single('certificate'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: 'No file uploaded'
        });
      }

      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'sharebite/documents',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);

            return res.status(500).json({
              message: 'Cloudinary upload failed',
              error: error.message
            });
          }

          res.status(200).json({
            message: 'File uploaded successfully',
            filePath: result.secure_url
          });
        }
      );

      stream.end(req.file.buffer);

    } catch (error) {
      console.error('Upload error:', error);

      res.status(500).json({
        message: error.message
      });
    }
  }
);

module.exports = router;