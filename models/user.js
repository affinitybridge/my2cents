var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    db = require('../db'),
    bcrypt = require('bcrypt');

var User = new Schema();

User.add({
  username: {type: String, unique: true},
  password: String
});

User.methods.validPassword = function (password, callback) {
  return bcrypt.compare(password, this.password, function(err, match) {
    if (err) {
      throw err;
    }
    return callback(null, match);
  });
};

db.model('User', User);

module.exports = db.model('User');
