
var mm_murdererGenerator = {
	version:1,
	name:"Murderer",
	category:["Murder Mystery"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"suspect",			type:"data_def",		default_def:"378773d6-50dd-4c1e-9474-e9bc8335c0ba"	}
			
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