// Wrapper over imgui draw list with 2d transform

var DrawImGui = {};

DrawImGui.Begin = function()
{
    DrawImGui.dl = ImGui.GetWindowDrawList();
    DrawImGui.t = new paper.Matrix();
    DrawImGui.scale = 1.0;
}

DrawImGui.Scale = function(s)
{
    DrawImGui.scale = s;
    DrawImGui.t.scale(s, s);
}

DrawImGui.Translate = function(translation)
{
    DrawImGui.t.translate(new paper.Point(translation.x, translation.y));
}

DrawImGui.TransformPoint = function(p)
{
    return DrawImGui.t.transform(new paper.Point(p.x, p.y));
}

DrawImGui.ScreenToDrawList = function(p)
{
    var inv_p = DrawImGui.t.inverted().transform(new paper.Point(p.x, p.y));
    return {x:inv_p.x, y:inv_p.y};
}

DrawImGui.IsMouseHoveringRect = function(tl, br)
{
    var tl_t = DrawImGui.TransformPoint(tl);
    var br_t = DrawImGui.TransformPoint(br);
    return ImGui.IsMouseHoveringRect({x:tl_t.x, y:tl_t.y}, {x:br_t.x, y:br_t.y});
}

DrawImGui.AddRectFilled = function(tl, br, col)
{
    var tl_t = DrawImGui.TransformPoint(tl);
    var br_t = DrawImGui.TransformPoint(br);
    
    DrawImGui.dl.AddRectFilled({x:tl_t.x, y:tl_t.y}, {x:br_t.x, y:br_t.y}, col);
}

DrawImGui.AddLine = function(p1, p2, col)
{
    var p1_t = DrawImGui.TransformPoint(p1);
    var p2_t = DrawImGui.TransformPoint(p2);
    
    DrawImGui.dl.AddLine({x:p1_t.x, y:p1_t.y}, {x:p2_t.x, y:p2_t.y}, col);
}

DrawImGui.AddText = function(p, col, txt)
{
    var p_t = DrawImGui.TransformPoint(p);
    DrawImGui.dl.AddText(ImGui.GetFont(), DrawImGui.scale * 14.0, {x:p_t.x, y:p_t.y}, col, txt);
}

DrawImGui.AddCircleFilled = function(p, radius, col, segments)
{
    var p_t = DrawImGui.TransformPoint(p);
    // todo: scale radius
    DrawImGui.dl.AddCircleFilled({x:p_t.x, y:p_t.y}, radius, col, segments);
}

DrawImGui.AddBezierCubic = function(cp1, cp2, cp3, cp4, col, thick, segments)
{
    var cp1_t = DrawImGui.TransformPoint(cp1);
    var cp2_t = DrawImGui.TransformPoint(cp2);
    var cp3_t = DrawImGui.TransformPoint(cp3);
    var cp4_t = DrawImGui.TransformPoint(cp4);
    DrawImGui.dl.AddBezierCubic(cp1_t, cp2_t, cp3_t, cp4_t, col, thick, segments);
}