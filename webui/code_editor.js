
var gCodeEditor = {};

function SetupCodeEditor()
{
    gCodeEditor = ace.edit("editor");
    gCodeEditor.setTheme("ace/theme/monokai");
    gCodeEditor.session.setMode("ace/mode/javascript");
}