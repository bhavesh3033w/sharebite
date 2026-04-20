const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({

 destination: function(req, file, cb) {

   cb(null, '/tmp'); // Render-safe temp folder

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
     filePath: req.file.path
   });

 }
);

module.exports = router;