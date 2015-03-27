/**
Morpheus Script Associative Array Notation
Converts JSON to MSAAN

{
  start: [
    {
      "name": "carlos",
      "age": 22,
      "cool": true
    },
    {
      "name": "bob",
      "age": "101",
      "cool": false
    },
    { ... }
  ]
}

converts to...

local.a["start"][0]["name"] = "carlos"
local.a["start"][0]["age"] = 22
local.a["start"][0]["cool"] = 1
local.a["start"][1]["name"] = "bob"
local.a["start"][1]["age"] = 22
local.a["start"][1]["cool"] = 0
*/

function quoteIfString(val) {
    if (typeof val === 'string') {
        return '"' + val + '"';
    } else {
        return val;
    }
}

function traverse(json, valueFunc, stack) {
    stack = stack || [];

    for (var key in json) {
        stack.push(key);

        valueFunc(key, json[key], stack.slice());

        if (json[key] !== null && typeof(json[key]) === 'object') {
            //going on step down in the object tree!!
            traverse(json[key], valueFunc, stack);
        }

        stack.pop(key);
    }
}

module.exports = {
    parse: function (script) {

        var acorn = require('acorn');
        var ast = acorn.parse(script);
        var outStr = 'main:\n';

        function processNode(key, value, stack) {
            if (typeof value === 'object') return;

            var str = 'local.a';

            for (var i = 0; i < stack.length; i++) {
                str += '[' + quoteIfString(stack[i]) + ']';
            }

            if (typeof value === 'boolean') {
                value = value ? 1 : 0;
            }

            str += "=" + quoteIfString(value);

            outStr += str + '\n';
        }

        traverse(ast, processNode);

        outStr += 'end local.a\n';

        return outStr;
    }
};
