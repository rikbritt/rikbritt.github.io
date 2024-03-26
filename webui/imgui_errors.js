var gErrors = [];

function LogError(error_text)
{
    gErrors.push(error_text);
}

function UpdateErrorsWindow(close_func)
{
    if(ImGui.Begin("Errors", close_func))
    {
        for(var e in gErrors)
        {
            ImGui.Text(e);
        }
    }
}
