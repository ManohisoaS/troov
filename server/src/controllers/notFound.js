function notFoundController(req, res) {
  res.status(404).json({
    message: "Page not found",
  });
}

module.exports = notFoundController;
