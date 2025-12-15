const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  changePassword,
} = require("../controllers/Auth");

const { auth } = require("../middleware/auth");

// auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/changepassword", auth, changePassword);

module.exports = router;
