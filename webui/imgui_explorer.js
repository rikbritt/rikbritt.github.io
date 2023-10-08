function UpdateExplorerWindow( close_func, data )
{
    if(ImGui.Begin("Explorer", close_func ))
    {
        if(ImGui.CollapsingHeader("Global"))
        {
            ImGui.Indent();
            ImGui.Text("TODO");
            ImGui.Unindent();
        }

        for(var i=0; i<bg.projects.length; ++i)
        {
            var project = bg.projects[i];
            ImGui.Separator();
            ImGui.Text("Project - " + project.name);
            if(ImGui.Button("Save Project (TODO"))
            {

            }
            ImGui.SameLine();
            if(ImGui.Button("Close Project"))
            {
                bg.projects.splice(i, 1);
                i -= 1;
                continue;
            }
            UpdateProjectProperties(bg.projects[i]);
        }
    }
}