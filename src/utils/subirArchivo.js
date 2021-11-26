const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/img/'));
  },

  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5000000, // 5000000 Bytes = 5 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('El formato del archivo no es compatible'));
    }
    cb(undefined, true);
  },
});
module.exports = imageUpload;
