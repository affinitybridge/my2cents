/*global desc, task, jake, fail, complete */
(function() {
  "use strict";

  desc("Build");
  task("default", ["lint", "docs", "test"], function() {});

  desc("Lint");
  task("lint", [], function() {
    var lint = require("./build/lint/lint_runner.js");
    var files = new jake.FileList();
    files.include("*.js");
    files.include("**/*.js");
    files.exclude("node_modules");
    files.exclude("public/bootstrap/*");
    var options = nodeLintOptions();
    var passed = lint.validateFileList(files.toArray(), options, {});
    if (!passed) fail("Lint failed.");
  });

  desc("Documentation");
  task("docs", [], function() {
    var files = [
      'app.js',
      'routes/campaign.js',
      'routes/index.js',
      'routes/login.js',
      'routes/representatives.js',
      'routes/twiml.js',
      'routes/user.js'
    ];
    var spawn = require('child_process').spawn,
        doc = spawn('docco', files);

    doc.stdout.on('data', function (data) {
      process.stdout.write(data);
    });
    doc.stderr.on('data', function (data) {
      process.stderr.write(data);
    });
  });

  desc("Test");
  task("test", [], function() {
    var ex = jake.createExec(['./node_modules/.bin/mocha --reporter list test/*.js'], {printStdout: true});
    ex.addListener('error', function (msg, code) {
      fail('Fatal error: ' + msg, code);
    });
    ex.run();
  });

  function nodeLintOptions() {
    return {
      bitwise: true,
      curly: false,
      eqeqeq: true,
      forin: true,
      immed: true,
      latedef: true,
      newcap: true,
      noarg: true,
      noempty: true,
      nonew: true,
      regexp: true,
      undef: true,
      strict: false,
      trailing: true,
      node: true,
      es5: true,
      jquery: true,
      browser: true,
      laxcomma: true,
      predef: [
        "Twilio",       // Used by Twilio
        "TwilioConfig", // Used by Twilio
        "describe",     // Used by mocha
        "it",           // Used by mocha
        "before",       // Used by mocha
        "beforeEach",   // Used by mocha
        "after",        // Used by mocha
        "afterEach"     // Used by mocha
      ]
    };
  }
}());
