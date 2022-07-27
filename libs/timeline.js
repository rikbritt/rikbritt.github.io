bg.TimelineCreate = function(name, meta_data)
{
    return {
        name:name,
        streams:{},
        meta:meta_data,
        data_type:"timeline",
        last_time:0,
        CalcTimelineLastTime:function()
        {
            var last_time = 0;
            if(this.last_time > last_time)
            {
                last_time = this.last_time;
            }
            for([key, child_stream] of Object.entries(this.streams))
        	{
                last_time = child_stream.CalcTimelineLastTime(last_time);
            }
            return last_time;
        }
    };
}

bg.TimelineCreateStream = function(timeline, name, meta_data)
{
    //TODO: Check for name clash?
    var stream = {
        name:name,
        meta:meta_data,
        events_by_time:new Map(),
        streams: {},
        last_time:0,
        CalcTimelineLastTime:function(last_time) //checks children too
        {
            if(this.last_time > last_time)
            {
                last_time = this.last_time;
            }
            for([key, child_stream] of Object.entries(this.streams))
        	{
                last_time = child_stream.CalcTimelineLastTime(last_time);
            }
            return last_time;
        }
    };
    timeline.streams[name] = stream;
    return stream;
}

bg.TimelineCreateChildStream = function(parent_stream, name, meta_data)
{
    return bg.TimelineCreateStream(parent_stream, name, meta_data);
}

bg.TimelineAddStreamEvent = function(stream, time, name, meta_data)
{
    return bg.TimelineAddStreamRange(stream, time, time, name, meta_data);
}

bg.TimelineAddStreamRange = function(stream, start_time, end_time, name, meta_data)
{
    var events_for_time = stream.events_by_time.get(start_time);
    if(events_for_time == null)
    {
        events_for_time = [];
        stream.events_by_time.set(start_time, events_for_time);
    }
    events_for_time.push(
        {
            name:name,
            end:end_time,
            meta:meta_data
        }
    );

    if(end_time > stream.last_time)
    {
        stream.last_time = end_time;
    }
}