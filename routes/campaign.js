var Campaign = require('../models/campaign'),
    Capability = require('twilio').Capability,
    checkMobile = require('connect-mobile-detection');

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
    campaign.save(function (err) {
      if (err) {
        throw err;
      }
      else {
        res.redirect('/campaign/' + campaign._id.toHexString());
      }
    });
  });

  // Display a campaign widget in an iframe.
  app.get('/campaign/:id', requireAuth, function (req, res) {
    // Load the campaign.
    Campaign.findById(req.params.id, function (err, campaign) {
      if (err) {
        throw err;
      }
      else if (campaign) {
        // Construct iframe embed code.
        var embedURL = process.env.APP_URL + '/campaign/' + campaign._id.toHexString() + '/iframe';
        var embedCode = '<iframe src="' + embedURL + '" width="300" height="700" frameborder="0" scrolling="no"></iframe>';

        res.render('campaigns/campaign', {
          campaignId: campaign._id,
          pageTitle: campaign.title,
          embedCode: embedCode
        });
      }
      else {
        // If no campaign found display a 404.
        res.send('404', 404);
      }
    });
  });

  // Edit a campaign
  app.get('/campaign/:id/edit', requireAuth, function (req, res) {
    // Load the campaign.
    Campaign.findById(req.params.id, function (err, campaign) {
      if (err) {
        throw err;
      }
      else if (campaign) {
        res.render('campaigns/edit', {
          campaign: campaign,
          pageTitle: campaign.title
        });
      }
      else {
        // If no campaign found display a 404.
        res.send('404', 404);
      }
    });
  });

  // Update a campaign
  app.put('/campaign/:id', requireAuth, function (req, res) {
    // Load the campaign.
    Campaign.findById(req.params.id, function (err, campaign) {
      if (err) {
        throw err;
      }
      else if (campaign) {
        campaign.title = req.body.campaign.title;
        campaign.desc = req.body.campaign.desc;
        campaign.script = req.body.campaign.script;
        campaign.save(function (err) {
          if (err) {
            throw err;
          }
          else {
            res.redirect('/campaign/' + campaign._id.toHexString());
          }
        });
      }
      else {
        throw new Error("Campaign not found");
      }
    });
  });

  // A campaign widget.
  app.get('/campaign/:id/iframe', checkMobile(), function (req, res) {
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

  // Delete campaign
  app.del('/campaign/:id', requireAuth, function (req, res) {
    // Load the campaign.
    Campaign.findById(req.params.id, function (err, campaign) {
      if (err) {
        throw err;
      }
      else if (campaign) {
        campaign.remove();
        res.redirect('/');
      }
      else {
        throw new Error('Campaign not found');
      }
    });
  });

  app.get('/campaign/:id/example', function (req, res) {
    Campaign.findById(req.params.id, function (err, campaign) {
      if (err) {
        throw err;
      }
      else if (campaign) {
        res.render('campaigns/example', {
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
