# twCodeMirror.js
Awesome and beautiful source code viewer for TinyMCE -- <a href="http://www.leofec.com/modx-revolution/tinymce-floating-air-bubble-toolbar.html" target="_blank">DEMO</a>

View your TinyMCE source code in the best Code editor, CodeMirror - pure CDN!
Sidebyside or popped up - with live preview - no nonsense!

Usage:
```
tinymce.init({
  external_plugins: {
    twCodeMirror: "[[++assets_url]]components/tinymcewrapper/tinymceplugins/twCodeMirror.js", //plugin location
  },
  twCodeMirrorSettings: { 
    ... pass in any CodeMirror official setting you like to overwrite default behaviour
    ... below are proprietary settings
    twCodeMirrorCDNbase: "",
    twFontSize: 15,
    twPoppedTitle: "",
    twPopped: 0, // popped (default) or inline
    twPoppedWidth: "",
    twPoppedHeight: "",
    twEmmetUrl: "", // emmet.js version must be for CodeMirror
    twViewInlineButtonText: "View Inline",
    twCloseButtonText: "Close",
    twInlineWidth: "auto",
    twInlineHeight: 250
  },
  toolbar: "code",
  contextmenu: "code"
});
```
This will replace that old pesty-looking native viewer you are used to.

##ENJOY
