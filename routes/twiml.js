var minihash = require('../lib/minihash');

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
    // Use a demo number if variable present.
    if (process.env.DEMO_NUMBER) {
      number = process.env.DEMO_NUMBER;
    }
    // Has the dialed number been altered? ie: Is someone trying for free calls?
    (function() {
      console.log('twiml.js');
      console.log("number start");
      console.log(number);
      console.log('number end');
      console.log("hash start");
      console.log(hash);
      console.log("hash end");
      console.log(minihash.hash(number, process.env.SALT));
    })();
    if (minihash.hash(number, process.env.SALT) !== hash) {
      altered = true;
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
