  // **My2Cents** is a campaign widget for calling elected
  // representatives. Source is available on
  // [GitHub](https://github.com/affinitybridge/my2cents).

  // My2Cents is built on [Express](http://expressjs.com/). It uses the
  // [Twilio API](http://twilio.com) to make phone calls and the
  // [Open North Represent API](http://represent.opennorth.ca/) to receive
  // representative information. [Jade](http://jade-lang.com/) is used for templating and
  // [Stylus](http://learnboost.github.com/stylus/) helps with CSS.
(function() {
  var express = require('express'),
      Capability = require('twilio').Capability,
      represent = require('represent'),
      Campaign = require('./models/campaign'),
      User = require('./models/user'),
      stylus = require('stylus'),
      crypto = require('crypto'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      config = require('./config');

  // Create the Express server.
  var app = module.exports = express.createServer();

  // Stylus compile function. [[docs](http://learnboost.github.com/stylus/docs/middleware.html)]
  function compile(str, path) {
    return stylus(str)
      .set('filename', path)
      // Comment the processed CSS when not on production
      .set('linenos', process.env.NODE_ENV !== 'production')
      // Compress the processed CSS on production
      .set('compress', process.env.NODE_ENV === 'production');
  }

  // Configure Express application.
  // Express uses [Connect](http://www.senchalabs.org/connect/) middleware.
  app.configure(function() {
    app.use(stylus.middleware({
      src: __dirname + '/styles',
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
    app.use(express.session({secret: process.env.SESSION_SECRET || config.session_secret}));
    app.use(passport.initialize());
    app.use(passport.session());
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

  // Dynamic view helpers
  app.dynamicHelpers({
    flash: function (req, res) {
      return req.flash();
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

  // Setup Passport authentication
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Unknown username or password' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Unknown username or password' });
        }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne(id, function (err, user) {
      done(err, user);
    });
  });

  // ### Routes

  // List all campaigns on the homepage.
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

  // Present a login form.
  app.get('/login', function (req, res) {
    res.render('login', {
      pageTitle: 'Login'
    });
  });

  // Process the login form.
  app.post(
    '/login',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true
    }),
    function (req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` property contains the authenticated user.
      req.session.user = req.user;
      res.redirect('/dashboard');
    }
  );

  // Present a form to create a user.
  app.get('/user/new', function (req, res) {
    res.render('users/new', {
      pageTitle: 'Create a new User',
      user: new User()
    });
  });

  // Create a user.
  app.post('/user', function (req, res) {
    var user = new User(req.body.user);
    User.findOne({username: user.username}, function (err, founduser) {
      if (err) {
        throw err;
      }
      else if (founduser) {
        // we have a pre-existing user
        req.flash('error', 'This username exists already. Please choose another username!');
        res.redirect('/user/new');
      }
      else {
        // we have NO pre-existing user
        user.save(function (err) {
          if (err) {
            throw err;
          }
          // @TODO authenticate and redirect to dashboard instead!
          res.redirect('/login');
        });
      }
    });
  });

  // Present a form to create a user.
  app.get('/dashboard', requireAuth, function (req, res) {
    User.findOne({username: req.session.user.username}, function (err, user) {
      if (err) {
        throw err;
      }
      else if (user) {
        res.render('users/dashboard', {
          pageTitle: 'Your dashboard',
          user: user
        });
      }
      else {
        // If no user found display a 404.
        res.send('404', 404);
      }
    });


  });

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

  // A campaign widget.
  app.get('/campaign/:id', function (req, res) {
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
    // Load the campaign.
    Campaign.findById(req.params.id, function (err, campaign) {
      if (err) {
        throw err;
      }
      else if (campaign) {
        res.render('campaign_iframe', {
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
      armed: 'YES' !== process.env.DEMO_MODE
    });
  });

  // Process a raw result from the Open North Represent API and return a
  // formatted array of representative objects.
  function processReps(reps) {
    var output = [];
    for (var index = 0; index < reps.objects.length; index++) {
      var rep = reps.objects[index];
      var phone = '';
      // Only use the Constituency phone number.
      for (var office_index = 0; office_index < rep.offices.length; office_index++) {
        if (rep.offices[office_index].tel && rep.offices[office_index].type.match(/Constituency/i)) {
          phone = rep.offices[office_index].tel;
          // Only include representatives with phone numbers.
          output.push(
            {
              id: index,
              name: rep.name,
              title: rep.district_name + ' ' + rep.elected_office + ' at ' + rep.representative_set_name,
              phone: phone,
              phoneHash: miniHash(phone, process.env.SALT),
              email: rep.email,
              photo: rep.photo_url
            }
          );
          break;
        }
      }
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
}());
