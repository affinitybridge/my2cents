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

describe("Campaign", function() {
  describe("GET /campaign/1/iframe", function() {
    var body;
    body = null;
    before(function(done) {
      var options;
      options = {
        uri: "http://localhost:" + app.settings.port + "/campaign/1/iframe"
      };
      request(options, function(err, response, _body) {
        body = _body;
        done();
      });
    });
    it("has title", function() {
      assert.hasTag(body, '//body/div/h1', 'The primary campaign page.');
    });
  });
});
