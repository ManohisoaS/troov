const express = require("express");
const router = express.Router();

const authenticateToken = require("../utils/authentication");
const createController = require("../controllers/object/createController");

// create new object
router.post("/object", authenticateToken, createController);

module.exports = router;
