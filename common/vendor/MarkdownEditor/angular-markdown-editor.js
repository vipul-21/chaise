/**
* @desc
* The angular-markdown-editor is a third party directive to manipulate markdown in textarea.
* The source can be found at: https://github.com/ghiscoding/angular-markdown-editor

* The directive can be used as an attribute tag.
* <textarea name="editor1" class="content-box"
*		ng-model="editor1"
*		markdown-editor="{'iconlibrary': 'glyph', addExtraButtons: true, resize: 'vertical'}"
*		on-fullscreen="onFullScreenCallback()"
*		on-fullscreen-exit="onFullScreenExitCallback()"
*		rows="10" >
* </textarea>
* It also privdes hooks to write custom handlers for these methods :
* onPreview
* onSave
* onBlur
* onFocus
* onFullscreen
* onFullscreenExit (*)
* onChange
* onSelect
* onShow
*
* These are few optons to manipulate editor behavior:
* 'autofocus', 'saveable', 'iconlibrary', 'hideable', 'width','height','resize','language',
* 'footer','fullscreen','hiddenButtons','initialstate','showButtons','additionalButtons'.
* Note:Only editor feature was used from this module. Preview was implemented through
* ERMrest markdownIt component
*/
angular
  .module('angular-markdown-editor', [])
  .directive('markdownEditor', ['$rootScope','ERMrest', function ($rootScope,ERMrest) {
    return {
        restrict: 'A',
        require:  'ngModel',
        link: function(scope, element, attrs, ngModel) {
          var options = scope.$eval(attrs.markdownEditor);

            // Only initialize the $.markdown plugin once.
            if (! element.hasClass('processed')) {
                element.addClass('processed');

                // Setup the markdown WYSIWYG.
                  $(element).markdown({
                  autofocus: options.autofocus || false,
                  saveable: options.saveable || false,
                  savable: options.savable || false,
                  iconlibrary: options.iconlibrary || 'glyph',
                  hideable: options.hideable || false,
                  width: options.width || 'inherit',
                  height: options.height || 'inherit',
                  resize: options.resize || 'none',
                  language: options.language || 'en',
                  footer: options.footer || '',
                  fullscreen: options.fullscreen || { enable: true, icons: {}},
                  hiddenButtons: options.hiddenButtons || null,
                  disabledButtons: options.disabledButtons || null,
                  initialstate: options.initialstate || 'editor',
                  parser: options.parser || null,
                  dropZoneOptions: options.dropZoneOptions || null,
                  enableDropDataUri: options.enableDropDataUri || false,
                  showButtons: options.showButtons || null,
                  additionalButtons: options.additionalButtons || (options.addExtraButtons ? addNewButtons() : []),

                  //-- Events/Hooks --
                  // each of them are defined as callback available in the directive
                  // example: <textarea markdown-editor="{'iconlibrary': 'fa'}" on-fullscreen-exit="vm.exitFullScreenCallback()"></textarea>
                  //  NOTE: If you want this one to work, you will have to manually download the JS file, not sure why but they haven't released any versions in a while
                  //       https://github.com/toopay/bootstrap-markdown/tree/master/js
                  onPreview: function (e) {

                      var previewContent = ERMrest.renderMarkdown(e.getContent());
                      runScopeFunction(scope, attrs.onPreview, e);
                      return previewContent;
                   },
                  onPreviewEnd: function (e) { runScopeFunction(scope, attrs.onPreviewEnd, e); },
                  onSave: function (e) { runScopeFunction(scope, attrs.onSave, e); },
                  onBlur: function (e) { runScopeFunction(scope, attrs.onBlur, e); },
                  onFocus: function (e) { runScopeFunction(scope, attrs.onFocus, e); },
                  onFullscreen: function (e) { runScopeFunction(scope, attrs.onFullscreen, e); },
                  onSelect: function (e) { runScopeFunction(scope, attrs.onSelect, e); },
                  onFullscreenExit: function (e) { runScopeFunction(scope, attrs.onFullscreenExit, e); },
                  onChange: function(e) {
                    // When a change occurs, we need to update scope in case the user clicked one of the plugin buttons
                    // (which isn't the same as a keydown event that angular would listen for).
                    ngModel.$setViewValue(e.getContent());

                    runScopeFunction(scope, attrs.onChange, e);
                  },
                  onShow: function (e) {
                    // keep the Markdown Object in $rootScope so that it's available also from anywhere (like in the parent controller)
                    // we will keep this in an object under the ngModel name so that it also works having multiple editor in same controller
                    $rootScope.markdownEditorObjects = $rootScope.markdownEditorObjects || {};
                    $rootScope.markdownEditorObjects[ngModel.$name] = e;
                    if (!!attrs.onShow) {
                      runScopeFunction(scope, attrs.onShow, e);
                    }
                  }
                });
            }
        }
    };
}]);

/**
 * Add new extra buttons: Strikethrough & Table
 * @return mixed additionButtons
 * Few buttons are commented to be added in future versions.
 */

function addNewButtons() {
  return [[
        // {
  //       name: "groupFont",
  //       data: [{
  //         name: "cmdStrikethrough",
  //         toggle: false,
  //         title: "Strikethrough",
  //         icon: {
  //           fa: "fa fa-strikethrough",
  //           glyph: "glyphicon glyphicon-minus"
  //         },
  //         callback: function(e) {
  //           // Give/remove ~~ surround the selection
  //           var chunk, cursor, selected = e.getSelection(),
  //             content = e.getContent();
  //
  //           if (selected.length === 0) {
  //             // Give extra word
  //             chunk = e.__localize('strikethrough');
  //           } else {
  //             chunk = selected.text;
  //           }
  //
  //           // transform selection and set the cursor into chunked text
  //           if (content.substr(selected.start - 2, 2) === '~~' &&
  //             content.substr(selected.end, 2) === '~~') {
  //             e.setSelection(selected.start - 2, selected.end + 2);
  //             e.replaceSelection(chunk);
  //             cursor = selected.start - 2;
  //           } else {
  //             e.replaceSelection('~~' + chunk + '~~');
  //             cursor = selected.start + 2;
  //           }
  //
  //           // Set the cursor
  //           e.setSelection(cursor, cursor + chunk.length);
  //         }
  //       }]
  // },
  // {
  //       name: "groupMisc",
  //       data: [{
  //         name: "cmdTable",
  //         toggle: false,
  //         title: "Table",
  //         icon: {
  //           fa: "fa fa-table",
  //           glyph: "glyphicon glyphicon-th"
  //         },
  //         callback: function(e) {
  //           // Replace selection with some drinks
  //           var chunk, cursor,
  //               selected = e.getSelection(), content = e.getContent(),
  //               chunk = "\n| Tables        | Are           | Cool  | \n"
  //               + "| ------------- |:-------------:| -----:| \n"
  //               + "| col 3 is      | right-aligned | $1600 | \n"
  //               + "| col 2 is      | centered      |   $12 | \n"
  //               + "| zebra stripes | are neat      |    $1 |"
  //
  //           // transform selection and set the cursor into chunked text
  //           e.replaceSelection(chunk)
  //           cursor = selected.start
  //
  //           // Set the cursor
  //           e.setSelection(cursor,cursor+chunk.length);
  //         }
  //       }]
  // },
  {
      name: "groupUtil",
      data: [{
          name: "cmdModalPrev",
          title: "Fullscreen Preview",
          btnClass: 'btn btn-primary btn-inverted',
          icon: {
              fa: "fa fa-arrows-alt",
              glyph: "glyphicon glyphicon-fullscreen"
          },
          callback: function(e) {
              var name = e.$element[0].name;
              var id = e.$element[0].id;

              var idToS = '#previewLinkId-'+id.slice(0,id.indexOf("-",6))+'-'+name;     //Get rowIndex so that correct form is used during multi-edit preview
              angular.element(idToS).triggerHandler('click');
          }
      }]
  },
  {
      name: "groupLink",
      data: [{
          name: "cmdRidLink",
          title: "RID link",
          btnClass: 'btn btn-default',
          icon: {
              // fa: "fa fa-arrows-alt",
              glyph: "chaise-icon chaise-RID"
          },
          callback: function(e) {
              // Give/remove ~~ surround the selection
              var chunk, cursor, selected = e.getSelection(),
              content = e.getContent();

              if (selected.length === 0) {
                  // Give extra word
                  chunk = e.__localize('<RID>');
              } else {
                  chunk = selected.text;
              }

              // transform selection and set the cursor into chunked text
              if (content.substr(selected.start - 2, 2) === '[[' &&
              content.substr(selected.end, 2) === ']]') {
                  e.setSelection(selected.start - 2, selected.end + 2);
                  e.replaceSelection(chunk);
                  cursor = selected.start - 2;
              } else {
                  e.replaceSelection('[[' + chunk + ']]');
                  cursor = selected.start + 2;
              }

              // Set the cursor
              e.setSelection(cursor, cursor + chunk.length);
          }
      }]
  }
  ]];
}

/** Evaluate a function name passed as string and run it from the scope.
  * The function name could be passed with/without brackets "()", in any case we will run the function
  * @param object self object
  * @param string function passed as a string
  * @param object Markdown Editor object
  * @result mixed result
  */
function runScopeFunction(scope, fnString, editorObject) {
  if (!fnString) {
    return;
  }

  // Find if our function has the brackets "()"
  if (/\({1}.*\){1}/gi.test(fnString)) {
    // if yes then run it through $eval else find it in the scope and then run it. That is the only way to evaluate all arguments of the function
    // we'll have to make the object available in the scope so that we can evaluate it inside the controller
    var lastParenthese = fnString.indexOf(")");
    scope.$markdownEditorObject = editorObject;
    fnString = fnString.replace(")", "$markdownEditorObject)");
    result = scope.$eval(fnString);
  } else {
    var fct = objectFindById(scope, fnString, '.');
    if (typeof fct === "function") {
      result = fct(editorObject);
    }
  }
  return result;
}
