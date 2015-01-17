## create-blockly

create-blockly makes it easy to create Blockly instances in both node and
the browser (using browserify).

In the browser, Blockly will always be
installed in the most flexible and isolated way, using the
[Blockly's resizable iframe method](http://code.google.com/p/blockly/wiki/InjectingResizable).

## Browser Example

First, make sure you have `node` and `npm` [installed](http://nodejs.org/download/)
on your machine.

Create a new directory with create-blockly installed:

```bash
mkdir MyProject
cd MyProject
npm install create-blockly
```

Create "browser.js" that instantiates Blockly:

```javascript
var createBlockly = require("create-blockly");
var Blockly = createBlockly({

  // This is where the iframed resizable Blockly will be embedded.
  container: document.getElementById("my-editor"),

  // Make the default set of blocks available, with English translations.
  // (you can choose other translations like "create-blockly/Msg/zh_tw")
  extensions: [
    require("create-blockly/Blocks"), // Blockly.Blocks
    require("create-blockly/Msg/en"), // English translations
    require("create-blockly/Javascript"), // Blockly.Javascript exporting
  ],

  // This is the toolbox that defines which blocks are visible.
  // http://code.google.com/p/blockly/wiki/Toolbox
  toolbox: document.getElementById("my-toolbox")

});

// Whenever this Blockly editor changes, log the generated Javscript code.
// More Blockly documentation at http://code.google.com/p/blockly/w/list
Blockly.addChangeListener(function() {
  var code = Blockly.Javascript.workspaceToCode();
  console.log(code);
});

```

Create the associated "browser.html" to load the Javascript:

```html
<html>
  <head>
    <script type="text/javascript" src="browser.js"></script>
  </head>
  <body>
    
    <!-- This is where the iframed resizable Blockly will be embedded. -->
    <div id="my-editor"></div>
    
    <!-- This is the toolbox that defines which blocks are visible. -->
    <!-- http://code.google.com/p/blockly/wiki/Toolbox -->
    <xml id="my-toolbox" style="display:none">
      <category name="Control">
        <block type="controls_if"></block>
        <block type="controls_whileUntil"></block>
      </category>
      <category name="Logic">
        <block type="logic_boolean"></block>
        <block type="logic_operation"></block>
      </category>
      <category name="Text">
        <block type="text"></block>
        <block type="text_print"></block>
      </category>
    </xml>

  </body>
</html>
```

Install helpers for the server:

```bash
npm install express express-logger express-static enchilada
```

Create the "server.js" to serve the demo:

```javascript
var express = require("express");
var expressLogger = require("express-logger");
var expressStatic = require("express-static");
var enchilada = require("enchilada");

var app = express();
app.use(expressLogger());
app.use(enchilada(__dirname));
app.use(expressStatic(__dirname));
app.listen(1337);
console.log("Running demo on localhost:1337")
```

Run the server and open [localhost:1337](http://localhost:1337) in your browser:

```bash
$ node server.js
Running demo on localhost:1337
```

## Wishlist

* Allow [checking out](http://code.google.com/p/blockly/source/checkout) specific revisions of Blockly source from svn
* Allow user to specify their own copy of Blockly source

## References

* Official [Blockly wiki](http://code.google.com/p/blockly/w/list)

## Contributing

Just make a pull request :)
