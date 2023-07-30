/**
 * Not found request.
 * @async
 * @function
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - An objects with response header 404
 */
function notFoundController(req, res) {
  res.status(404).json({
    message: "Page not found",
  });
}

module.exports = notFoundController;
