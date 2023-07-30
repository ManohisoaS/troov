const express = require("express");
const router = express.Router();

const registerController = require("../controllers/user/registerController");
const loginController = require("../controllers/user/loginController");

router.post("/register", registerController);
router.post("/login", loginController);

module.exports = router;
