function ShowExplorerNode(node)
{
        // Use object uid as identifier. Most commonly you could also use the object pointer as a base ID.
    ImGui.PushID(node.id);

    // Text and Tree nodes are less high than framed widgets, using AlignTextToFramePadding() we add vertical spacing to make the tree lines equal high.
    ImGui.TableNextRow();
    ImGui.TableSetColumnIndex(0);
    ImGui.AlignTextToFramePadding();
    var node_icon = node.GetNodeIcon == null ? "" : node.GetNodeIcon();
    var node_name = node.GetNodeName();
    var node_children = node.GetNodeChildren();
    var node_has_children = node_children.length > 0;
    var UpdateNodeContextMenu = function()
    {
        var node_has_context_menu = node.UpdateContextMenu != null;
        if (node_has_context_menu && ImGui.BeginPopupContextItem("node context menu"))
        {
            node.UpdateContextMenu();
            ImGui.EndPopup();
        }
    };
    
    var node_open = false;
    if(node_has_children)
    {
        if(node_icon != "")
        {
            ImGui.PushFont(gIconFont);
            node_open = ImGui.TreeNode(node_icon);
            ImGui.PopFont();
            UpdateNodeContextMenu();
            ImGui.SameLine();
            ImGui.Text(node_name);
        }
        else
        {
            node_open = ImGui.TreeNode(node_name);
            UpdateNodeContextMenu();
        }
    }
    else
    {
        ImGui.AlignTextToFramePadding();
        var flags = ImGui.TreeNodeFlags.Leaf | ImGui.TreeNodeFlags.NoTreePushOnOpen | ImGui.TreeNodeFlags.Bullet;
        if(node_icon != "")
        {
            ImGui.PushFont(gIconFont);
            ImGui.TreeNodeEx("Field", flags, node_icon);
            ImGui.PopFont();
            UpdateNodeContextMenu();
            ImGui.SameLine();
            ImGui.Text(node_name);
        }
        else
        {
            ImGui.TreeNodeEx("Field", flags, node_name);
            UpdateNodeContextMenu();
        }
    }
    ImGui.TableSetColumnIndex(1);
    if(node.UpdateNodeValue != null)
    {
        node.UpdateNodeValue();
    }
    else
    {
        ImGui.Text("-");
    }

    if (node_open)
    {
        for(var child of node_children)
        {
            ShowExplorerNode(child);
        }
        ImGui.TreePop();
    }
    ImGui.PopID();
}

function UpdateExplorerWindow( close_func, data )
{
    var viewport = ImGui.GetMainViewport();
    ImGui.SetNextWindowPos(viewport.WorkPos);
    ImGui.SetNextWindowSize({x:400,y:viewport.WorkSize.y});
        
    if(ImGui.Begin("Explorer", null, ImGui.WindowFlags.NoTitleBar | ImGui.WindowFlags.NoResize | ImGui.WindowFlags.NoBringToFrontOnFocus ))
    {
        ImGui.PushStyleVar(ImGui.StyleVar.FramePadding, {x:2, y:2});
        if (ImGui.BeginTable("##split", 2, ImGui.TableFlags.BordersOuter | ImGui.TableFlags.Resizable | ImGui.TableFlags.ScrollY))
        {            
            for(var i=0; i<bg.projects.length; ++i)
            {
                var node = CreateExplorerNodeForProject(bg.projects[i]);
                ShowExplorerNode(node);
            }

            var global_db_node = CreateExplorerAssetDbNode(gAssetDb, "global_db");
            ShowExplorerNode(global_db_node);

            ImGui.EndTable();
        }
        ImGui.PopStyleVar();
        ImGui.End();
    }
}