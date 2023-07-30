const express = require("express");
const router = express.Router();

const createController = require("../controllers/object/createController");

// Add new object
router.post("/object", createController);

module.exports = router;
