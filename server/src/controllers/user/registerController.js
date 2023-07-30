const User = require("../../database/models/User");

/**
 * Register a new user with a unique email and password.
 *
 * @async
 * @function
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.body.email - user email
 * @param {string} req.body.password - user password
 * @returns {object} Express response
 */
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Create a new user
    const newUser = new User({ email, password });
    await newUser.save();
    return res.status(201).json({ success: true });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email)
      return res
        .status(400)
        .json({ success: false, error: "This email is already in use" });
    else if (
      error.name === "ValidationError" &&
      error.errors.email &&
      error.errors.email.kind === "required"
    )
      return res
        .status(400)
        .json({ success: false, error: "Email is required" });
    else if (
      error.name === "ValidationError" &&
      error.errors.password &&
      error.errors.password.kind === "required"
    )
      return res
        .status(400)
        .json({ success: false, error: "Password is required" });
    else if (
      error.name === "ValidationError" &&
      error.errors.email &&
      error.errors.email.kind === "user defined"
    )
      return res
        .status(400)
        .json({ success: false, error: "Invalid email address" });
    else {
      return res
        .status(500)
        .json({ success: false, error: "Server internal error" });
    }
  }
};

module.exports = registerUser;
