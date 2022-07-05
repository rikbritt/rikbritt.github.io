
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
        var timeline = bg.CreateTimeline("Test Timeline");
        bg.TimelineAddEvent(timeline, 10, "Test", {});
        bg.TimelineAddEvent(timeline, 10, "Test2", {});
        bg.TimelineAddEvent(timeline, 20, "Test3", {});
        outputs.data = timeline;
	}
}
bg.RegisterGenerator(testTimelineGenerator);