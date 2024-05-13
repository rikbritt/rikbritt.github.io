
var gCodeEditor = {};

function SetupCodeEditor()
{
    gCodeEditor = ace.edit("editor");
    gCodeEditor.setTheme("ace/theme/monokai");
    gCodeEditor.session.setMode("ace/mode/javascript");
}

function SetCodeToEdit(code_prop, name)
{
    gCodeEditor.session.setValue(code_prop());
    document.getElementById("editor_info_script_name").innerText = name;
    gCodeEditor.session.on('change', function() {
        code_prop(gCodeEditor.session.getValue());
      });
}