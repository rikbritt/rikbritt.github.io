var gNotes = {};

function UpdateNotesMenu()
{
	for([paramKey, paramData] of Object.entries(gNotes))
	{
        if(ImGui.MenuItem(paramKey))
        {
            gNotes[paramKey].open = true;
        }
    }
}

function AddNotes(category, notes)
{
    gNotes[category] = {open:false, text:notes};
}