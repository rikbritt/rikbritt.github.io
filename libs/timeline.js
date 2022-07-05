bg.CreateTimeline = function(name)
{
    return {
        name:name,
        events_by_time: new Map()
    };
}

bg.TimelineAddEvent = function(timeline, time, name, meta_data)
{
    var events_for_time = timeline.events_by_time.get(time);
    if(events_for_time == null)
    {
        events_for_time = [];
        timeline.events_by_time.set(time, events_for_time);
    }
    events_for_time.push(
        {
            name:name,
            meta:meta_data
        }
    );
}