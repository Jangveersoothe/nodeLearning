const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  reqPassReset,
  resetPassword,
} = require("./authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/request-password-reset", reqPassReset);
router.post("/resetpassword/:id/:token", resetPassword);

module.exports = router;