function UpdateErrorsWindow(close_func)
{
    if(ImGui.Begin("Errors", close_func))
    {
        for(var e of bg.errors)
        {
            ImGui.Text(e);
        }
    }
}
