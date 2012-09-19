// **My2Cents** is a campaign widget for calling elected
// representatives. Source is available on
// [GitHub](https://github.com/affinitybridge/my2cents).

// My2Cents is built on [Express](http://expressjs.com/). It uses the
// [Twilio API](http://twilio.com) to make phone calls and the
// [Open North Represent API](http://represent.opennorth.ca/) to receive
// representative information. [Jade](http://jade-lang.com/) is used for templating and
// [Stylus](http://learnboost.github.com/stylus/) helps with CSS.

var express = require('express'),
    passport = require('passport'),
    stylus = require('stylus'),
    config = require('./config');

// Create the Express server.
var app = module.exports = express.createServer();

// Stylus compile function. [[docs](http://learnboost.github.com/stylus/docs/middleware.html)]
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    // Comment the processed CSS when not on production
    .set('linenos', process.env.NODE_ENV !== 'production')
    // Compress the processed CSS
    .set('compress', true);
}

// Configure Express application.
// Express uses [Connect](http://www.senchalabs.org/connect/) middleware.

var oneMonth = 1000 * 60 * 60 * 24 * 30;

app.configure(function() {
  app.use(stylus.middleware({
    src: __dirname + '/styles',
    dest: __dirname + '/public',
    compile: compile
  }));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false,
    pretty: process.env.NODE_ENV !== 'production'
  });
  app.set('port', process.env.PORT || 5000);
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.compress());
  app.use(express.static(__dirname + '/public', { maxAge: oneMonth }));
  app.use(express.cookieParser());
  app.use(express.session({secret: process.env.SESSION_SECRET || config.session_secret}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.favicon('public/favicon.ico', { maxAge: oneMonth }));
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

// Dynamic view helpers
app.dynamicHelpers({
  flash: function (req, res) {
    return req.flash();
  },
  session: function (req, res) {
    return req.session;
  }
});

// User authentication middleware
function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  }
  else {
    req.flash('error', 'Please login to access this page!');
    res.redirect('/login');
  }
}

// ### Routes

// Homepage
require('./routes/index')(app);
// User authentication
require('./routes/login')(app);
// User creation
require('./routes/user')(app);
// User dashboard
require('./routes/dashboard')(app, requireAuth);
// Display and create campaigns
require('./routes/campaign')(app, requireAuth);
// Get OpenNorth Represent data
require('./routes/representatives')(app);
// Twilio app request URL
require('./routes/twiml')(app);
// Example Page
require('./routes/example')(app);
// Error Pages
require('./routes/error')(app);

// Bind the Express server to a port.
var port = app.settings.port;
app.listen(port, function() {
  console.log("Listening on " + port);
});
