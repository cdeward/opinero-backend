const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Saving file to uploads...');
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    console.log('Incoming file:', file.originalname);
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = upload;
