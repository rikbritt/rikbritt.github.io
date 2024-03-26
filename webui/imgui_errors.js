var gErrors = [];

function LogError(error)
{
    if (typeof error === 'string' || error instanceof String)
    {
        gErrors.push(error);
    }
    else
    {
        gErrors.push(error.message);
    }
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
