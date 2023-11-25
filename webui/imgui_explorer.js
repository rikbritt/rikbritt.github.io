
function ShowExplorerNode(prefix, uid)
{
        // Use object uid as identifier. Most commonly you could also use the object pointer as a base ID.
    ImGui.PushID(uid);

    // Text and Tree nodes are less high than framed widgets, using AlignTextToFramePadding() we add vertical spacing to make the tree lines equal high.
    ImGui.TableNextRow();
    ImGui.TableSetColumnIndex(0);
    ImGui.AlignTextToFramePadding();
    var node_open = ImGui.TreeNode("Object", `${prefix}_${uid}`);
    ImGui.TableSetColumnIndex(1);
    ImGui.Text("my sailor is rich");

    if (node_open)
    {
        var placeholder_members = [ 0.0, 0.0, 1.0, 3.1416, 100.0, 999.0 ]
        for (var i = 0; i < 8; i++)
        {
            ImGui.PushID(i); // Use field index as identifier.
            if (i < 2)
            {
                ShowExplorerNode("Child", 424242);
            }
            else
            {
                // Here we use a TreeNode to highlight on hover (we could use e.g. Selectable as well)
                ImGui.TableNextRow();
                ImGui.TableSetColumnIndex(0);
                ImGui.AlignTextToFramePadding();
                var flags = ImGui.TreeNodeFlags.Leaf | ImGui.TreeNodeFlags.NoTreePushOnOpen | ImGui.TreeNodeFlags.Bullet;
                ImGui.TreeNodeEx("Field", flags, "Field_%d", i);

                ImGui.TableSetColumnIndex(1);
                //ImGui.SetNextItemWidth(-FLT_MIN);
                //if (i >= 5)
                    //ImGui.InputFloat("##value", &placeholder_members[i], 1.0);
                //else
                  //  ImGui::DragFloat("##value", &placeholder_members[i], 0.01f);
                ImGui.NextColumn();
            }
            ImGui.PopID();
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

            // Iterate placeholder objects (all the same data)
            for (var obj_i = 0; obj_i < 4; obj_i++)
            ShowExplorerNode("Object", obj_i);

            ImGui.EndTable();
        }
        ImGui.PopStyleVar();

        ImGui.End();
    }


}