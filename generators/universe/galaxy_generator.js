//var galaxyDataDef = {
//	version:1,
//	name:"Solar System",
//	fields:{
//		numPlanets:{			type:"int", min:0, max:10}
//	}
//};

var galaxyGenerator = {
	version:1,
	name:"Galaxy",
	category:["Universe"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			//system:{		type:"data_def",		default_def:galaxyDataDef	}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			//data:{ type:"data_def", default_def:galaxyDataDef }
		],
	},
	script:function(inputs, outputs){
		outputs.data = inputs;
	}
}
bg.RegisterProjectGenerator(bg.global_project, galaxyGenerator);