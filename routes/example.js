var Campaign = require('../models/campaign');

module.exports = function (app) {
  app.get('/example/:id', function (req, res) {
    Campaign.findById(req.params.id, function (err, campaign) {
      if (err) {
        throw err;
      }
      else if (campaign) {
        res.render('example', {
          pageTitle: campaign.title,
          campaign: campaign
        });
      }
      else {
        res.send('404', 404);
      }
    });
  });
};
