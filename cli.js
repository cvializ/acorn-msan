#!/usr/bin/env node

'use strict';

var fs = require('fs');
var program = require('commander');
var concat = require('concat-stream');
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

// Read the streamed input data to the MSAN parser
// then write the result to the output stream
var cs = concat(function (inputBuffer) {
    var result = MSAN.parse(inputBuffer);
    outputStream.write(result);
});

// Pass the input data to the concat stream
inputStream.pipe(cs);
