const Object = require("../../database/models/Object");

/**
 * Creates a new object with the name and description provided in the request body
 * @async
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.body.name - Name of new object
 * @param {string} req.body.description - Descritpion of new object
 * @returns {object} - Returns a JSON response with the newly created object or a 400 error if creation failed
 */
async function createObject(req, res) {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res
        .status(400)
        .json({ success: false, error: "Name and description are required" });
    }

    const newObject = await Object.create({ name, description });

    res.status(201).json({ success: true, newObject });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

module.exports = createObject;
