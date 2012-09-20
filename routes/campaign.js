var Campaign = require('../models/campaign'),
    Capability = require('twilio').Capability;

module.exports = function (app, requireAuth) {
  // Present a form to create a campaign widget.
  app.get('/campaign/new', requireAuth, function (req, res) {
    res.render('campaigns/new', {
      pageTitle: 'Create a new Campaign',
      campaign: new Campaign()
    });
  });

  // Create a campaign widget.
  app.post('/campaign', requireAuth, function (req, res) {
    var campaign = new Campaign(req.body.campaign);
    campaign.save(function () {
      res.redirect('/campaign/' + campaign._id.toHexString());
    });
  });

  // Display a campaign widget in an iframe.
  app.get('/campaign/:id', function (req, res) {
    // Load the campaign.
    Campaign.findById(req.params.id, function (err, campaign) {
      if (err) {
        throw err;
      }
      else if (campaign) {
        res.render('campaigns/campaign', {
          campaignId: campaign._id,
          pageTitle: campaign.title
        });
      }
      else {
        // If no campaign found display a 404.
        res.send('404', 404);
      }
    });
  });

  // A campaign widget.
  app.get('/campaign/:id/iframe', function (req, res) {
    // Load the campaign.
    Campaign.findById(req.params.id, function (err, campaign) {
      if (err) {
        throw err;
      }
      else if (campaign) {
        // Generate a new [Twilio Capability token](http://www.twilio.com/docs/client/capability-tokens).
        var cap = new Capability(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
        cap.allowClientOutgoing(process.env.TWILIO_APP_SID);
        var token = cap.generateToken();
        var twilioConfig = {
          CapabilityToken: token,
          DemoNumber: process.env.DEMO_NUMBER,
          CampaignId: req.params.id
        };
        res.render('campaigns/campaign_iframe', {
          pageTitle: campaign.title,
          twilioConfigJson: JSON.stringify(twilioConfig),
          // Use the `campaign_layout` Jade layout template.
          campaign: campaign
        });
      }
      else {
        // If no campaign found display a 404.
        res.send('404', 404);
      }
    });
  });
};
