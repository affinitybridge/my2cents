var mongoose = require('mongoose'),
    config = require('./config');

module.exports = mongoose.connect(process.env.MONGOLAB_URI || config.mongodb_url);
