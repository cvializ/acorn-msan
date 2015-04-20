#!/usr/bin/env node

'use strict';

var fs = require('fs');
var program = require('commander');
var es = require('event-stream');
var acorn = require('acorn');
var pkg = require('./package.json');
var MSAN = require('./');

program
    .version(pkg.version)
    .description(pkg.description)
    .option('-i, --infile [filename]', 'The path of the input JavaScript file to convert. Reads from stdin if unspecified')
    .option('-o, --outfile [filename]', 'The path for the Morpheus Script output. Writes to stdout if unspecified.')
    .parse(process.argv);

var inputStream = (program.infile && program.infile !== '-' ? fs.createReadStream(program.infile) : process.stdin);
inputStream.on('error', function (err) {
    console.error('Error reading file: ' + err.path);
    console.error('Does that file exist?');
});

var outputStream = (program.outfile && program.outfile !== '-' ? fs.createWriteStream(program.outfile) : process.stdout);
outputStream.on('error', function (err) {
    console.error('Error writing file: ' + err.path);
    console.error('Do you have the correct permissions?');
});

var acornStream = es.map(function (data, cb) {
  try {
    var ast = acorn.parse(data.toString('utf8'));
  } catch (e) {
    cb(e);
  }
  cb(null, ast);
});

// Expects data to be an Mozilla Parser API AST
var msanStream = es.map(function (data, cb) {
  cb(null, MSAN.parse(data));
});

// Wait for all the string data to be available,
// then pass it down the pipeline
inputStream
  .pipe(es.wait())
  .pipe(acornStream)
  .pipe(msanStream)
  .pipe(outputStream);
