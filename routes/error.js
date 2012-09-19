
module.exports = function(app) {
  
  // This is the last callback that doesn't handle errors so we're assuming
  // it's a 404 page.
  
  app.use(function(req, res, next){
    res.status(404);

    res.render('error', {
      pageTitle: 'Page Not Found',
      message: "The path at " + req.url + " was not found."
    });
    return;
  });

  // error-handling middleware, take the same form
  // as regular middleware, however they require an
  // arity of 4, aka the signature (err, req, res, next).
  // when connect has an error, it will invoke ONLY error-handling
  // middleware.

  // If we were to next() here any remaining non-error-handling
  // middleware would then be executed, or if we next(err) to
  // continue passing the error, only error-handling middleware
  // would remain being executed, however here
  // we simply respond with an error page.

  app.use(function(err, req, res, next){
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    err.status = err.status || 500;
    res.status(err.status || 500);

    res.render('error', {
      pageTitle: 'Error ' + err.status,
      message: err
    });
  });
};
