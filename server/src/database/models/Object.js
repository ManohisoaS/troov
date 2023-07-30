const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Object model.
 * @typedef {Object} Object
 * @property {string} name.required - The name of the object.
 * @property {string} description.required - The description of the object.
 */

const objectSchema = new Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v != null;
      },
      message: "Name cannot be null",
    },
  },
  description: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v != null;
      },
      message: "Description cannot be null",
    },
  },
});

const Object = mongoose.model("Object", objectSchema);

module.exports = Object;
