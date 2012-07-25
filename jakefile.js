/*global desc, task, jake, fail, complete */
(function() {
  "use strict";

  desc("Build and test");
  task("default", ["lint"], function() {
  });

  desc("Lint everything");
  task("lint", [], function() {
    var lint = require("./build/lint/lint_runner.js");
    var files = new jake.FileList();
    files.include("*.js");
    files.exclude("node_modules");
    var options = nodeLintOptions();
    var passed = lint.validateFileList(files.toArray(), options, {});
    if (!passed) fail("Lint failed.");
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
      es5: true
    };
  }
}());
