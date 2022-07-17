function CreateTimelineContext()
{
    var ctx = {
        draw:ImGui.GetWindowDrawList(),
        x:ImGui.GetCursorScreenPos().x,
        y:ImGui.GetCursorScreenPos().y,
        GetTimeX:function(t) {
            return this.x + (t * 4);
        }
    };
    
    return ctx;
}

function DrawTimelineRange(ctx, name, start, end)
{
    ctx.draw.AddRectFilled({x:ctx.GetTimeX(start),y:ctx.y},{x:ctx.GetTimeX(end),y:ctx.y+20},0xFFFFFFFF );
    ctx.draw.AddText({x:ctx.GetTimeX(start), y:ctx.y+5}, 0xFFFFFF00, name);
}

function AddTimeline(id, timeline)
{
    ImGui.BeginChild(id, new ImGui.Vec2(-1,-1), true, ImGui.ImGuiWindowFlags.HorizontalScrollbar)
    ImGui.BeginChild("TimelineScrollArea", new ImGui.Vec2(500,60));
    var draw_list = ImGui.GetWindowDrawList();
    var p = ImGui.GetCursorScreenPos();

    var ctx = CreateTimelineContext();
    DrawTimelineRange(ctx, "Test Range", 5, 20);

    draw_list.AddLine({x:p.x+5,y:p.y+5}, {x:p.x+210,y:p.y+220},0xFFFFFFFF);

    ImGui.EndChild();
    ImGui.EndChild();
}