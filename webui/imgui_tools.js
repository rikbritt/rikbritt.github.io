
function UpdateToolsMenu()
{
    UpdateCodeEditorOptions();
    if(ImGui.MenuItem("Colour Picker"))
    {
		OpenWindow("colour_picker", UpdateColourPickerWindow, null);
    }
}

var gPickerCol = new ImGui.Vec4(1.0, 1.0, 1.0, 1.0);
function UpdateColourPickerWindow( close_func, data )
{        
    if(ImGui.Begin("ColourPicker", close_func))
    {
        ImGui.ColorPicker4("##Colour", gPickerCol, ImGui.ColorEditFlags.AlphaBar | ImGui.ColorEditFlags.DisplayRGB | ImGui.ColorEditFlags.DisplayHex | ImGui.ColorEditFlags.DisplayHSV | ImGui.ColorEditFlags.NoSidePreview);

        ImGui.End();
    }
}