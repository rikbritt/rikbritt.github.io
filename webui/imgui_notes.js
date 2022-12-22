var gNotes = {};

function UpdateNotesMenu()
{
    if(ImGui.MenuItem("Notes"))
    {
        OpenWindow("Notes", UpdateNotesWindow);
    }
}

function AddNotes(category, notes)
{
    gNotes[category] = {text:notes};
}

function UpdateNotesWindow(close_func)
{
    if(ImGui.Begin("Notes", close_func))
    {
        if(ImGui.BeginTabBar("Notes_Tab"))
        {
            for([paramKey, paramData] of Object.entries(gNotes))
            {
                if(ImGui.BeginTabItem(paramKey))
                {
                    ImGui.Text(paramData.text);
                    ImGui.EndTabItem();
                }
            }
            ImGui.EndTabBar();
        }
    }
    ImGui.End();
}