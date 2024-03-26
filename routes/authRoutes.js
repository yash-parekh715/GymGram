const express = require("express");
const {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controllers/authControllers");
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.patch("/forgetPassword", updateUser);
router.delete("/deleteAccount", deleteUser);

module.exports = router;
