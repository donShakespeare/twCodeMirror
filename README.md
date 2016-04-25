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
  twCodeMirrorPoppedOrInline: 1, //1 for popped (default), 0 for inline
  twCodeMirrorEMMETsrcURL: "", // emmet version must be for CodeMirror
  twCodeMirrorSettings: { // pass in any COdeMirror official setting you like to overwrite default behaviour
    ...
   },
  toolbar: "code",
  contextmenu: "code"
});
```
This will replace that old pesty-looking native viewer you are used to.

##ENJOY
