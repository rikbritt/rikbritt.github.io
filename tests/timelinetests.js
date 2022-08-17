
var testFixedTimelineGenerator = {
	version:1,
	name:"Fixed Timeline",
	category:["Test"],
	inputs:{
	},
	outputs:{
		data:{		type:"timeline"	}
	},
	script:function(inputs, outputs)
    {
        var timeline = bg.TimelineCreate("Test Timeline");
		var rik_stream = bg.TimelineCreateStream(timeline, "Rik", {age:25});
        bg.TimelineAddStreamEvent(rik_stream, bg.TimelineDateToTime(1982, 10, 3), "Born", {});
        bg.TimelineAddStreamEvent(rik_stream, bg.TimelineDateToTime(2010, 6, 5), "Married", {});
        bg.TimelineAddStreamEvent(rik_stream, bg.TimelineDateToTime(2011, 16, 12), "Daughter Born", {data:"hi"});

		var bob_stream = bg.TimelineCreateStream(timeline, "Bob", {age:25});
        bg.TimelineAddStreamEvent(bob_stream, 10, "Test", {});
        bg.TimelineAddStreamEvent(bob_stream, 10, "Test2", {});
        bg.TimelineAddStreamRange(bob_stream, 40, 130, "Test3", {data:"hi"});

		var frank_stream = bg.TimelineCreateStream(timeline, "Frank", {age:25});
        bg.TimelineAddStreamEvent(frank_stream, 10, "Test", {});
        bg.TimelineAddStreamEvent(frank_stream, 10, "Test2", {});
        bg.TimelineAddStreamRange(frank_stream, 60, 140, "Test3", {data:"hi"});

		var child1 = bg.TimelineCreateChildStream(frank_stream, "Child1");
        bg.TimelineAddStreamEvent(child1, 12, "Child1Test", {});
        outputs.data = timeline;
	}
}
bg.RegisterGenerator(testFixedTimelineGenerator);


var testTimelineGenerator = {
	version:1,
	name:"Random Timeline",
	category:["Test"],
	inputs:{
		num_streams:{			type:"int", 	min:0,	max:100 },
	},
	outputs:{
		data:{		type:"timeline"	}
	},
	script:function(inputs, outputs)
    {
        var timeline = bg.TimelineCreate("Test Timeline");
		for(var i=0; i<inputs.num_streams; ++i)
		{
			var s = bg.TimelineCreateStream(timeline, "" + i, {});
			bg.TimelineAddStreamEvent(s, i, "Test", {});
		}
        outputs.data = timeline;
	}
}
bg.RegisterGenerator(testTimelineGenerator);