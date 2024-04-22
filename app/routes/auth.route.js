const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.route("/login").post(authController.login);
router.route("/register").post(authController.register);
router.route("/refresh").post(authController.refresh);

module.exports = router;
