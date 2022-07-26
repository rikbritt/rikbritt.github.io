function CreateTimelineContext()
{
    var ctx = {
        draw:ImGui.GetWindowDrawList(),
        x:ImGui.GetCursorScreenPos().x,
        y:ImGui.GetCursorScreenPos().y,
        x_scale:4,
        x_offset:0,
        GetTimeX:function(t) {
            return this.x + this.stream_name_width + (t * this.x_scale) + this.x_offset;
        },
        stream_height:20,
        stream_y:0,
        stream_name_width:100,
        range_col:0xFFA49780,
        indent:0,
        indent_size:10
    };
    
    return ctx;
}

function DrawTimelineEvent(ctx, name, time)
{
    var ey = ctx.stream_y + ctx.y; //event y
    var ex = ctx.GetTimeX(time); //event x
    ctx.draw.AddLine(
        {x:ex, y:ey},
        {x:ex, y:ey + ctx.stream_height},
        0xFFFFFFFF
    );
    
    ctx.draw.PushClipRect({x:ex, y:ey}, {x:ex + 200, y:ey + ctx.stream_height}, true);
    ctx.draw.AddText({x:ex+2, y:ey+2}, 0xFF0000FF, name);
    ctx.draw.PopClipRect();
}

function DrawTimelineRange(ctx, name, start, end)
{
    if(start == end)
    {
        DrawTimelineEvent(ctx, name, start);
        return;
    }
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

function DrawStreamName(ctx, name, has_children)
{
    var sy = ctx.stream_y + ctx.y; //stream y
    var sx = ctx.x + 2 + ctx.indent;
    var sw = ctx.stream_name_width - ctx.indent; //stream width
    ctx.draw.PushClipRect({x:sx, y:sy}, {x:sx + sw, y:sy + ctx.stream_height}, true);
    //ctx.draw.AddRectFilled({x:sx,y:sy}, {x:sx + sw, y:sy + ctx.stream_height},0xFF444444 );
    //ctx.draw.AddText({x:sx+2, y:sy+2}, 0xFF0000FF, name);
    ImGui.SetCursorScreenPos({x:sx,y:sy});
    ImGui.BeginChild(name,{x:sw,y:ctx.stream_height}, false, ImGui.ImGuiWindowFlags.NoScrollbar );

    var flags = ImGui.ImGuiTreeNodeFlags.CollapsingHeader;
    if(has_children == false)
    {
        flags |= ImGui.ImGuiTreeNodeFlags.Leaf;
    }
    var open = ImGui.CollapsingHeader(has_children ? name : " " + name, flags);
    ImGui.EndChild();
    ctx.draw.PopClipRect();
    return open;
}

function DrawStream(ctx, stream)
{
	for([time, events] of stream.events_by_time) 
	{
	    for(var i=0; i<events.length; ++i)
	    {
	        var event = events[i];
	        DrawTimelineRange(ctx, event.name, time, event.end);
	    }
	}
	
    var has_children = stream.child_streams != null && Object.entries(stream.child_streams).length > 0;
    if(DrawStreamName(ctx, stream.name, has_children))
    {
        ctx.stream_y += 30;
        ctx.indent += ctx.indent_size;
        if(stream.child_streams != null)
        {
            for([key, child_stream] of Object.entries(stream.child_streams))
        	{
        	    DrawStream(ctx, child_stream);
        	}
        }
        ctx.indent -= ctx.indent_size;
    }
    else
    {
        ctx.stream_y += 30;
    }
}

function AddTimeline(id, timeline)
{
    var ctx = CreateTimelineContext();

    if(ImGui.CollapsingHeader("Vis Options"))
    {
        ImGui.Indent();
        ImGui.SliderFloat("Scale X", (_ = ctx.x_scale) => ctx.x_scale = _, 0.1, 50.0);
        ImGui.SliderFloat("Scroll X", (_ = ctx.x_offset) => ctx.x_offset = _, -200.0, 200.0);
        ImGui.Unindent();
    }
    ImGui.BeginChild(id, new ImGui.Vec2(-1,-1), true, ImGui.ImGuiWindowFlags.HorizontalScrollbar)
    ImGui.BeginChild("TimelineScrollArea", new ImGui.Vec2(500,100));
    
    var p = ImGui.GetCursorScreenPos();
    ctx.x = p.x;
    ctx.y = p.y;

    for([key, stream] of Object.entries(timeline.streams))
	{
	    DrawStream(ctx, stream);
	}

    /*
    DrawTimelineRange(ctx, "Test Range", 5, 25);
    
    DrawTimelineEvent(ctx, "Event", 35);
    DrawStreamName(ctx, "Frank");
    
    ctx.stream_y = 30;
    DrawTimelineRange(ctx, "Test Range 2", 15, 50);
    DrawStreamName(ctx, "Bob");
    
    ctx.stream_y = 60;
    DrawTimelineRange(ctx, "Test Range 3", 15, 50);
    DrawStreamName(ctx, "Mike");
    */

    ImGui.EndChild();
    ImGui.EndChild();
}

/*
var demo_data = 
{
    streams:{
        test_1:{
            name:"Test1",
            events_by_time:new Map(),
            child_streams:{
                child_1:{
                    name:"Child1",
                    events_by_time:new Map(),
                }
            }
        },
        test_2:{
            name:"Test2",
            events_by_time:new Map()
        }
    }
};

demo_data.streams.test_1.events_by_time.set(5, [{name:"hi",end:5}])
demo_data.streams.test_1.child_streams.child_1.events_by_time.set(5, [{name:"yo",end:15}])

AddTimeline("t", demo_data);
*/