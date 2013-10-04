var rfile = require("rfile");
var iframe = require("iframe");
var blocklyBrowserCode = require("./Blockly");
var iframeHtml = rfile("./lib/frame.html");

function getWindowFromElement(element) {
  var doc = element.ownerDocument;
  return doc.defaultView || doc.parentWindow;
}

function createWindowFromIframe(element) {
  var win = getWindowFromElement(element);
  var callbackKey = "create-blockly-" + (new Date).getTime();
  var iframeWin = null;
  win[callbackKey] = function(callbackWin) {
    delete win[callbackKey];
    iframeWin = callbackWin;
  };
  iframe({
    container: element,
    html: iframeHtml.replace("{{callbackKey}}", JSON.stringify(callbackKey))
  });
  return iframeWin;
}

function createMockWindowForBlockly() {
  return {document: {documentElement: {}}};
}

function instantiateBrowserCode(code, window) {
  var mockGoog = {require: function(){}, provide: function(){}};
  var creator = new Function(["window", "document", "Blockly", "goog"], code);
  creator.apply(window, [window, window.document, window.Blockly, mockGoog]);
}


function hookInjectToEnsureStylesCascade(Blockly, win) {
  var originalInject = Blockly.inject;
  Blockly.inject = function inject() {
    originalInject.apply(Blockly, arguments);
    var style = win.document.getElementById("create-blockly-iframe-style");
    style.parentNode.appendChild(style);
  }
}

function createBlocklySync(options) {

  options = options || {};

  // Parse Blockly-specific configuration options.
  var injectOptions = {};
  var createOptionsKeys = [
    "container",
    "extensions"
  ];
  for (var key in options) {
    if (options.hasOwnProperty(key) && createOptionsKeys.indexOf(key) < 0) {
      injectOptions[key] = options[key];
    }
  }

  // If options.container is given, prepare to inject it using the
  // resizable iframe method.
  // http://code.google.com/p/blockly/wiki/InjectingResizable
  var win = createMockWindowForBlockly();
  var container = null;
  if ("container" in options) {
    if (!options.container) throw new Error("container must exist when using options.container");
    container = options.container;
    win = createWindowFromIframe(container);
  }

  // Evaluate the Blockly code in this iframe window. Ensure that
  // Blockly.inject() moves the inline <style> tag below Blockly's inline
  // styles to preserve basic attributes like transparent background.
  instantiateBrowserCode(blocklyBrowserCode, win);
  var Blockly = win.Blockly;
  if (container) {
    hookInjectToEnsureStylesCascade(Blockly, win);
  }

  // If options.extensions are given, evaluate their code in the same
  // window context on this instance of Blockly. This is equivalent to
  // injecting <script> tags for these files.
  if (options.extensions) {
    var extensions = options.extensions.slice(0);
    while (extensions.length) {
      var extensionBrowserCode = extensions.pop();
      instantiateBrowserCode(extensionBrowserCode, win);
    }
  }

  // If a container was given, the iframe is already created. Auto-inject
  // Blockly into the document body in that iframe window.
  if (container) {
    Blockly.inject(win.document.body, injectOptions);
  }

  return win;

}

function createBlockly(options, callback) {

  // If a callback is given, do this async. The main benefit of this is that
  // you get a direct reference to the window that Blockly was created on.
  if (callback) {
    try {
      var win = createBlocklySync(options);
      callback(null, win.Blockly, win);
    } catch(err) {
      callback(err)
    }

  // Otherwise just synchronously return Blockly, no window.
  } else {
    return createBlocklySync(options).Blockly;
  }

}

module.exports = createBlockly;
