var mongoose = require("mongoose");

/**
 * Connect to a mongodb URL
 *
 * @param {string} url - The connection URL to the MongoDB database.
 * @param {Object} [options] - The connection options to the MongoDB database.
 * @returns {Promise<mongoose.Connection>} A promise that resolves with an object `mongoose.Connection` representing the connection to the MongoDB database.
 * @throws {Error} Throws an error if the connection to the MongoDB database fails.
 */
async function connect(url, options = {}) {
  try {
    // Connects to the MongoDB database using Mongoose.
    return await mongoose.connect(url, options);
  } catch (error) {
    console.error("Error while trying to MongoDB database:", error);
    throw error;
  }
}

module.exports = connect;
