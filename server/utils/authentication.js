const jwt = require("jsonwebtoken");
const User = require("../database/models/User");

/**
 * Middleware function to authenticate a user's token using JSON Web Token (JWT)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {function} next - Callback function to proceed to the next middleware in the chain
 * @returns {Promise<void>} - Returns a 401 error if the token is invalid, missing, or expired, otherwise calls the next() callback function
 */
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, error: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, error: "Token expired" });
    }

    res.status(401).json({ success: false, error: "Invalid token" });
  }
}

module.exports = authenticateToken;
