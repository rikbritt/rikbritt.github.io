
var gCodeEditor = {};
var gCodeEditorWindow = 0;
var gCurrentCodeProp = null;

function SetupCodeEditor()
{
    // gCodeEditor = ace.edit("editor");
    // gCodeEditor.setTheme("ace/theme/monokai");
    // gCodeEditor.session.setMode("ace/mode/javascript");
    
    gCodeEditorWindow = window.open("code_editor.html", "code_editor", "status=0,location=0,toolbar=0,menubar=0,addressbar=0,width=1280,height=720");

    
    (window.addEventListener || window.attachEvent)(
        (window.attachEvent && "on" || "") + "message", 
        function (evt) 
        {
            var data = evt.data; // this is the data sent to the window
            gCurrentCodeProp(data.code);            
        },
        false
    );
}

function SetCodeToEdit(code_prop, name)
{
    gCurrentCodeProp = code_prop;
    gCodeEditorWindow.postMessage({code:code_prop(), name:name}, "*");

    // if(gCodeEditor.changeListener != null)
    // {
    //     gCodeEditor.session.removeListener('change', gCodeEditor.changeListener);
    // }
    // gCodeEditor.session.setValue(code_prop());
    // document.getElementById("editor_info_script_name").innerText = name;
    // gCodeEditor.changeListener = gCodeEditor.session.on('change', function() {
    //     code_prop(gCodeEditor.session.getValue());
    //   });
}

function UpdateCodeEditorOptions()
{
    if(ImGui.MenuItem("Reopen Code Editor Window"))
    {
        gCodeEditorWindow = window.open("code_editor.html", "code_editor", "status=0,location=0,toolbar=0,menubar=0,addressbar=0,width=1280,height=720");
    }
}