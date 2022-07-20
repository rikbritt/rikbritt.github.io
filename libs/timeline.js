bg.TimelineCreate = function(name, meta_data)
{
    return {
        name:name,
        streams:{},
        meta:meta_data,
        data_type:"timeline"
    };
}

bg.TimelineCreateStream = function(timeline, name, meta_data)
{
    //TODO: Check for name clash?
    var stream = {
        name:name,
        meta:meta_data,
        events_by_time:new Map()
    };
    timeline.streams[name] = stream;
    return stream;
}

bg.TimelineAddStreamEvent = function(stream, time, name, meta_data)
{
    return bg.TimelineAddStreamEvent(stream, time, time, name, meta_data);
}


bg.TimelineAddStreamRange = function(stream, start_time, end_time, name, meta_data)
{
    var events_for_time = stream.events_by_time.get(time);
    if(events_for_time == null)
    {
        events_for_time = [];
        stream.events_by_time.set(time, events_for_time);
    }
    events_for_time.push(
        {
            name:name,
            end:end_time,
            meta:meta_data
        }
    );
}