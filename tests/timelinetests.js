
var testTimelineGenerator = {
	version:1,
	name:"Timeline",
	category:["Test"],
	inputs:{
	},
	outputs:{
		data:{		type:"text"	}
	},
	script:function(inputs, outputs)
    {
        var timeline = bg.TimelineCreate("Test Timeline");
		var bob_stream = bg.TimelineCreateStream(timeline, "Bob", {age:25});
        bg.TimelineAddStreamEvent(bob_stream, 10, "Test", {});
        bg.TimelineAddStreamEvent(bob_stream, 10, "Test2", {});
        bg.TimelineAddStreamEvent(bob_stream, 20, "Test3", {data:"hi"});
        outputs.data = timeline;
	}
}
bg.RegisterGenerator(testTimelineGenerator);