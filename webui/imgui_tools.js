
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
    if(ImGui.Begin("Icons", close_func))
    {
        var flags = ImGui.TableFlags.Borders | ImGui.TableFlags.RowBg;
        if (ImGui.BeginTable(id, 2, flags))
        {
            ImGui.TableSetupColumn("Letter");
            ImGui.TableSetupColumn("Icon");
            ImGui.TableHeadersRow();
    
            for (var i = 97; i <= 122; i++)
            {
                var chr = String.fromCharCode(i);
                ImGui.TableNextRow();
                ImGui.TableNextColumn();
                ImGui.Text(chr);
                ImGui.TableNextColumn();
                ImGui.PushFont(gIconFont);
                ImGui.Text(chr);
                ImGui.PopFont();
            }
            
            ImGui.EndTable();
        }
        ImGui.End();
    }
}