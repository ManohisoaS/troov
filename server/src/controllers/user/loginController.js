const User = require("../../database/models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Authenticate a user by verifying their email and password.
 *
 * @async
 * @function
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} The HTTP response.
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({success:false, error: "Invalid email or password." });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({success:false, error: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send response to client
    res.status(200).json({success:true,  token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Server internal error" });
  }
};

module.exports = loginUser;
