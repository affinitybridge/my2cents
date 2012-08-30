var User = require('../models/user');

module.exports = function (app, requireAuth) {
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
};
