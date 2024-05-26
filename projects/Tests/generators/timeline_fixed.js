export var generator = {
	version:1,
	name:"Fixed Timeline",
	category:["Test"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data",		type:"timeline"	}
		],
	},
	script:function(inputs, outputs)
    {
        var timeline = bg.TimelineCreate("Test Timeline");
		var rik_stream = bg.TimelineCreateStream(timeline, "Rik", {age:25});
        bg.TimelineAddStreamEvent(rik_stream, bg.TimelineDateToTime(3, 10, 1982), "Born", {});
        bg.TimelineAddStreamEvent(rik_stream, bg.TimelineDateToTime(5, 6, 2010), "Married", {});
        bg.TimelineAddStreamEvent(rik_stream, bg.TimelineDateToTime(12, 16, 2011), "Daughter Born", {data:"hi"});

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
};