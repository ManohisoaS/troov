const express = require("express");
const router = express.Router();

const authenticateToken = require("../utils/authentication");
const createController = require("../controllers/object/createController");
const getController = require("../controllers/object/getController");
const updateController = require("../controllers/object/updateController");

// create new object
router.post("/object", authenticateToken, createController);
router.get("/objects", authenticateToken, getController);
router.put("/object/:id", authenticateToken, updateController);

module.exports = router;
