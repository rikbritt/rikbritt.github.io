var gCurrentProject = null;

function UpdateProjectsList()
{
    if(ImGui.BeginMenu("Open Project..."))
    {
        for(var i=0; i<bg.projects.length; ++i)
        {
            if(ImGui.MenuItem(bg.projects[i].name))
            {
                gCurrentProject = bg.projects[i];
            }
        }
        ImGui.EndMenu();
    }
}