var solarSystemDataDef = {
	version:1,
	name:"Solar System",
	fields:[
		{ name:"planets",			type:"list", min:0, max:20, elementType:{ type:"int", min:0,	max:3 }	}
	]
};

var solarSystemGenerator = {
	version:1,
	name:"Solar System",
	category:["Universe"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"system",		type:"data_def",		default_def:solarSystemDataDef	}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data", 			type:"data_def", default_def:solarSystemDataDef }
		],
	},
	script:function(inputs, outputs){
		outputs.data = inputs.system;
	}
}
bg.RegisterProjectGenerator(bg.global_project, solarSystemGenerator);