/*
  jquery.twCodeMirror.js 
  View your TinyMCE source code in the best Code editor, CodeMirror - pure CDN!
  Sidebyside or popped up - with live preview - no nonsense!

  https://github.com/donShakespeare/twCodeMirror
  Demo: http://www.leofec.com/modx-revolution/
  (c) 2016 by donShakespeare for MODx awesome TinymceWrapper

  Usage:

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
*/
codeMirrorInnerInitRTE = function(userCodeMirrorSettings) {
  var defaultCodeMirrorSettings = {
      mode: "htmlmixed",
      theme: "",
      indentOnInit: true,
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      indentUnit: 1,
      tabSize: 1,
      matchBrackets: true,
      styleActiveLine: true,
      autoCloseTags: true,
      showTrailingSpace: true,
      // viewportMargin: Infinity,
      extraKeys: {
        "Ctrl-Space": "autocomplete",
        "Alt-F": "findPersistent",
        "F11": function(cm) {
          cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        "Esc": function(cm) {
          if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        },
        "Ctrl-Q": function(cm){
          cm.foldCode(cm.getCursor());
         }
      }
    }
  var settings = $.extend({}, defaultCodeMirrorSettings, userCodeMirrorSettings);
  return settings;
}
function popMirror(target, title, width, height, okay) {
  target = $(target);
  targetid = target.attr("id");
  var $inline = $('<div>').hide().insertBefore(target);
  tinymce.activeEditor.windowManager.open({
    title: title ? title : "Modal Window",
    width: width ? width : $(target).width(),
    height: 300,
    classes: "popCode",
    items: [{
      classes: "popCodeMirror",
      type: 'container',
      onPostRender: function() {
        $(target).appendTo(".mce-popCodeMirror > .mce-container-body");
        setTimeout(function(){
          $(".mce-popCode").removeClass("mce-container").find("*").removeClass("mce-container");
          $(".mce-popCode .mce-close").remove();
        },100)
      }
    }],
    buttons: [
      {
        text: okay ? okay : "Okay",
        active: true,
        onclick: function() {
          // $("[class^=coderButton]").show();
          $inline.replaceWith(target);
          tinymce.activeEditor.windowManager.close();
        }
      }
    ]
  });

}

//want to use LAB? uncomment these lines
// (function() {
//   function async_load() {
//     var s = document.createElement('script');
//     s.type = 'text/javascript';
//     s.async = true;
//     s.src = 'https://cdnjs.cloudflare.com/ajax/libs/labjs/2.0.3/LAB.min.js';
//     var x = document.getElementsByTagName('script')[0];
//     x.parentNode.insertBefore(s, x);
//   }
//   if (window.attachEvent) window.attachEvent('onload', async_load);
//   else window.addEventListener('load', async_load, false);
// })();

function killCode(target) {
  // target.html($(".coder textarea").val()); //use without codemirror
  // tinymce.activeEditor.windowManager.confirm("Done? Your content will be updated upon closing...", function(s) {
    // if (s) {
      codeMirrorSetContentsilent = true;
      $("#" + target).html(window["codeT" + target].getValue());
      window["codeT" + target].toTextArea();
      $(".coder." + target).remove();
      tinymce.activeEditor.windowManager.close();
    // }
     // else {
      // return false;
    // }
  // })
}

function popCode(target) {
  var width = window.innerWidth / 1.2;
  popMirror(".coder."+target, "CodeMirror HTML Source Code", width, '', "View Inline")
}
tinymce.PluginManager.add('twCodeMirror', function(editor) {
  var target = $("#" + editor.id);

  //editor.getContent({format : 'raw'})
  //or
  //getContent({source_view: true})
  function initMirr(justPop) {
    if (justPop == 1) {
      popCode(editor.id);
    }
    // else if (!$('.coder.' + editor.id).length) {
    else if (justPop == 0) {
      var dt = target.attr("data-tiny")
      $("#tinymceWrapperBubbleNP").css("top", "-9900px").css("left", "-9900px");

      // for making CodeMirror wrapper same width as RTE editor
      var tarClass = ''; 
      var tarWidth = ''; //not recommended

      if(editor.getParam("inline")){
        var edId = editor.id;
        // var tarClass = " " + $("#"+edId).attr('class');
        // var tarWidth = $("#"+edId).width()+'px';
        // var tarWidth = 'style="width:'+tarWidth+';"';
      }
      else{
        var edId = editor.getContainer().id;
        // var tarWidth = $("#"+edId).width()+'px';
        // var tarWidth = 'style="width:'+tarWidth+';"';
      }
      $("#" + edId).before("<div " + tarWidth + " class='coder " + editor.id + tarClass +"'><span type=button onclick='killCode(\"" + editor.id + "\")' class=mce-close-button><i class='mce-ico mce-i-remove'></i></span><textarea class='codeT' id='codeT" + editor.id + "'>" + editor.getContent({source_view: true}) + "</textarea>");
      $('.coder.' + editor.id).fadeIn();
      window["codeT" + editor.id] = CodeMirror.fromTextArea(document.getElementById('codeT' + editor.id), codeMirrorInnerInitRTE(editor.getParam("twCodeMirrorSettings",{})));
      if(editor.getParam("twCodeMirrorSettings",{}).fontSize){
        var fontSize = editor.getParam("twCodeMirrorSettings").fontSize;
      }
      else{
        var fontSize = 15;
      }
      $(".coder." + editor.id + " .CodeMirror").css("font-size", fontSize)

      window["codeT" + editor.id].refresh();
      if(typeof emmetCodeMirror !== 'undefined'){
        emmetCodeMirror(window["codeT" + editor.id]);
      }
      codeMirrorSetContentsilent = false;
      window["codeT" + editor.id].on("keyup", function() {
        if (codeMirrorSetContentsilent){
         return;
        }
        else{
          editor.setContent(window["codeT" + editor.id].getValue());
        }
      })
      editor.on("keyup", function() {
          codeMirrorSetContentsilent = true;
          // window["codeT" + editor.id].getDoc().setValue(editor.getContent({source_view: true}));
          window["codeT" + editor.id].getDoc().setValue(editor.getContent());
          codeMirrorSetContentsilent = false;
      })
      if(editor.getParam("twCodeMirrorPoppedOrInline",1) == 1){
        popCode(editor.id)
      }
    } 
    else {
      if (!$('.coder.' + editor.id).length) {
        initMirr(0)
      }
      else{
        popCode(editor.id)
      }
    }
  }

  function loadAll(style) {
    var mainCss = '<style id="mainCSScodeMIrror">.x-window-body{overflow-x:hidden!important;}.codeT,.coder{position:relative}.codeT{width:100%;resize:vertical;color:#000;min-height:300px;margin:0 auto}.mce-popCode .CodeMirror{height:300px;}.CodeMirror{border:1px solid #eee;text-align:left!important}.cm-trailingspace{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QUXCToH00Y1UgAAACFJREFUCNdjPMDBUc/AwNDAAAFMTAwMDA0OP34wQgX/AQBYgwYEx4f9lQAAAABJRU5ErkJggg==);background-position:bottom left;background-repeat:repeat-x}.mce-popCodeMirror,.mce-popCodeMirror .mce-container-body{width:inherit!important}.coder > .mce-close-button{position:absolute;z-index:9;right:25px;top:0px;cursor:pointer;}.coder > .mce-close-button > .mce-ico{font-size:11px; color:red;}</style>';
    if(!$("#mainCSScodeMIrror").length){
      $('head').append(mainCss);
    }
    if (typeof CodeMirror == 'undefined') {
      var basePath = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.14.2/";
      var scriptLoaderMain = new tinymce.dom.ScriptLoader();
      var scriptLoaderSubs = new tinymce.dom.ScriptLoader();
      tinymce.DOM.loadCSS(basePath+'codemirror.min.css');
      tinymce.DOM.loadCSS(basePath+'addon/dialog/dialog.css');
      tinymce.DOM.loadCSS(basePath+'addon/search/matchesonscrollbar.css');
      tinymce.DOM.loadCSS(basePath+'addon/display/fullscreen.css');
      tinymce.DOM.loadCSS(basePath+'addon/fold/foldgutter.css');
      if(editor.getParam("twCodeMirrorSettings",{}).theme){
        tinymce.DOM.loadCSS(basePath+'theme/'+editor.getParam("twCodeMirrorSettings").theme+'.css');
      }
      scriptLoaderMain.add(basePath+'codemirror.min.js');
      scriptLoaderMain.loadQueue(function() {
        if(typeof emmetCodeMirror == 'undefined' && editor.getParam("twCodeMirrorEMMETsrcURL")){
          scriptLoaderMain.add(editor.getParam("twCodeMirrorEMMETsrcURL"));
        }
        scriptLoaderSubs.add(basePath+'addon/wrap/hardwrap.min.js');
        scriptLoaderSubs.add(basePath+'addon/selection/active-line.min.js');
        scriptLoaderSubs.add(basePath+'addon/search/searchcursor.min.js');
        scriptLoaderSubs.add(basePath+'addon/scroll/annotatescrollbar.js');
        scriptLoaderSubs.add(basePath+'addon/search/matchesonscrollbar.js');
        scriptLoaderSubs.add(basePath+'addon/search/jump-to-line.min.js');
        scriptLoaderSubs.add(basePath+'addon/search/search.min.js');
        scriptLoaderSubs.add(basePath+'addon/dialog/dialog.min.js');
        scriptLoaderSubs.add(basePath+'addon/hint/show-hint.min.js');
        scriptLoaderSubs.add(basePath+'addon/hint/html-hint.min.js');
        scriptLoaderSubs.add(basePath+'addon/hint/xml-hint.min.js');
        scriptLoaderSubs.add(basePath+'addon/edit/closetag.min.js');
        scriptLoaderSubs.add(basePath+'addon/edit/trailingspace.min.js');
        scriptLoaderSubs.add(basePath+'addon/display/fullscreen.js');
        scriptLoaderSubs.add(basePath+'addon/fold/foldcode.js');
        scriptLoaderSubs.add(basePath+'addon/fold/foldgutter.js');
        scriptLoaderSubs.add(basePath+'addon/fold/brace-fold.js');
        scriptLoaderSubs.add(basePath+'addon/fold/xml-fold.js');
        scriptLoaderSubs.add(basePath+'addon/fold/comment-fold.js');
        scriptLoaderSubs.add(basePath+'addon/edit/matchbrackets.min.js');
        scriptLoaderSubs.add(basePath+'mode/htmlmixed/htmlmixed.min.js');
        scriptLoaderSubs.add(basePath+'mode/javascript/javascript.min.js');
        scriptLoaderSubs.add(basePath+'mode/xml/xml.min.js');
        scriptLoaderSubs.add(basePath+'mode/css/css.min.js');
        // scriptLoaderSubs.add(basePath+'mode/clike/clike.js');
        // scriptLoaderSubs.add(basePath+'mode/php/php.min.js');
        scriptLoaderSubs.loadQueue(function() {
          setTimeout (function(){
            initMirr(style);
          },500)
        })
      });
    } else {
      initMirr(style);
    }
  }

  editor.addButton('code', {
    type: "menubutton",
    classes: "twCoderM",
    icon: 'code',
    tooltip: 'Toggle CodeMirror',
    onPostRender: function(){
      $(".mce-twCoderM .mce-caret").remove();
    },
    onclick: function(){
      if ($('.coder.' + editor.id).length) {
        $(".mce-"+editor.id+"popSource").parent().parent().css("visibility", "visible");
      }
      else{
        $(".mce-"+editor.id+"popSource").parent().parent().css("visibility", "hidden");
        loadAll(0)
      }
    },
    menu:[
      {
        text:"Pop Source",
        classes: editor.id + "popSource",
        onclick: function(){
          if ($('.coder.' + editor.id).length) {
            loadAll()
          }
        }
      }
      // ,{
      //   text:"Close Source",
      //   classes: editor.id + "closeSource",
      //   onclick: function(){
      //     killCodeCodeMirror(editor.id)
      //   }
      // }
    ]

  });
  editor.addMenuItem('code', {
    icon: 'code',
    text: 'CodeMirror',
    context: 'tools',
    onclick: function(){
      loadAll()
    }
  });
});
