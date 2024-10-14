
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

