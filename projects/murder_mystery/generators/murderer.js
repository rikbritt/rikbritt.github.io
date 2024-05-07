
var mm_murdererGenerator = {
	version:1,
	name:"Murderer",
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
			//model:{			type:"model"	}
		],
	},
	script:function(inputs, outputs){
		outputs.data = inputs;
		
		
	}
}
bg.RegisterProjectGenerator(bg.global_project, mm_murdererGenerator);