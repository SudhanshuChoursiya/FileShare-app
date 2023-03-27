require("dotenv").config();
const express = require("express");
const router = express.Router();
const { v4: uuid4 } = require("uuid");
const uploadFile = require("../models/upload.js");
const upload = require("../middleware/multer.js");

router.post("/upload", upload.single("myfile"), (req, res) => {
  if (req.fileValidationError) {
    return res.status(500).json({ msg: "invaild file type is selected" });
  }

  if (req.file.size > 2000000 * 100) {
    return res.status(500).json({ msg: "file size is too big" });
  }

  if (!req.file) {
    return res.status(500).json({ msg: "this field is required" });
  } else {
    const uploadfiles = new uploadFile({
      filename: req.file.filename,
      filepath: req.file.path,
      uuid: uuid4(),
      filesize: req.file.size,
    })
      .save()
      .then((response) => {
        res.status(201).json({
          msg: "sucess",
          url: `${process.env.BASE_URL}/files/download/${response.uuid}`,
          uuid: response.uuid,
        });
      })
      .catch((err) => {
        res.status(500).json({ msg: "Unexpted error occur" });
      });
  }
});

router.get("/file-info/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  const fileInfo = await uploadFile.findOne({ uuid: uuid });
  if (fileInfo) {
    res.status(201).json({ msg: "Upload success", fileDetails: fileInfo });
  } else {
    res.status(404).json({ msg: "No such file exists" });
  }
});

router.get("/download/:uuid", async (req, res) => {
  try {
    const file = await uploadFile.findOne({ uuid: req.params.uuid });
    const filepath = `${__dirname}/../${file.filepath}`;

    res.download(filepath);
  } catch (err) {
    res.status(501).json({ msg: "error occur while downloading" });
  }
});

module.exports = router;
