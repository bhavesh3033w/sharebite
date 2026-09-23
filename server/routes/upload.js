const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({

  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },

  filename: function(req, file, cb) {
    cb(
      null,
      Date.now() + '-' + file.originalname
    );
  }

});

const upload = multer({
  storage: storage
});

router.post(
  '/certificate',
  upload.single('certificate'),
  (req, res) => {

    console.log(req.file);

    res.json({
      filePath: `/uploads/${req.file.filename}`
    });

  }
);

module.exports = router;