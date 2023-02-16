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
			{ name:"system",		type:"data",		dataType:solarSystemDataDef	}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data", 			type:"data", dataType:solarSystemDataDef }
		],
	},
	script:function(inputs, outputs){
		outputs.data = inputs.system;
	}
}
bg.RegisterGenerator(solarSystemGenerator);