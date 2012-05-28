var express = require('express'),
    //TwilioClient = require('twilio').Client,
    Capability = require('twilio').Capability,
    represent = require('represent');

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
    token: token
  });
});

app.get('/representatives/:lat/:lon', function (req, res) {
  //if (req.xhr) {
  represent.representativesLatLon(req.params.lat, req.params.lon, function (reps) {
    var processedReps = processReps(reps);
    res.json(processedReps);
  });
  //}
});

app.get('/twiml', function (req, res) {
  var number = req.param('PhoneNumber');
  res.contentType('text/xml');
  res.render('twiml', {
    layout: false,
    number: number,
    callerID: process.env.TWILIO_CALLER_ID
  });
});

// @TODO: This might need to become async
function processReps(reps) {
  var output = [];
  for (i in reps.objects) {
    var rep = reps.objects[i];
    var phone = '';
    for (o in rep.offices) {
      if (rep.offices[o].tel && (rep.offices[o].type.match(/Constituency/i))) {
        var phone = rep.offices[o].tel;
        break;
      }
    }
    output.push(
      {
        name: rep.name,
        title: rep.district_name + ' ' + rep.elected_office + ' at ' + rep.representative_set_name,
        phone: phone,
        email: rep.email
      }
    );
  }
  return output;
}

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
