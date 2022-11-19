var gNotes = {};
var gShowNotes = false;

function UpdateNotesMenu()
{
    if(ImGui.MenuItem("Notes"))
    {
        gShowNotes = true;
    }
}

function AddNotes(category, notes)
{
    gNotes[category] = {text:notes};
}

function UpdateNotesWindow()
{
    if(gShowNotes)
    {
        if(ImGui.Begin("Notes",  (_ = gShowNotes) => gShowNotes = _))
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
}