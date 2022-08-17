bg.TimelineInternal = 
{
    CreateStream:function(name, meta_data)
    {
        var stream = 
        {
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
            },
            CalcNumStreams:function()
            {
                var count = Object.keys(this.streams).length;
                for([key, child_stream] of Object.entries(this.streams))
                {
                    count += child_stream.CalcNumStreams();
                }
                return count;
            }
        };
        return stream;
    }
};

bg.TimelineDateToTime = function(day, month, year)
{
    var d = new Date(year, month-1, day);
    return d.getTime() / 1000;
};

bg.TimelineCreate = function(name, meta_data)
{
    return {
        name:name,
        meta:meta_data,
        data_type:"timeline",
        root_stream:bg.TimelineInternal.CreateStream(name, {}),
        CalcTimelineLastTime:function()
        {
            return this.root_stream.CalcTimelineLastTime(0);
        },
        CalcNumStreams:function()
        {
            return this.root_stream.CalcNumStreams();
        }
    };
}

bg.TimelineCreateStream = function(timeline, name, meta_data)
{
    return bg.TimelineCreateChildStream(timeline.root_stream, name, meta_data);
}

bg.TimelineCreateChildStream = function(parent_stream, name, meta_data)
{
    //TODO: Check for name clash?
    var stream = bg.TimelineInternal.CreateStream(name, meta_data);
    parent_stream.streams[name] = stream;
    return stream;
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