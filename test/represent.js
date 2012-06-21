var assert  = require('assert'),
    request = require('request'),
    app = require('../app');

describe("Homepage", function() {
  describe("GET /", function() {
    var body;
    body = null;
    before(function(done) {
      var options;
      options = {
        uri: "http://localhost:" + app.settings.port + "/"
      };
      request(options, function(err, response, _body) {
        body = _body;
        done();
      });
    });
    it("has title", function() {
      assert.hasTag(body, '//head/title', 'Project Codename');
    });
  });
});
