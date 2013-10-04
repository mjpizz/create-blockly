var rfile = require("rfile");
var code = rfile("./ext/blockly/python_compressed.js");
module.exports = code + "\n//@ sourceURL=create-blockly/Python.js";