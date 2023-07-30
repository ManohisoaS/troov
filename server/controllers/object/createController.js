const Object = require("../../database/models/Object");

/**
 * Creates a new object with the name and description provided in the request body
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns a JSON response with the newly created object or a 400 error if creation failed
 */
async function createObject(req, res) {
  try {
    const { name, description } = req.body;
    const newObject = await Object.create({ name, description });

    res.status(201).json({ success: true, newObject });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

module.exports = createObject;
