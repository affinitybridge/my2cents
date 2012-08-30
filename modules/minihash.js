var crypto = require('crypto');

module.exports.hash = function hash (msg, key) {
  return crypto
    .createHmac('sha256', key)
    .update(msg)
    .digest('hex')
    // shorten hash
    .substring(3,11);
};
