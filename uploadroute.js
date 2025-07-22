const express = require("express");
const router = express.Router();
const upload = require("./uploadconfig");
const verifyToken = require("./authmiddleware");

router.post("/upload", verifyToken, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File not uploaded" });
  }

  res.status(200).json({
    message: "File uploaded successfully!",
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    path: req.file.path,
  });
});

module.exports = router;