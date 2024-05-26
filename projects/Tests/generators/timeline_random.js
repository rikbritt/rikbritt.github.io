export var generator = {
	version:1,
	name:"Random Timeline",
	category:["Test"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"num_streams",			type:"int", 	min:0,	max:100 },
		],
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
		for(var i=0; i<inputs.num_streams; ++i)
		{
			var s = bg.TimelineCreateStream(timeline, "" + i, {});
			bg.TimelineAddStreamEvent(s, i, "Test", {});
		}
        outputs.data = timeline;
	}
};