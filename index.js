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

var acorn = require('acorn');
var traverse = require('traverse');

function quoteIfString(val) {
    if (typeof val === 'string') {
        return '"' + val + '"';
    } else {
        return val;
    }
}

function getParentKeys(node, list) {
    list = list || [];

    if (node.parent) {
        list.unshift(node.key);
        return getParentKeys(node.parent, list);
    } else {
        return list;
    }
}

module.exports = {
    parse: function (script) {

        var ast = acorn.parse(script);
        var outStr = 'main:\n';

        traverse(ast).forEach(function (d) {
            var parentKeys;

            if (this.isLeaf) {
                parentKeys = getParentKeys(this);

                // Turn the list of parent keys into a chain of array access notation
                // beginning with local.a
                outStr += parentKeys.reduce(function (acc, key) {
                    return acc + '[' + quoteIfString(key) + ']';
                }, 'local.a');

                // Assign the leaf value
                outStr += '=' + quoteIfString(d) + '\n';
            }
        });

        outStr += 'end local.a\n';

        return outStr;
    }
};
