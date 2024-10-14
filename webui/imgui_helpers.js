function GetSortedObjectKeys(obj)
{
    var entries = Object.keys(obj);
    var sorted = entries.sort();
    return sorted;
}

ImGui.HelpMarker = function(str)
{
    ImGui.TextDisabled("(?)");
    if (ImGui.IsItemHovered())
    {
        ImGui.BeginTooltip();
        ImGui.PushTextWrapPos(ImGui.GetFontSize() * 35.0);
        ImGui.TextUnformatted(str);
        ImGui.PopTextWrapPos();
        ImGui.EndTooltip();
    }
}

ImGui.DeleteButton = function(id)
{
    ImGui.PushStyleColor(ImGui.Col.Button, new ImGui.Vec4(0.9800000190734863, 0.25999999046325684, 0.25999999046325684, 0.4000000059604645));
    ImGui.PushStyleColor(ImGui.Col.ButtonHovered, new ImGui.Vec4(1, 0.25882354378700256, 0.25882354378700256, 1));
    ImGui.PushStyleColor(ImGui.Col.ButtonActive, new ImGui.Vec4(0.9800000190734863, 0.060000088065862656, 0.060000088065862656, 1));
    var clicked = ImGui.Button(id);
    ImGui.PopStyleColor(3);
    return clicked;    
}

ImGui.CreateButton = function(id)
{
    ImGui.PushStyleColor(ImGui.Col.Button, new ImGui.Vec4(0.20587322115898132, 0.6795580387115479, 0.18396873772144318, 0.4000000059604645));
    ImGui.PushStyleColor(ImGui.Col.ButtonHovered, new ImGui.Vec4(0.20587322115898132, 0.6795580387115479, 0.18396873772144318, 1));
    ImGui.PushStyleColor(ImGui.Col.ButtonActive, new ImGui.Vec4(0.20587322115898132, 0.6795580387115479, 0.18396873772144318, 1));
    var clicked = ImGui.Button(id);
    ImGui.PopStyleColor(3);
    return clicked;    
}