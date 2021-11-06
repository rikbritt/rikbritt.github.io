

var characterGenerator = {
	version:1,
	name:"Character",
	category:"Character",
	inputs:{
		species:{		type:"data",		dataType:speciesDataDef	},
		culture:{		type:"data",		dataType:cultureDataDef,
			description:"What culture a character identifies with. What if a character is influenced by multiple cultures?"
		},
		age:{			type:"time",		units:"years",		min:0, max:200,
			script:function(buildingDataDef) {
				return buildingDataDef.species.ageStartAdulthood;
			}
		},
		name:{			type:"text"}
		
		//todo: character traits
	},
	outputs:{
		//model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.data = inputs;
	}
}
bg.RegisterGenerator(characterGenerator);