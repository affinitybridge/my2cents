var Campaign = require('../models/campaign');

module.exports = function (app) {
  app.get('/', function (req, res) {
    Campaign.find({}, function (err, campaigns) {
      if (err) {
        throw err;
      }
      res.render('root', {
        pageTitle: 'My2Cents',
        campaigns: campaigns
      });
    });
  });
};
