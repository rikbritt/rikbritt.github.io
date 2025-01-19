
function UpdateToolsMenu()
{
    UpdateCodeEditorOptions();
    if(ImGui.MenuItem("Colour Picker"))
    {
		OpenWindow("colour_picker", UpdateColourPickerWindow, null);
    }
    if(ImGui.MenuItem("Icons"))
    {
		OpenWindow("icons", UpdateIconsWindow, null);
    }
    if(ImGui.MenuItem("Generate GUID"))
    {
        ImGui.SetClipboardText(bg.CreateGUID());
    }
    if(ImGui.MenuItem("Asset Db"))
    {
        OpenWindow("asset_db", UpdateAssetDbWindow, null);
    }
    if(ImGui.MenuItem("Graph Editor"))
    {
        OpenWindow("graph_editor", UpdateGraphEditorWindow, null);
    }
}

var gPickerCol = new ImGui.Vec4(1.0, 1.0, 1.0, 1.0);
function UpdateColourPickerWindow( close_func, data )
{        
    if(ImGui.Begin("ColourPicker", close_func))
    {
        ImGui.ColorPicker4("##Colour", gPickerCol, ImGui.ColorEditFlags.AlphaBar | ImGui.ColorEditFlags.DisplayRGB | ImGui.ColorEditFlags.DisplayHex | ImGui.ColorEditFlags.DisplayHSV | ImGui.ColorEditFlags.NoSidePreview);
        ImGui.InputFloat4("##norm RGBA", [gPickerCol.x, gPickerCol.y, gPickerCol.z, gPickerCol.w]);
        ImGui.End();
    }
}

function UpdateIconsWindow( close_func )
{
    var AddRowForCharacter = function ( c )
    {
        ImGui.TableNextRow();
        ImGui.TableNextColumn();
        ImGui.Text(c);
        ImGui.TableNextColumn();
        ImGui.PushFont(gIconFont);
        ImGui.Text(c);
        ImGui.PopFont();
    }

    if(ImGui.Begin("Icons", close_func))
    {
        var flags = ImGui.TableFlags.Borders | ImGui.TableFlags.RowBg;
        if (ImGui.BeginTable(id, 2, flags))
        {
            ImGui.TableSetupColumn("Letter");
            ImGui.TableSetupColumn("Icon");
            ImGui.TableHeadersRow();
    
            // a to z
            for (var i = 97; i <= 122; i++)
            {
                AddRowForCharacter(String.fromCharCode(i));
            }
            
            // A to Z
            for (var i = 65; i <= 90; i++)
            {
                AddRowForCharacter(String.fromCharCode(i));
            }

            // 0 to 9
            for (var i = 48; i <= 57; i++)
            {
                AddRowForCharacter(String.fromCharCode(i));
            }

            ImGui.EndTable();
        }
        ImGui.End();
    }
}

// Not a generation graph
var gGraphEditorData = {
    graph:null,
    uml:"",
    newNodeId:"",
    newEdgeFromId:"",
    newEdgeToId:"",
    nodeIdToEdit:"",
    graph_json:""
};

function UpdateGraphEditorWindow(close_func)
{
    if(ImGui.Begin("GraphEditor", close_func))
    {
        if(ImGui.Button("Graph Viewer Window"))
        {
            var graphData = bg.DiGraphToWithNodeData(gGraphEditorData.graph);
            CreateGraphViewerWindow(graphData);
        }
        if(ImGui.Button("Create New Graph"))
        {
            gGraphEditorData.graph = bg.CreateGraph();
        }

        if(gGraphEditorData.graph)
        {
            ImGui.InputText("New Node Id", (_ = gGraphEditorData.newNodeId) => gGraphEditorData.newNodeId = _, 256);
            if(ImGui.Button("Add Node"))
            {
                bg.AddGraphNode(gGraphEditorData.graph, gGraphEditorData.newNodeId);
            }

            if(ImGui.CollapsingHeader("Add Edge.."))
            {
                var addEdgeWidth = ImGui.GetContentRegionAvail().x;
                ImGui.BeginChild("ChildFromNode", new ImGui.Vec2(addEdgeWidth * 0.5, 100), false, 0);
                ImGui.PushID("new_edge_from");
                bg.ForEachGraphNode(
                    gGraphEditorData.graph,
                    function(node)
                    {
                        if(ImGui.Selectable(node.id, node.id == gGraphEditorData.newEdgeFromId))
                        {
                            gGraphEditorData.newEdgeFromId = node.id;
                        }
                    }
                )
                ImGui.PopID();
                ImGui.EndChild();

                ImGui.SameLine();

                ImGui.BeginChild("ChildToNode", new ImGui.Vec2(addEdgeWidth * 0.5, 100), false, 0);
                ImGui.PushID("new_edge_to");
                bg.ForEachGraphNode(
                    gGraphEditorData.graph,
                    function(node)
                    {
                        if(ImGui.Selectable(node.id, node.id == gGraphEditorData.newEdgeToId))
                        {
                            gGraphEditorData.newEdgeToId = node.id;
                        }
                    }
                )
                ImGui.PopID();
                ImGui.EndChild();

                if(ImGui.Button("Add Edge", {x:addEdgeWidth, y:0}))
                {
                    bg.AddGraphEdgeById(gGraphEditorData.graph, gGraphEditorData.newEdgeFromId, gGraphEditorData.newEdgeToId);
                }
            }
            if(ImGui.CollapsingHeader("Edit Node.."))
            {
                ImGui.BeginChild("ChildNodes", new ImGui.Vec2(addEdgeWidth, 100), false, 0);
                ImGui.PushID("nodes");
                bg.ForEachGraphNode(
                    gGraphEditorData.graph,
                    function(node)
                    {
                        if(ImGui.Selectable(node.id, node.id == gGraphEditorData.nodeIdToEdit))
                        {
                            gGraphEditorData.nodeIdToEdit = node.id;
                        }
                    }
                )
                ImGui.PopID();
                ImGui.EndChild();

                var nodeToEdit = bg.GetGraphNodeById(gGraphEditorData.graph, gGraphEditorData.nodeIdToEdit);
                // TODO - Data
                // TODO - Edges
            }

            if(ImGui.Button("Serialize Graph To JSON"))
            {
                var clipboardText = bg.SerializeGraph(gGraphEditorData.graph);
                ImGui.SetClipboardText(clipboardText);
                gGraphEditorData.graph_json = clipboardText;
            }

            if(ImGui.Button("Deserialize Graph from Clipboard JSON"))
            {
                var clipboardText = ImGui.GetClipboardText();
                gGraphEditorData.graph = bg.DeserializeGraph(clipboardText);
            }

            ImGui.InputTextMultiline("GraphJSON", (_ = gGraphEditorData.graph_json) => gGraphEditorData.graph_json = _, 1024 * 16);

            if(ImGui.Button("Deserialize Graph from Field"))
            {
                gGraphEditorData.graph = bg.DeserializeGraph(gGraphEditorData.graph_json);
            }

            if(ImGui.Button("Generate & Copy UML"))
            {
                gGraphEditorData.uml = bg.DiGraphToUML(gGraphEditorData.graph);
                ImGui.SetClipboardText(gGraphEditorData.uml);
            }
            ImGui.Text(gGraphEditorData.uml);
        }
        ImGui.End();
    }
}