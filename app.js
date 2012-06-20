// **Project Codename** is a campaign widget for calling elected
// representatives. Source is available on
// [GitHub](https://github.com/affinitybridge/projectcodename).

// Project Codename is built on [Express](http://expressjs.com/). It uses the
// [Twilio API](http://twilio.com) to make phone calls and the
// [Open North Represent API](http://represent.opennorth.ca/) to receive
// representative information. Campaigns are currently persisted in the
// `capaigns.js` file. [Jade](http://jade-lang.com/) is used for templating and
// [Stylus](http://learnboost.github.com/stylus/) helps with CSS.
var express = require('express'),
    Capability = require('twilio').Capability,
    represent = require('represent'),
    campaigns = require('./campaigns'),
    stylus = require('stylus'),
    crypto = require('crypto');

// Create the Express server.
var app = express.createServer();

// Stylus compile function. [[docs](http://learnboost.github.com/stylus/docs/middleware.html)]
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    // Comment generated CSS when not on production
    .set('linenos', process.env.NODE_ENV !== 'production')
    // Compress generated CSS on production
    .set('compress', process.env.NODE_ENV == 'production')
};

// Configure Express application.
// Express uses [Connect](http://www.senchalabs.org/connect/) middleware.
app.configure(function() {
  app.use(stylus.middleware({
    src: __dirname + '/styles',
    // @TODO: figure out why we can't put styles in /public/stylesheets
    dest: __dirname + '/public',
    compile: compile
  }));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('port', process.env.PORT || 5000);
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.favicon());
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('test', function(){
  app.set('port', 5001);
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// ### Routes

// List all campaigns on the homepage.
app.get('/', function (req, res) {
  campaigns.findAll(function(campaigns) {
    res.render('root', {
      pageTitle: 'Project Codename',
      campaigns: campaigns
    });
  });
});

// A campaign widget.
app.get('/campaign/:id', function (req, res) {
  // Load the campaign. See `find()` in `campaigns.js`.
  campaigns.find(req.params.id, function(campaign) {
    if (campaign) {
      // Generate a new [Twilio Capability token](http://www.twilio.com/docs/client/capability-tokens).
      var cap = new Capability(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
      cap.allowClientOutgoing(process.env.TWILIO_APP_SID);
      var token = cap.generateToken();
      var twilioConfig = {
        CapabilityToken: token,
        DemoNumber: process.env.DEMO_NUMBER,
        CampaignId: req.params.id
      };
      res.render('campaign', {
        pageTitle: campaign.title,
        twilioConfigJson: JSON.stringify(twilioConfig),
        // Use the `campaign_layout` Jade layout template.
        layout: 'campaign_layout',
        campaign: campaign
      });
    }
    else {
      // If no campaign found display a 404.
      res.send('404', 404);
    }
  });
});

// Display a campaign widget in an iframe.
app.get('/campaign/:id/iframe', function (req, res) {
  // Load the campaign. See `find()` in `campaigns.js`.
  campaigns.find(req.params.id, function(campaign) {
    if (campaign) {
      res.render('campaign_iframe', {
        campaignId: campaign.id,
        pageTitle: campaign.title
      });
    }
    else {
      // If no campaign found display a 404.
      res.send('404', 404)
    }
  });
});

// A campaign will make an ajax to this route after determining lat/lon using
// HTML Geolocation API.
app.get('/representatives/:lat/:lon', function (req, res) {
  represent.representativesLatLon(req.params.lat, req.params.lon, function (reps) {
    if (reps && reps.objects.length) {
      // Create an array of structured representative objects.
      var processedReps = processReps(reps);
      res.render('representatives', {
        layout: false,
        reps: processedReps
      });
    }
    // Open North Represent API not available.
    else if (null === reps) {
      res.send('The representatives database is unreachable at the moment. Please try again later.');
    }
    // No representatives found.
    else if (0 === reps.objects.length) {
      res.send('No representatives found for your current location.');
    }
  });
});

// Twilio App Voice request URL.
// When a call is placed Twilio will GET this resource with the number to call.
app.get('/twiml', function (req, res) {
  if (!req.param('PhoneNumber') || !req.param('PhoneHash')) {
    res.send(500);
  }
  var number = req.param('PhoneNumber');
  var hash = req.param('PhoneHash');
  var altered = false;
  // Has the dialed number been altered? ie: Is someone trying for free calls?
  if (miniHash(number, process.env.SALT) !== hash) {
    altered = true;
  }
  // Use a demo number if variable present.
  if (process.env.DEMO_NUMBER) {
    number = process.env.DEMO_NUMBER;
  }
  // Return [TWIML](http://www.twilio.com/docs/api/twiml) allowing Twilio to
  // place call.
  res.contentType('text/xml');
  res.render('twiml', {
    layout: false,
    number: number,
    altered: altered,
    callerID: process.env.TWILIO_CALLER_ID,
    armed: 'YES' !== process.env.DEMO_UNARMED_YES_NO
  });
});

// Process a raw result from the Open North Represent API and return a
// formatted array of representative objects.
//
// @TODO: This might need to become async
function processReps(reps) {
  var output = [];
  for (i in reps.objects) {
    var rep = reps.objects[i];
    var phone = '';
    // Only use the Constituency phone number.
    for (o in rep.offices) {
      if (rep.offices[o].tel && rep.offices[o].type.match(/Constituency/i)) {
        var phone = rep.offices[o].tel;
        break;
      }
    }
    output.push(
      {
        id: i,
        name: rep.name,
        title: rep.district_name + ' ' + rep.elected_office + ' at ' + rep.representative_set_name,
        phone: phone,
        phoneHash: miniHash(phone, process.env.SALT),
        email: rep.email,
        photo: rep.photo_url
      }
    );
  }
  return output;
}

// Used to generate a hash of plain-text + salt
function miniHash(msg, key) {
  return crypto
    .createHmac('sha256', key)
    .update(msg)
    .digest('hex')
    // shorten hash
    .substring(3,11);
}

// Bind the Express server to a port.
var port = app.settings.port;
app.listen(port, function() {
  console.log("Listening on " + port);
});
