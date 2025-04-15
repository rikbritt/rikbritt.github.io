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
    DrawImGui.dl.AddCircleFilled({x:p_t.x, y:p_t.y}, radius * DrawImGui.scale, col, segments);
}

DrawImGui.AddBezierCubic = function(cp1, cp2, cp3, cp4, col, thick, segments)
{
    var cp1_t = DrawImGui.TransformPoint(cp1);
    var cp2_t = DrawImGui.TransformPoint(cp2);
    var cp3_t = DrawImGui.TransformPoint(cp3);
    var cp4_t = DrawImGui.TransformPoint(cp4);
    DrawImGui.dl.AddBezierCubic(cp1_t, cp2_t, cp3_t, cp4_t, col, thick, segments);
}

// Idea - use this to wrap DrawImGui
class NodesImDrawList
{
    commands=[];
    AddDrawCommand(type, args)
    {
        this.commands.push( { type:type, args:args });
    }
    PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect = false) {
        this.AddDrawCommand("PushClipRect", [clip_rect_min, clip_rect_max, intersect_with_current_clip_rect]);
    }
    
    PushClipRectFullScreen() { this.AddDrawCommand("PushClipRectFullScreen"); }
    PopClipRect() { this.AddDrawCommand("PopClipRect"); }
    PushTextureID(texture_id) {
        this.AddDrawCommand("PushTextureID", [texture_id]);
    }
    PopTextureID() { this.AddDrawCommand("PopTextureID"); }
    GetClipRectMin(out = new ImVec2()) {
        return this.AddDrawCommand("GetClipRectMin", [out]);
    }
    GetClipRectMax(out = new ImVec2()) {
        return this.AddDrawCommand("GetClipRectMax", [out]);
    }
    AddLine(a, b, col, thickness = 1.0) {
        this.AddDrawCommand("AddLine", [a, b, col, thickness]);
    }
    AddRect(a, b, col, rounding = 0.0, flags = ImGui.ImDrawFlags.None, thickness = 1.0) {
        this.AddDrawCommand("AddRect", [a, b, col, rounding, flags, thickness]);
    }
    AddRectFilled(a, b, col, rounding = 0.0, flags = ImGui.ImDrawFlags.None) {
        this.AddDrawCommand("AddRectFilled", [a, b, col, rounding, flags]);
    }
    AddRectFilledMultiColor(a, b, col_upr_left, col_upr_right, col_bot_right, col_bot_left) {
        this.AddDrawCommand("AddRectFilledMultiColor", [a, b, col_upr_left, col_upr_right, col_bot_right, col_bot_left]);
    }
    AddQuad(a, b, c, d, col, thickness = 1.0) {
        this.AddDrawCommand("AddQuad", [a, b, c, d, col, thickness]);
    }
    AddQuadFilled(a, b, c, d, col) {
        this.AddDrawCommand("AddQuadFilled", [a, b, c, d, col]);
    }
    AddTriangle(a, b, c, col, thickness = 1.0) {
        this.AddDrawCommand("AddTriangle", [a, b, c, col, thickness]);
    }
    AddTriangleFilled(a, b, c, col) {
        this.AddDrawCommand("AddTriangleFilled", [a, b, c, col]);
    }
    AddCircle(centre, radius, col, num_segments = 12, thickness = 1.0) {
        this.AddDrawCommand("AddCircle", [centre, radius, col, num_segments, thickness]);
    }
    AddCircleFilled(centre, radius, col, num_segments = 12) {
        this.AddDrawCommand("AddCircleFilled", [centre, radius, col, num_segments]);
    }
    AddNgon(centre, radius, col, num_segments, thickness = 1.0) {
        this.AddDrawCommand("AddNgon", [centre, radius, col, num_segments, thickness]);
    }
    AddNgonFilled(centre, radius, col, num_segments) {
        this.AddDrawCommand("AddNgonFilled", [centre, radius, col, num_segments]);
    }
    AddText(...args) {
        this.AddDrawCommand("AddText", args);
        // if (args[0] instanceof ImFont) {
        //     const font = args[0];
        //     const font_size = args[1];
        //     const pos = args[2];
        //     const col = args[3];
        //     const text_begin = args[4];
        //     const text_end = args[5] || null;
        //     const wrap_width = args[6] = 0.0;
        //     const cpu_fine_clip_rect = args[7] || null;
        //     this.AddDrawCommand("AddText_B(font.native, font_size, pos, col, text_end !== null ? text_begin.substring(0, text_end) : text_begin, wrap_width, cpu_fine_clip_rect);
        // }
        // else {
        //     const pos = args[0];
        //     const col = args[1];
        //     const text_begin = args[2];
        //     const text_end = args[3] || null;
        //     this.AddDrawCommand("AddText_A(pos, col, text_end !== null ? text_begin.substring(0, text_end) : text_begin);
        // }
    }
    AddPolyline(points, num_points, col, flags, thickness) {
        this.AddDrawCommand("AddPolyline", [points, num_points, col, flags, thickness]);
    }
    AddConvexPolyFilled(points, num_points, col) {
        this.AddDrawCommand("AddConvexPolyFilled", [points, num_points, col]);
    }
    AddBezierCubic(p1, p2, p3, p4, col, thickness = 1.0, num_segments = 0) {
        this.AddDrawCommand("AddBezierCubic", [p1, p2, p3, p4, col, thickness, num_segments]);
    }
    AddBezierQuadratic(p1, p2, p3, col, thickness = 1.0, num_segments = 0) {
        this.AddDrawCommand("AddBezierQuadratic", [p1, p2, p3, col, thickness, num_segments]);
    }
    AddImage(user_texture_id, a, b, uv_a = ImVec2.ZERO, uv_b = ImVec2.UNIT, col = 0xFFFFFFFF) {
        this.AddDrawCommand("AddImage", [user_texture_id, a, b, uv_a, uv_b, col]);
    }
    AddImageQuad(user_texture_id, a, b, c, d, uv_a = ImVec2.ZERO, uv_b = ImVec2.UNIT_X, uv_c = ImVec2.UNIT, uv_d = ImVec2.UNIT_Y, col = 0xFFFFFFFF) {
        this.AddDrawCommand("AddImageQuad", [user_texture_id, a, b, c, d, uv_a, uv_b, uv_c, uv_d, col]);
    }
    AddImageRounded(user_texture_id, a, b, uv_a, uv_b, col, rounding, flags = ImGui.ImDrawFlags.None) {
        this.AddDrawCommand("AddImageRounded", [user_texture_id, a, b, uv_a, uv_b, col, rounding, flags]);
    }
    PathClear() { this.AddDrawCommand("PathClear"); }
    PathLineTo(pos) { this.AddDrawCommand("PathLineTo", [pos]); }
    PathLineToMergeDuplicate(pos) { this.AddDrawCommand("PathLineToMergeDuplicate", [pos]); }
    PathFillConvex(col) { this.AddDrawCommand("PathFillConvex", [col]); }
    PathStroke(col, flags, thickness = 1.0) { this.AddDrawCommand("PathStroke", [col, flags, thickness]); }
    PathArcTo(centre, radius, a_min, a_max, num_segments = 0) { this.AddDrawCommand("PathArcTo", [centre, radius, a_min, a_max, num_segments]); }
    PathArcToFast(centre, radius, a_min_of_12, a_max_of_12) { this.AddDrawCommand("PathArcToFast", [centre, radius, a_min_of_12, a_max_of_12]); }
    PathBezierCubicCurveTo(p2, p3, p4, num_segments = 0) { this.AddDrawCommand("PathBezierCubicCurveTo", [p2, p3, p4, num_segments]); }
    PathBezierQuadraticCurveTo(p2, p3, num_segments = 0) { this.AddDrawCommand("PathBezierQuadraticCurveTo", [p2, p3, num_segments]); }
    PathRect(rect_min, rect_max, rounding = 0.0, flags = ImGui.ImDrawFlags.None) { this.AddDrawCommand("PathRect", [rect_min, rect_max, rounding, flags]); }
    ChannelsSplit(channels_count) { this.AddDrawCommand("ChannelsSplit", [channels_count]); }
    ChannelsMerge() { this.AddDrawCommand("ChannelsMerge"); }
    ChannelsSetCurrent(channel_index) { this.AddDrawCommand("ChannelsSetCurrent", [channel_index]); }
    AddCallback(callback, callback_data) {
        // const _callback = (parent_list, draw_cmd) => {
        //     callback(new ImDrawList(parent_list), new ImDrawCmd(draw_cmd));
        // };
        this.AddDrawCommand("AddCallback", [callback, callback_data]);
    }
    AddDrawCmd() { this.AddDrawCommand("AddDrawCmd"); }
    
    //PrimReserve(idx_count, vtx_count) { this.native.PrimReserve(idx_count, vtx_count); }
    //PrimUnreserve(idx_count, vtx_count) { this.native.PrimUnreserve(idx_count, vtx_count); }
    //PrimRect(a, b, col) { this.native.PrimRect(a, b, col); }
    //PrimRectUV(a, b, uv_a, uv_b, col) { this.native.PrimRectUV(a, b, uv_a, uv_b, col); }
    //PrimQuadUV(a, b, c, d, uv_a, uv_b, uv_c, uv_d, col) { this.native.PrimQuadUV(a, b, c, d, uv_a, uv_b, uv_c, uv_d, col); }
    //PrimWriteVtx(pos, uv, col) { this.native.PrimWriteVtx(pos, uv, col); }
    //PrimWriteIdx(idx) { this.native.PrimWriteIdx(idx); }
    //PrimVtx(pos, uv, col) { this.native.PrimVtx(pos, uv, col); }
    //_CalcCircleAutoSegmentCount(radius) { return this.native._CalcCircleAutoSegmentCount(radius); }
};