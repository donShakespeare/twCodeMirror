/*
  jquery.twCodeMirror.js 
  View your TinyMCE source code in the best Code editor, CodeMirror - pure CDN!
  Sidebyside or popped up - with live preview - no nonsense!

  https://github.com/donShakespeare/twCodeMirror
  Demo: http://www.leofec.com/modx-revolution/
  (c) 2015 by donShakespeare for MODx awesome TinymceWrapper

  Usage:

  tinymce.init({
    external_plugins: {
      twCodeMirror: "[[++assets_url]]components/tinymcewrapper/tinymceplugins/twCodeMirror.js", // plugin location
    },
    toolbar: "code"
});
*/

function popMirror(target, title, width, height, okay) {
  $("[class^=coderButton]").hide();
  target = $(target);
  var $inline = $('<div>').hide().insertBefore(target);
  tinymce.activeEditor.windowManager.open({
    title: title ? title : "Modal Window",
    width: width ? width : $(target).width(),
    height: height ? height : $(target).height(),
    classes: "popCode",
    style: "padding:10px;",
    // autoScroll: true,
    items: [{
      classes: "popCodeMirror",
      type: 'container',
      onPostRender: function() {
        $(target).appendTo(".mce-popCodeMirror > .mce-container-body");
        $(".mce-popCode .mce-close").on("click", function(e) {
          $("[class^=coderButton]").show();
          $inline.replaceWith(target);
          tinymce.activeEditor.windowManager.close();
          e.preventDefault;
        });
      }
    }],
    buttons: [{
      text: okay ? okay : "Okay",
      onclick: function() {
        $("[class^=coderButton]").show();
        $inline.replaceWith(target);
        tinymce.activeEditor.windowManager.close();
      }
    }]
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
  // target.html($(".coder textarea").val()); //use without codemirrow
  tinymce.get(target).windowManager.confirm("Done? Your content will be updated upon closing...", function(s) {
    if (s) {
      $("#" + target).html(window["codeT" + target].getValue());
      $(".coder." + target).remove();
      if(tinymce.get(target).getParam("inline")){
         $("#" + target).fadeIn(); //for frontend only
          $("#tinymceWrapperBubbleNP").removeAttr("style"); //for frontend only
      }
    } else {
      return false;
    }
  })
}

function popCode(target) {
  popMirror(".coder."+target, "CodeMirror HTML Source Code", '', '', "Close")
}
tinymce.PluginManager.add('twCodeMirror', function(editor) {
  var target = $("#" + editor.id);

  //editor.getContent({format : 'raw'})
  //or
  //getContent({source_view: true})
  function initMirr() {
    if (!$('.coder.' + editor.id).length) {
      var dt = target.attr("data-tiny")
      $("#tinymceWrapperBubbleNP").css("top", "-9900px").css("left", "-9900px");
      if(editor.getParam("inline")){
        var edId = editor.id
      }
      else{
        var edId = editor.getContainer().id
      }
      $("#" + edId).before("<div class='coder " + editor.id +"'><textarea class='codeT' id='codeT" + editor.id + "'>" + editor.getContent({source_view: true}) + "</textarea><button type='button' class='coderButton' title='close' onclick='killCode(\"" + editor.id + "\")'>&#10006;</button><button type='button' class='coderButtonPop' title='pop up' onclick='popCode(\"" + editor.id + "\")'>&#10132;</button>");
      $('.coder.' + editor.id).fadeIn();
      window["codeT" + editor.id] = CodeMirror.fromTextArea(document.getElementById('codeT' + editor.id), {
        mode: "text/html",
        indentOnInit: true,
        lineNumbers: true,
        lineWrapping: true,
        indentUnit: 1,
        tabSize: 1,
        matchBrackets: true,
        styleActiveLine: true,
        autoCloseTags: true,
        showTrailingSpace: true,
        extraKeys: {
          "Ctrl-Space": "autocomplete"
        }
      });
      window["codeT" + editor.id].on("mouseup keyup", function() {
        editor.setContent(window["codeT" + editor.id].getValue());
      })
      editor.on("mouseup keyup", function() {
          window["codeT" + editor.id].getDoc().setValue(editor.getContent({source_view: true}));
        })
    } else {
      tinymce.get(editor.id).windowManager.alert("Source code is already open")
    }
  }

  function loadAll() {
    var mainCss = '<style>.codeT,.coder{position:relative}.mce-popCode *,.mce-popNPfields *{white-space:normal!important}.codeT{width:100%;resize:vertical;color:#000;min-height:300px;margin:0 auto}.coderButton,.coderButtonPop{cursor:pointer;position:absolute;border-radius:50%;color:#000;z-index:9}.coderButton{top:-20px;right:0;}.coderButtonPop{top: -20px;right: 30px;}.CodeMirror{border:1px solid #eee;min-height:300px!important;text-align:left!important}.cm-trailingspace{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QUXCToH00Y1UgAAACFJREFUCNdjPMDBUc/AwNDAAAFMTAwMDA0OP34wQgX/AQBYgwYEx4f9lQAAAABJRU5ErkJggg==);background-position:bottom left;background-repeat:repeat-x}.mce-popCodeMirror,.mce-popCodeMirror .mce-container-body{width:inherit!important}</style>';
    if (typeof CodeMirror == 'undefined') {
      //if you want to use LAB
      // $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.7.0/codemirror.min.css" /><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.7.0/addon/dialog/dialog.min.css" /><link rel="stylesheet" href="https://codemirror.net/addon/hint/show-hint.css" />'+mainCss)
      // $LAB.setOptions({
      //   BasePath: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.7.0/"
      // }).script("codemirror.min.js").wait().script("mode/htmlmixed/htmlmixed.min.js").wait().script("mode/javascript/javascript.min.js").script("mode/xml/xml.min.js").script("mode/css/css.min.js").script("addon/wrap/hardwrap.min.js").script("addon/selection/active-line.min.js").script("addon/search/searchcursor.min.js").script("addon/search/search.min.js").script("addon/dialog/dialog.min.js").script("addon/hint/show-hint.min.js").script("addon/hint/html-hint.min.js").script("addon/hint/xml-hint.min.js").script("addon/edit/closetag.min.js").script("addon/edit/trailingspace.min.js").script("addon/fold/xml-fold.min.js").script("addon/edit/matchbrackets.min.js").wait(function() {
      //   setTimeout (function(){
      //   initMirr();
      // },500)
      // });
      var basePath = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.7.0/";
      var scriptLoaderMain = new tinymce.dom.ScriptLoader();
      var scriptLoaderSubs = new tinymce.dom.ScriptLoader();
      tinymce.DOM.loadCSS(basePath+'codemirror.min.css');
      $('head').append(mainCss);
      scriptLoaderMain.add(basePath+'codemirror.min.js');
      scriptLoaderMain.loadQueue(function() {
        scriptLoaderSubs.add(basePath+'mode/htmlmixed/htmlmixed.min.js');
        scriptLoaderSubs.add(basePath+'mode/javascript/javascript.min.js');
        scriptLoaderSubs.add(basePath+'mode/xml/xml.min.js');
        scriptLoaderSubs.add(basePath+'mode/css/css.min.js');
        scriptLoaderSubs.add(basePath+'addon/wrap/hardwrap.min.js');
        scriptLoaderSubs.add(basePath+'addon/selection/active-line.min.js');
        scriptLoaderSubs.add(basePath+'addon/search/searchcursor.min.js');
        scriptLoaderSubs.add(basePath+'addon/search/search.min.js');
        scriptLoaderSubs.add(basePath+'addon/dialog/dialog.min.js');
        scriptLoaderSubs.add(basePath+'addon/hint/show-hint.min.js');
        scriptLoaderSubs.add(basePath+'addon/hint/html-hint.min.js');
        scriptLoaderSubs.add(basePath+'addon/hint/xml-hint.min.js');
        scriptLoaderSubs.add(basePath+'addon/edit/closetag.min.js');
        scriptLoaderSubs.add(basePath+'addon/edit/trailingspace.min.js');
        scriptLoaderSubs.add(basePath+'addon/fold/xml-fold.min.js');
        scriptLoaderSubs.add(basePath+'addon/edit/matchbrackets.min.js');
        scriptLoaderSubs.loadQueue(function() {
          setTimeout (function(){
            initMirr();
          },500)
        })
      });
    } else {
      initMirr();
    }
  }

  editor.addButton('code', {
    // type:'splitbutton',
    icon: 'code',
    tooltip: 'CodeMirror',
    onclick: loadAll
    // menu:[
    //   {
    //     text:'Exit',
    //     onclick:function(){
    //       killCode(editor.id)
    //     }
    //   },
    //   {
    //     text:'Pop out',
    //     onclick:function(){
    //       popCode(editor.id)
    //     }
    //   },
    // ]
  });
  editor.addMenuItem('code', {
    icon: 'code',
    text: 'CodeMirror',
    context: 'tools',
    onclick: loadAll
  });
});
