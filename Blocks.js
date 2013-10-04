var rfile = require("rfile");
var code = rfile("./ext/blockly/blocks_compressed.js");
module.exports = code + "\n//@ sourceURL=create-blockly/Blocks.js";