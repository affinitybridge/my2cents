var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    db = require('../db');

var User = new Schema();

User.add({
  username: {type: String, unique: true},
  password: String
});

User.methods.validPassword = function (password) {
  return this.password == password;
}

db.model('User', User);

module.exports = db.model('User');
