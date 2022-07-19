function CreateTimelineContext()
{
    var ctx = {
        draw:ImGui.GetWindowDrawList(),
        x:ImGui.GetCursorScreenPos().x,
        y:ImGui.GetCursorScreenPos().y,
        GetTimeX:function(t) {
            return this.x + (t * 4);
        },
        stream_height:20,
        stream_y:0,
        range_col:0xFFA49780
    };
    
    return ctx;
}

function DrawTimelineRange(ctx, name, start, end)
{
    var ew = ctx.stream_height / 4; //end width
    var hh = ctx.stream_height / 2; //half height
    var ry = ctx.stream_y + ctx.y; //range y
    var rx = ctx.GetTimeX(start); //range x
    var bx = rx + ew; //body start x
    var bex = ctx.GetTimeX(end) - ew; //body end x
    ctx.draw.AddConvexPolyFilled(
        [
            {x:bx, y:ry + ctx.stream_height},
            {x:rx, y:ry + hh},
            {x:bx, y:ry},
            {x:bex,y:ry},
            {x:ctx.GetTimeX(end), y:ry + hh},
            {x:bex, y:ry + ctx.stream_height}
        ], 
        6, 
        ctx.range_col
    );
    
    ctx.draw.PushClipRect({x:bx,y:ctx.y}, {x:bex, y:ry + ctx.stream_height}, true);
    //ctx.draw.AddRectFilled({x:ctx.GetTimeX(start),y:ctx.y},{x:ctx.GetTimeX(end),y:ctx.y+20},0xFFFFFFFF );
    ctx.draw.AddText({x:bx, y:ry+2}, 0xFF0000FF, name);
    ctx.draw.PopClipRect();
}

function AddTimeline(id, timeline)
{
    ImGui.BeginChild(id, new ImGui.Vec2(-1,-1), true, ImGui.ImGuiWindowFlags.HorizontalScrollbar)
    ImGui.BeginChild("TimelineScrollArea", new ImGui.Vec2(500,100));
    var draw_list = ImGui.GetWindowDrawList();
    var p = ImGui.GetCursorScreenPos();

    var ctx = CreateTimelineContext();
    DrawTimelineRange(ctx, "Test Range", 5, 25);
    
    ctx.stream_y = 30;
    DrawTimelineRange(ctx, "Test Range 2", 15, 50);
    
    ctx.stream_y = 60;
    DrawTimelineRange(ctx, "Test Range 3", 15, 50);

    //draw_list.AddLine({x:p.x+5,y:p.y+5}, {x:p.x+210,y:p.y+220},0xFFFFFFFF);

    ImGui.EndChild();
    ImGui.EndChild();
}