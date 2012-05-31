var express = require('express'),
    util = require('util'),
    //TwilioClient = require('twilio').Client,
    Capability = require('twilio').Capability,
    represent = require('represent'),
    campaigns = require('./campaigns');

var app = express.createServer();

var cap = new Capability(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
cap.allowClientOutgoing(process.env.TWILIO_APP_SID);
var token = cap.generateToken();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.favicon());
});

app.get('/', function (req, res) {
  res.render('root', {
    title: 'Project Codename'
  });
});

app.get('/campaign/:id', function (req, res) {
  campaigns.find(req.params.id, function(campaign) {
    if (campaign) {
      var twilioConfig = {
        CapabilityToken: token,
        DemoNumber: process.env.DEMO_NUMBER,
        CampaignId: req.params.id
      };
      res.render('campaign', {
        twilioConfigJson: util.format('%j', twilioConfig),
        layout: 'campaign_layout',
        campaign: campaign
      });
    }
    else {
      res.send('404', 404);
    }
  });
});

app.get('/representatives/:lat/:lon', function (req, res) {
  represent.representativesLatLon(req.params.lat, req.params.lon, function (reps) {
    if (reps && reps.objects.length) {
      var processedReps = processReps(reps);
      res.render('representatives', {
        layout: false,
        reps: processedReps
      });
    }
    else if (null === reps) {
      res.send('The representatives database is unreachable at the moment. Please try again later.');
    }
    else if (0 === reps.objects.length) {
      res.send('No representatives found for your current location.');
    }
  });
});

app.get('/twiml', function (req, res) {
  var number = req.param('PhoneNumber');
  if (process.env.DEMO_NUMBER) {
    number = process.env.DEMO_NUMBER;
  }
  res.contentType('text/xml');
  res.render('twiml', {
    layout: false,
    number: number,
    callerID: process.env.TWILIO_CALLER_ID,
    armed: 'YES' !== process.env.DEMO_UNARMED_YES_NO,
  });
});

// @TODO: This might need to become async
function processReps(reps) {
  var output = [];
  for (i in reps.objects) {
    var rep = reps.objects[i];
    var phone = '';
    for (o in rep.offices) {
      if (rep.offices[o].tel && rep.offices[o].type.match(/Constituency/i)) {
        var phone = rep.offices[o].tel;
        break;
      }
    }
    output.push(
      {
        name: rep.name,
        title: rep.district_name + ' ' + rep.elected_office + ' at ' + rep.representative_set_name,
        phone: phone,
        email: rep.email,
        photo: rep.photo_url
      }
    );
  }
  return output;
}

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
