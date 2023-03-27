//multer middleware
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const fileExt = file.originalname.split(".").pop();

    cb(null, Date.now() + "." + fileExt);
  },
});

const fileFilter = function (req, file, cb) {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype.startsWith("application")
  ) {
    cb(null, true);
  } else {
    req.fileValidationError = "file type is invalid";
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limit: {
    fileSize: 2000000 * 100,
  },
});

module.exports = upload;
