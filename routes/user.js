var User = require('../models/user'),
    bcrypt = require('bcrypt');

module.exports = function (app) {
  // Present a form to create a user.
  app.get('/user/new', function (req, res) {
    res.render('users/new', {
      pageTitle: 'Create a new User',
      user: new User()
    });
  });

  // Create a user.
  app.post('/user', function (req, res) {
    var newUser = req.body.user;
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(newUser.password, salt, function (err, hash) {
        if (err) {
          throw err;
        }
        else {
          newUser.password = hash;
          var user = new User(newUser);
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
                req.session.user = req.body.user;
                res.redirect('/dashboard');
              });
            }
          });
        }
      });
    });
  });
};
