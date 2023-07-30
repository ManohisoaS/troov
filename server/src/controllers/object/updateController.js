const Object = require("../../database/models/Object");

/**
 * Updates an object with the specified ID.
 * @async
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>}  -  Returns a JSON response with the updated object.
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
