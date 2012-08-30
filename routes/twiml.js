var minihash = require('../modules/minihash');

module.exports = function (app) {
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
    if (minihash.hash(number, process.env.SALT) !== hash) {
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
};
