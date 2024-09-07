// Wrapper over imgui draw list with 2d transform

var DrawImGui = {};
var s = 0.0;

DrawImGui.Begin = function()
{
    DrawImGui.dl = ImGui.GetWindowDrawList();
    DrawImGui.t = new paper.Matrix();
    DrawImGui.translate(s, 0);
    s += 0.001;
}

DrawImGui.AddRectFilled = function(tl, br, col)
{
    var tl_t = DrawImGui.t.transform(new paper.Point(tl.x, tl.y));
    var br_t = DrawImGui.t.transform(new paper.Point(br.x, br.y));
    
    DrawImGui.dl.AddRectFilled({x:tl_t.x, y:tl_t.y}, {x:br_t.x, y:br_t.y}, col);
}