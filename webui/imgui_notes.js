var gNotes = {};

function UpdateNotesMenu()
{
	for([paramKey, paramData] of Object.entries(gNotes))
	{
        if(ImGui.MenuItem(paramKey))
        {
        }
    }
}

function AddNotes(category, notes)
{
    gNotes[category] = notes;
}