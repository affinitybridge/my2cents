var User = require('../models/user');

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
};
