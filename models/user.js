var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    db = require('../db'),
    bcrypt = require('bcrypt');

var User = new Schema();

User.add({
  username: {type: String, unique: true},
  password: String
});

User.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

db.model('User', User);

module.exports = db.model('User');
