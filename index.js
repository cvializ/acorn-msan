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
'use strict';

var traverse = require('traverse');

function escapeQuotes(val) {
    return String(val).split('"').join('\\"');
}

function quote(val) {
    return '"' + escapeQuotes(val) + '"';
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
    parse: function (obj) {
        var outStr = 'main:\n';

        traverse(obj).forEach(function (d) {
            var parentKeys;

            if (this.isLeaf) {
                parentKeys = getParentKeys(this);

                // Turn the list of parent keys into a chain of array access notation
                // beginning with local.a
                outStr += parentKeys.reduce(function (acc, key) {
                    return acc + '[' + quote(key) + ']';
                }, 'local.a');

                // Assign the leaf value
                if (typeof d === 'string') {
                    d = quote(d);
                } else if (typeof d === 'boolean') {
                    // convert to number. true and false are 1 and 0 in MSAN
                    d = +d;
                }

                outStr += '=' + d + '\n';
            }
        });

        outStr += 'end local.a\n';

        return outStr;
    }
};
