const Object = require("../../database/models/Object");

/**
 * Updates an object with the specified ID.
 * @async
 * @function
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.params.id - ID of object to update
 * @param {string} [req.body.name] - New name of object
 * @param {string} [req.body.description] - New description of new object
 * @returns {object}  -  Returns a JSON response with the updated object
 */
async function updateObject(req, res) {
  const objectId = req.params.id;
  try {
    const { name, description } = req.body;
    const updatedObject = await Object.findByIdAndUpdate(
      objectId,
      { name, description },
      { new: true }
    );

    // if object is not found
    if(!updatedObject){
      return res.status(400).json({ success: false, error:"Object is not found" });
    }
    
    res.json({ success: true, updatedObject });
  } catch (err) {
    if(err.kind && err.kind === "ObjectId"){
      return res.status(400).send({ success: false, error: "Object ID invalid" });  
    }
    res.status(500).send({ success: false, error: "Internal server error" });
  }
}

module.exports = updateObject;
