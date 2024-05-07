var characterGenerator = {
	version:1,
	name:"Character",
	category:["Character"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"species",		type:"data_def",		default_def:"e328b056-9a1b-44e1-bb67-75e28746c83f"	},
			{ name:"culture",		type:"data_def",		default_def:"fec27e18-039c-4716-ba4f-1f13cde4bb14",
				description:"What culture a character identifies with. What if a character is influenced by multiple cultures?"
			},
			{ name:"age", 			type:"time",		units:"years",		min:0, max:200,
				script:function(buildingDataDef) {
					return buildingDataDef.species.ageStartAdulthood;
				}
			},
			{ name:"name",			type:"text"}
			
			//todo: character traits
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			//{ name:"model",			type:"model"	}
		],
	},
	script:function(inputs, outputs){
		outputs.data = inputs;
	}
}

bg.RegisterProjectGenerator(bg.global_project, characterGenerator);