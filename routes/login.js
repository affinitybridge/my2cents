var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user');

// Setup Passport authentication
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Unknown username or password' });
      }
      user.validPassword(password, function(err, match) {
        if (!match) {
          return done(null, false, { message: 'Unknown username or password' });
        } else {
          return done(null, user);
        }
      });
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

module.exports = function (app) {
  // Process the login form.
  app.post(
    '/login',
    passport.authenticate('local', {
      failureRedirect: '/',
      failureFlash: true
    }),
    function (req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` property contains the authenticated user.
      req.session.user = req.user;
      res.redirect('/');
    }
  );

  // Logout
  app.get('/logout', function (req, res) {
    req.session.regenerate(function (err) {
      req.flash('info', 'You have been logged out.');
      res.redirect('/');
    });
  });
};
