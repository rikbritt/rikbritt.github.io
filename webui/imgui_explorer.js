var ExplorerNodeType =
{
    Project:"project",
    ProjectGraphs:"graphs",
    ProjectDataDefs:"data_defs",
    ProjectGenerators:"generators"
}

function ShowExplorerNode(node)
{
        // Use object uid as identifier. Most commonly you could also use the object pointer as a base ID.
    ImGui.PushID(node.id);

    // Text and Tree nodes are less high than framed widgets, using AlignTextToFramePadding() we add vertical spacing to make the tree lines equal high.
    ImGui.TableNextRow();
    ImGui.TableSetColumnIndex(0);
    ImGui.AlignTextToFramePadding();
    var node_name = "";
    var node_has_children = false;
    switch(node.type)
    {
        case ExplorerNodeType.Project:
            node_name = `Project : ${node.project.name}`;
            node_has_children = true;
            break;
        case ExplorerNodeType.ProjectGraphs:
            node_name = "Graphs";
            node_has_children = true;
            break;
        case ExplorerNodeType.ProjectDataDefs:
            node_name = "Data Defs";
            node_has_children = true;
            break;
        case ExplorerNodeType.ProjectGenerators:
            node_name = "Generators";
            node_has_children = true;
            break;
    }
    var node_open = false;
    if(node_has_children)
    {
        node_open = ImGui.TreeNode(node_name);
    }
    else
    {
        ImGui.AlignTextToFramePadding();
        var flags = ImGui.TreeNodeFlags.Leaf | ImGui.TreeNodeFlags.NoTreePushOnOpen | ImGui.TreeNodeFlags.Bullet;
        ImGui.TreeNodeEx("Field", flags, node_name);
    }
    ImGui.TableSetColumnIndex(1);
    ImGui.Text("Node Val");

    if (node_open)
    {
        switch(node.type)
        {
            case ExplorerNodeType.Project:
                ShowExplorerNode({
                    type:ExplorerNodeType.ProjectGraphs,
                    project:node.project,
                    id:node.id
                });
                ShowExplorerNode({
                    type:ExplorerNodeType.ProjectDataDefs,
                    project:node.project,
                    id:node.id
                });
                ShowExplorerNode({
                    type:ExplorerNodeType.ProjectGenerators,
                    project:node.project,
                    id:node.id
                });
                break;
            case ExplorerNodeType.ProjectGraphs:
                break;
            case ExplorerNodeType.ProjectDataDefs:
                break;
            case ExplorerNodeType.ProjectGenerators:
                break;
        }
        ImGui.TreePop();
    }
    ImGui.PopID();
}

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
            ImGui.PushID(i);
            ImGui.Separator();
            ImGui.Text("Project - " + project.name);
            if(ImGui.Button("Save Project"))
            {
                SaveProjectToZip(project);
            }
            ImGui.SameLine();
            if(ImGui.Button("Close Project"))
            {
                bg.projects.splice(i, 1);
                i -= 1;
            }
            else
            {
                UpdateProjectProperties(bg.projects[i]);
            }
            ImGui.PopID();
        }
        
        ImGui.PushStyleVar(ImGui.StyleVar.FramePadding, {x:2, y:2});
        if (ImGui.BeginTable("##split", 2, ImGui.TableFlags.BordersOuter | ImGui.TableFlags.Resizable | ImGui.TableFlags.ScrollY))
        {
            ImGui.TableSetupScrollFreeze(0, 1);
            ImGui.TableSetupColumn("Node");
            ImGui.TableSetupColumn("Value");
            ImGui.TableHeadersRow();

            
            for(var i=0; i<bg.projects.length; ++i)
            {
                var node = {
                    type:ExplorerNodeType.Project,
                    project:bg.projects[i],
                    id:project.id
                }
                ShowExplorerNode(node);
            }

            ImGui.EndTable();
        }
        ImGui.PopStyleVar();

        ImGui.End();
    }


}