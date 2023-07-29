const express = require("express");
const router = express.Router();

const registerController = require("../controllers/user/registerController");


router.post("/register", registerController);

module.exports = router;
