
var personalityGenerator = {
	version:1,
	name:"Personality",
	category:["Character"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"personalityCoreWeight",		type:"data_def",		default_def:"7ddb8611-0575-46c5-9511-665b570bd233"	},
			{ name:"personalityWeightDataDef",	type:"data_def",		default_def:"dc5eae14-0ccf-414b-a9ea-6eaae1d13ac6"	}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data", 						type:"data_def",		default_def:"dc5eae14-0ccf-414b-a9ea-6eaae1d13ac6"	}
		],
	},
	script:function(inputs, outputs){
		
		//Generate all personality values using a weighted bell curve.
		
		outputs.data = {core:inputs.personalityCoreWeight, personality:inputs.personalityWeightDataDef};
	}
}
bg.RegisterProjectGenerator(bg.global_project, personalityGenerator);