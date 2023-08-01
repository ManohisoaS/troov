const Object = require("../../database/models/Object");

/**
 * Retrieves a list of objects.
 * @async
 * @function
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - Returns a JSON response with an array of objects.
 */
async function getObjects(req, res) {
  try {
    const objects = await Object.find();
    res.json({ success: true, list: objects });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, error: "Internal server error" });
  }
}

/**
 * Retrieve an object by id.
 * @async
 * @function
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 *  * @param {string} req.params.id - ID of object to update
 * @returns {object} - Returns a JSON response with the object.
 */
async function getObject(req, res) {
  const objectId = req.params.id;
  try {
    const object = await Object.findById(objectId);

    // if object is not found
    if (!object) {
      return res.status(400).json({ success: false, error: "Object is not found" });
    }

    res.json({ success: true, object });
  } catch (err) {
    if (err.kind && err.kind === "ObjectId") {
      return res.status(400).send({ success: false, error: "Object ID invalid" });
    }
    res.status(500).send({ success: false, error: "Internal server error" });
  }
}

module.exports = { getObjects, getObject };
