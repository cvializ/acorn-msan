acorn-msan
==========

Converts JavaScript files into a script containing a data structure readable by Morpheus Script programs.

Usage
-----

### JavaScript

```javascript

var MSAN = require('acorn-msan');
var jsCode = 'var data = [{ "name": "carlos", "age": 22 }];'
var msanCode = MSAN.parse(jsCode);

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
acorn-msan --infile sample.js --outfile out.scr
```
