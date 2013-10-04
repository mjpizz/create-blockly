var rfile = require("rfile");
var code = rfile("./ext/blockly/javascript_compressed.js");
module.exports = code + "\n//@ sourceURL=create-blockly/Javascript.js";