/*
Copyright (c) 2012 James Shore

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
"use strict";

var jshint = require("jshint").JSHINT;
var fs = require("fs");

exports.validateSource = function(sourceCode, options, globals, description) {
	description = description ? description + " " : "";
	var pass = jshint(sourceCode, options, globals);
	if (pass) {
		console.log(description + "ok");
	}
	else {
		console.log(description + "failed");
		jshint.errors.forEach(function(error) {
			console.log(error.line + ": " + error.evidence.trim());
			console.log("   " + error.reason);
		});
	}
	return pass;
};

exports.validateFile = function(filename, options, globals) {
	var sourceCode = fs.readFileSync(filename, "utf8");
	return exports.validateSource(sourceCode, options, globals, filename);
};

exports.validateFileList = function(fileList, options, globals) {
	var pass = true;
	fileList.forEach(function(filename) {
		pass = exports.validateFile(filename, options, globals) && pass;
	});
	return pass;
};