
var gCodeEditor = {};
var gCodeEditorWindow = 0;
var gCurrentCodeProp = null;

function SetupCodeEditor()
{    
    //TODO - make this a url param?
    //gCodeEditorWindow = window.open("code_editor.html", "code_editor", "status=0,location=0,toolbar=0,menubar=0,addressbar=0,width=1280,height=720");

    
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
}

function UpdateCodeEditorOptions()
{
    if(ImGui.MenuItem("Reopen Code Editor Window"))
    {
        gCodeEditorWindow = window.open("code_editor.html", "code_editor", "status=0,location=0,toolbar=0,menubar=0,addressbar=0,width=1280,height=720");
        if(gCurrentCodeProp)
        {
            SetCodeToEdit(gCurrentCodeProp, "?");
        }
    }
}