// Wrapper over imgui draw list with 2d transform

var DrawImGui = {};
var s = 0.0;

DrawImGui.Begin = function()
{
    DrawImGui.dl = ImGui.GetWindowDrawList();
    DrawImGui.t = new paper.Matrix();
    DrawImGui.t.translate(s, 0);
    s += 0.001;
}

DrawImGui.AddRectFilled = function(tl, br, col)
{
    var tl_t = DrawImGui.t.transform(new paper.Point(tl.x, tl.y));
    var br_t = DrawImGui.t.transform(new paper.Point(br.x, br.y));
    
    DrawImGui.dl.AddRectFilled({x:tl_t.x, y:tl_t.y}, {x:br_t.x, y:br_t.y}, col);
}

DrawImGui.AddLine = function(p1, p2, col)
{
    var p1_t = DrawImGui.t.transform(new paper.Point(p1.x, p1.y));
    var p2_t = DrawImGui.t.transform(new paper.Point(p2.x, p2.y));
    
    DrawImGui.dl.AddLine({x:p1_t.x, y:p1_t.y}, {x:p2_t.x, y:p2_t.y}, col);
}

DrawImGui.AddText = function(p, col, txt)
{
    var p_t = DrawImGui.t.transform(new paper.Point(p.x, p.y));    
    DrawImGui.dl.AddText({x:p_t.x, y:p_t.y}, col, txt);
}