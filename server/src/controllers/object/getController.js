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
    res.json({success:true, list:objects});
  } catch (err) {
    console.error(err.message);
    res.status(500).send({success:false, error:"Internal server error"});
  }
}

module.exports = getObjects;
