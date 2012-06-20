var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var db = mongoose.connect('mongodb://localhost/projectcodename');

var Campaign = new Schema();

Campaign.add({
  title: String,
  script: String
});

db.model('Campaign', Campaign);

module.exports = db.model('Campaign');
