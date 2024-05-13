
var gCodeEditor = {};

function SetupCodeEditor()
{
    gCodeEditor = ace.edit("editor");
    gCodeEditor.setTheme("ace/theme/monokai");
    gCodeEditor.session.setMode("ace/mode/javascript");
}

function SetCodeToEdit(code, name)
{
    gCodeEditor.session.setValue(code);
    document.getElementById("editor_info_script_name").innerText = name;
}