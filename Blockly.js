var rfile = require("rfile");
var code = rfile("./ext/blockly/blockly_compressed.js");
module.exports = code + "\n//@ sourceURL=create-blockly/Blockly.js";