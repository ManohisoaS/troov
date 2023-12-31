const Object = require("../../database/models/Object");

/**
 * Delete an object with the specified ID.
 * @async
 * @function
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.params.id - ID of object to delete
 * @returns {object}  -  Returns a JSON response with the deleted object
 */
async function deleteObject(req, res) {
  const objectId = req.params.id;
  try {
    const deletedObject = await Object.findByIdAndDelete(objectId);
    // if object is not found
    if (!deletedObject) {
      return res
        .status(400)
        .json({ success: false, error: "Object is not found" });
    }
    res.json({ success: true, deletedObject });
  } catch (err) {
    if (err.kind && err.kind === "ObjectId") {
      return res
        .status(400)
        .send({ success: false, error: "Object ID invalid" });
    }
    res.status(500).send({ success: false, error: "Internal server error" });
  }
}

module.exports = deleteObject;
