
var testTimelineGenerator = {
	version:1,
	name:"Timeline",
	category:["Test"],
	inputs:{
	},
	outputs:{
		data:{		type:"timeline"	}
	},
	script:function(inputs, outputs)
    {
        var timeline = bg.TimelineCreate("Test Timeline");
		var bob_stream = bg.TimelineCreateStream(timeline, "Bob", {age:25});
        bg.TimelineAddStreamEvent(bob_stream, 10, "Test", {});
        bg.TimelineAddStreamEvent(bob_stream, 10, "Test2", {});
        bg.TimelineAddStreamRange(bob_stream, 20, 30, "Test3", {data:"hi"});

		var frank_stream = bg.TimelineCreateStream(timeline, "Frank", {age:25});
        bg.TimelineAddStreamEvent(frank_stream, 10, "Test", {});
        bg.TimelineAddStreamEvent(frank_stream, 10, "Test2", {});
        bg.TimelineAddStreamRange(frank_stream, 20, 40, "Test3", {data:"hi"});

		var child1 = bg.TimelineCreateChildStream(frank_stream, "Child1");
        bg.TimelineAddStreamEvent(child1, 12, "Child1Test", {});
        outputs.data = timeline;
	}
}
bg.RegisterGenerator(testTimelineGenerator);