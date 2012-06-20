var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    db = require('../db');

var Campaign = new Schema();

Campaign.add({
  title: String,
  script: String
});

db.model('Campaign', Campaign);

module.exports = db.model('Campaign');
