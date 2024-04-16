
var mm_suspectDataDef = {
	version:1,
	name:"Suspect",
	fields:[
		{ name:"person",			type:"data",		dataType:mm_personDataDef	}
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
			{ name:"suspect",			type:"data",		dataType:mm_suspectDataDef	}
			
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