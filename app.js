var express = require('express'),
    //TwilioClient = require('twilio').Client,
    Capability = require('twilio').Capability;

var app = express.createServer();

var cap = new Capability(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
cap.allowClientOutgoing('APabe7650f654fc34655fc81ae71caa3ff');
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

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
