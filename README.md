acorn-msan
==========

> MSAN: Morpheus Script Associative Array Notation

Morpheus Script is part of the Uber Tools framework for Quake III by Ritual Entertainment. For more information see the [Uber Tools Key Features](http://www.ritualistic.com/content.php/games/uber/features.php) page.

This tool uses acorn to convert a JavaScript AST into a Morpheus Script-compatible data structure. This will allow pre-parsing JavaScript files so that the Morpheus Script engine won't need to.

Usage
-----

### JavaScript

```javascript

var MSAN = require('acorn-msan');
var acorn = require('acorn');
var jsCode = 'var data = [{ "name": "carlos", "age": 22 }];'
var msanCode = MSAN.parse(acorn.parse(jsCode));

console.log(msanCode);

/* Logs
main:
local.a["start"]=0
local.a["body"]["0"]["start"]=0
local.a["body"]["0"]["declarations"]["0"]["start"]=4
local.a["body"]["0"]["declarations"]["0"]["id"]["start"]=4
local.a["body"]["0"]["declarations"]["0"]["id"]["name"]="data"
local.a["body"]["0"]["declarations"]["0"]["id"]["type"]="Identifier"
local.a["body"]["0"]["declarations"]["0"]["id"]["end"]=8
...
*/
```

### Command Line

```shell
# Using files
acorn-msan --infile sample.js --outfile out.scr

# Or piping
echo 'var x = { cool: "deal" }' | acorn-msan > out.scr
```

Run `acorn-msan --help` for full usage info.
