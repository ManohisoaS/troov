const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

/**
 * User model.
 * @typedef {Object} User
 * @property {string} email.required - The email of the user.
 * @property {string} password.required - The hashed password of the user.
 */

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        // Check if the email address is valid
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // eslint-disable-line no-useless-escape
        return regex.test(value);
      },
      message: props => `${props.value} is not a valid email address!`
    },
  },
  password: {
    type: String,
    required: true,
  },
});


/**
 * Hashes the password before saving it to the database.
 * @function
 * @param {string} password  - The plain password to crypt.
 * @returns {string} - The password hashed.
 */
function hashPassword(password) {
    const saltRounds = 10;
    return  bcrypt.hashSync(password, saltRounds);
}

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = hashPassword(this.password);
  }  
  next();
} );

const User = mongoose.model("User", userSchema);

module.exports = User;