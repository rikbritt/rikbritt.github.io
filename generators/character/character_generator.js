var characterGenerator = {
	version:1,
	name:"Character",
	category:["Character"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"species",		type:"data",		dataType:speciesDataDef	},
			{ name:"culture",		type:"data",		dataType:cultureDataDef,
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
bg.RegisterGenerator(characterGenerator);