/**
 * Not found request.
 * @async
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - An objects with response header 404.
 */
function notFoundController(req, res) {
  res.status(404).json({
    message: "Page not found",
  });
}

module.exports = notFoundController;
