const express = require("express");
const router = express.Router();

const authenticateToken = require("../utils/authentication");
const createController = require("../controllers/object/createController");
const getController = require("../controllers/object/getController");
const updateController = require("../controllers/object/updateController");
const deletedObject = require("../controllers/object/deleteController");

// create new object
router.post("/object", authenticateToken, createController);
router.get("/objects", authenticateToken, getController.getObjects);
router.get("/object/:id", authenticateToken, getController.getObject);
router.put("/object/:id", authenticateToken, updateController);
router.delete("/object/:id", authenticateToken, deletedObject);

module.exports = router;
