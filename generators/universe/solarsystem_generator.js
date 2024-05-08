var solarSystemDataDef = {
	version:1,
	name:"Solar System",
	id:"c8d8de00-7013-4c81-a398-68f0ab392c54",
	fields:[
		{ name:"planets",			type:"list", min:0, max:20, elementType:{ type:"int", min:0,	max:3 }	}
	]
};

bg.RegisterProjectDataDef(bg.global_project, solarSystemDataDef);

var solarSystemGenerator = {
	version:1,
	name:"Solar System",
	category:["Universe"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"system",		type:"data_def",		default_def:"c8d8de00-7013-4c81-a398-68f0ab392c54"	}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data", 			type:"data_def", default_def:"c8d8de00-7013-4c81-a398-68f0ab392c54" }
		],
	},
	script:function(inputs, outputs){
		outputs.data = inputs.system;
	}
}
bg.RegisterProjectGenerator(bg.global_project, solarSystemGenerator);