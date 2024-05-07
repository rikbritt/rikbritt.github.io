
var mm_suspectDataDef = {
	version:1,
	name:"Suspect",
	fields:[
		{ name:"person",			type:"data_def",		default_def:"af338b4d-8a4c-4fd8-ab8c-466a624f032e"	}
	]
}

var mm_suspectGenerator = {
	version:2,
	name:"Suspect",
	id:"mm_suspect",
	category:["Murder Mystery"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"suspect",			type:"data_def",		default_def:mm_suspectDataDef	}
			
			//todo: character traits
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			//{ name:"data",		type:"text"	}
		],
	},
	script:function(inputs, outputs){
		outputs.data = inputs;
		outputs.data.career = bg.RunGenerator(mm_careerGenerator, inputs.seed, {}).outputs.data;
		
	}
}
bg.RegisterProjectGenerator(bg.global_project, mm_suspectGenerator);