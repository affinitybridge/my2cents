var represent = require('represent'),
    representatives = require('../lib/representatives');


module.exports = function (app) {
  // A campaign will make an ajax to this route after determining lat/lon using
  // HTML Geolocation API.
  app.get('/representatives/:lat/:lon', function (req, res) {
    represent.representativesLatLon(req.params.lat, req.params.lon, function (error, data) {
      if (error) {
        throw error;
      }
      if (data && data.objects.length) {
        // Create an array of structured representative objects.
        var processedReps = representatives.getProcessed(data);
        res.render('representatives', {
          layout: false,
          reps: processedReps
        });
      }
      // Open North Represent API not available.
      else if (null === data) {
        res.send('The representatives database is unreachable at the moment. Please try again later.');
      }
      // No representatives found.
      else if (0 === data.objects.length) {
        res.send('No representatives found for your current location.');
      }
    });
  });
};
