// config/multerConfig.js
const multer = require("multer");
const { bucket } = require("./storageConfig");

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Hanya file PNG dan JPEG yang diperbolehkan!"));
  }
};
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // file size 5mb
  },
});
module.exports = upload;
