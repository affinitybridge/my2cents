var crypto = require('crypto');

// Create a small (8 character) hash
module.exports.hash = function hash (msg, key) {
  return crypto
    .createHmac('sha256', key)
    .update(msg)
    .digest('hex')
    // shorten hash
    .substring(3,11);
};
